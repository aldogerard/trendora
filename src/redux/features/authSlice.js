import { axiosInstance } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const loadFromLocalStorage = () => {
    try {
        return localStorage.getItem("token");
    } catch (error) {
        return null;
    }
};

export const isTokenValid = (token) => {
    if (!token) return false;

    try {
        const { exp } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (exp <= currentTime) return false;
    } catch (error) {
        return false;
    }
    return !!token;
};

export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post("auth/login", {
                username,
                password,
                expiresInMins: 15,
            });
            return data;
        } catch (error) {
            return rejectWithValue("Login Failed");
        }
    }
);

export const getMe = createAsyncThunk(
    "auth/getMe",
    async ({ token }, { rejectWithValue }) => {
        try {
            const accessToken = token || loadFromLocalStorage();

            if (!isTokenValid(accessToken))
                return rejectWithValue("Invalid Token");

            const { data } = await axiosInstance.get("auth/me", {
                Authorization: `Bearer ${accessToken}`,
            });
            return { accessToken, data };
        } catch (error) {
            return rejectWithValue("Invalid Token");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: loadFromLocalStorage() || null,
    },
    reducers: {
        setUser(state, action) {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;

            localStorage.setItem("token", token);
        },
        clearUser(state) {
            state.user = null;
            state.token = null;

            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                const { accessToken } = action.payload;
                state.token = accessToken;

                localStorage.setItem("token", accessToken);
            })
            .addCase(login.rejected, (state, action) => {
                state.user = null;
                state.token = null;

                localStorage.removeItem("token");
            })
            .addCase(getMe.fulfilled, (state, action) => {
                const { accessToken, data } = action.payload;
                state.user = data;
                state.token = accessToken;

                localStorage.setItem("token", accessToken);
            })
            .addCase(getMe.rejected, (state, action) => {
                state.user = null;
                state.token = null;

                localStorage.removeItem("token");
            });
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
