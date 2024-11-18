import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
    },
    reducers: {
        setUser(state, action) {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
        },
        clearUser(state) {
            state.user = null;
            state.token = null;
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
