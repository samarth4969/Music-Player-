import React, { useState } from "react";
import Input from "../common/Input";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setError,
  clearError,
  
  setUser
} from "../../redux/slices/authSlice";
import {
  closeAuthModal,
  switchAuthMode,
} from "../../redux/slices/uiSlice";
import "../../css/auth/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { authMode } = useSelector((state) => state.ui);

  const isForgot = authMode === "forgot";

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validator.isEmail(email)) {
      dispatch(setError("Please enter a valid email"));
      return;
    }

    if (!password) {
      dispatch(setError("Please enter your password"));
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      dispatch(
        setUser({
          user: res.data.user,
          token: res.data.token,
        })
      );

      localStorage.setItem("token", res.data.token);
      dispatch(closeAuthModal());
    } catch (err) {
      dispatch(
        setError(err?.response?.data?.message || "Login failed")
      );
    }
  };

  /* ---------------- FORGOT PASSWORD ---------------- */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMsg("");

    if (!validator.isEmail(forgotEmail)) {
      setForgotMsg("Please enter a valid email");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
        { email: forgotEmail }
      );

      setForgotMsg(
        "If an account with that email exists, a reset link has been sent."
      );
    } catch (error) {
      setForgotMsg(
        "Error sending password reset email. Try again later."
      );
    }
  };

  return (
    <div className="login-wrapper">
      <h3 className="login-title">
        {isForgot ? "Forgot Password" : "Welcome back"}
      </h3>

      <p className="login-subtitle">
        {isForgot
          ? "Enter your email to reset password"
          : "Please enter your details to login"}
      </p>

      {/* LOGIN FORM */}
      {!isForgot && (
        <form className="login-form" onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="johndoe@email.com"
            type="email"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          <div className="forgot-wrapper">
            <span
              className="forgot-link"
              onClick={() => {
                dispatch(clearError());
                dispatch(switchAuthMode("forgot"));
              }}
            >
              Forgot Password?
            </span>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      )}

      {/* FORGOT PASSWORD FORM */}
      {isForgot && (
        <form className="login-form" onSubmit={handleForgotPassword}>
          <Input
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            label="Email Address"
            placeholder="johndoe@email.com"
            type="email"
          />

          {forgotMsg && (
            <div className="login-info">{forgotMsg}</div>
          )}

          <button type="submit" className="login-submit-btn">
            Send Reset Link
          </button>

          <div className="forgot-wrapper">
            <span
              className="forgot-link"
              onClick={() => dispatch(switchAuthMode("login"))}
            >
              Back to Login
            </span>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
