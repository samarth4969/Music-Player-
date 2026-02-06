import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Homepage from "./pages/Homepage.jsx";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ResetPassword from "./components/auth/ResetPassword";

import {
  setUser,
  setLoading,
  setError,
  clearError,
  logout,
} from "./redux/slices/authSlice";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { token, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken || user) return;

    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        dispatch(
          setUser({
            user: res.data,
            token: storedToken,
          })
        );
      } catch (err) {
        console.error("Error fetching user data:", err);
        dispatch(logout());
        dispatch(setError("Session expired. Please log in again."));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser(); // ✅ VERY IMPORTANT
  }, [dispatch, token, user, error]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
