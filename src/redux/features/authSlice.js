import { axiosInstance } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }) => {
        const { data } = await axiosInstance.post("auth/login", {
            username,
            password,
        });
        return data;
    }
);

const loadFromLocalStorage = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        return { user, token };
    } catch (error) {
        return { user: null, token: null };
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: loadFromLocalStorage().user || null,
        token: loadFromLocalStorage().token || null,
    },
    reducers: {
        setUser(state, action) {
            console.log(action.payload);
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
        },
        clearUser(state) {
            state.user = null;
            state.token = null;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            const { accessToken, email, id } = action.payload;
            state.user = { email, id };
            state.token = accessToken;

            localStorage.setItem("user", JSON.stringify({ email, id }));
            localStorage.setItem("token", accessToken);
        });
    },
});

export const selectIsLogin = (state) => {
    const { user, token } = state.auth;

    if (!token) return false;

    try {
        const { exp } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (exp < currentTime) return false;
    } catch (error) {
        return false;
    }

    return !!user && !!token;
};

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
