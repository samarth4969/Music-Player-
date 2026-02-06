import { createSlice } from "@reduxjs/toolkit";

// ✅ Restore token from localStorage on app start
const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token: token,
  isAuthenticated: !!token, // ✅ FIX: derive auth from token
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      
    },

    // ✅ Called on successful login
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // ✅ Persist token
      localStorage.setItem("token", action.payload.token);
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // ✅ Logout = clear everything
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;

      localStorage.removeItem("token");
    },

    updateFavourites: (state, action) => {
      if (state.user) {
        state.user.favourites = action.payload;
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setUser,
  setError,
  logout,
  updateFavourites,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
