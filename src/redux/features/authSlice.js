import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const loadFromLocalStorage = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        return { user, token };
    } catch (error) {
        return { user: null, token: null };
    }
};

const { user, token } = loadFromLocalStorage();

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: user || null,
        token: token || null,
    },
    reducers: {
        setUser(state, action) {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("authToken", token);
        },
        clearUser(state) {
            state.user = null;
            state.token = null;

            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
        },
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
