import { axiosInstance } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const loadFromLocalStorage = () => {
    try {
        const token = localStorage.getItem("token");
        return { token };
    } catch (error) {
        return { token: null };
    }
};

export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post("auth/login", {
                username,
                password,
                expiresInMins: 30,
            });
            return data;
        } catch (error) {
            return rejectWithValue("Login Failed");
        }
    }
);

export const getMe = createAsyncThunk(
    "auth/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const { token } = loadFromLocalStorage();
            const { data } = await axiosInstance.get("auth/me", {
                Authorization: `Bearer ${token}`,
            });
            console.log(data);
        } catch (error) {
            return rejectWithValue("Invalid Token");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: loadFromLocalStorage().token || null,
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
        builder.addCase(login.fulfilled, (state, action) => {
            const { accessToken, email, id } = action.payload;
            state.user = { email, id };
            state.token = accessToken;

            localStorage.setItem("token", accessToken);
        });
    },
});

export const selectIsLogin = () => {
    const { token } = loadFromLocalStorage();
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

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
