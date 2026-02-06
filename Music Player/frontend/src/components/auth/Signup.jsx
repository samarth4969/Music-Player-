import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Input from "../common/Input";
import { CiUser } from "react-icons/ci";

import {
  clearError,
  setError,
  setLoading,
  setUser,
} from "../../redux/slices/authSlice";
import {
  closeAuthModal,
  switchAuthMode,
} from "../../redux/slices/uiSlice";

import "../../css/auth/Signup.css";

function Signup() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Avatar
  const [previewImage, setPreviewImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  dispatch(clearError());

  if (!fullname || !email || !password) {
    dispatch(setError("All fields are required"));
    return;
  }

  dispatch(setLoading(true));

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
      {
        name: fullname,
        email,
        password,
        avatar: base64Image || null,
      }
    );

    // ✅ AUTO LOGIN
    dispatch(
      setUser({
        user: res.data.user,
        token: res.data.token,
      })
    );

    // ✅ Save token
    localStorage.setItem("token", res.data.token);

    dispatch(setLoading(false));
    dispatch(closeAuthModal());

  } catch (err) {
    dispatch(
      setError(
        err?.response?.data?.message ||
          "Signup failed. Please try again."
      )
    );
    dispatch(setLoading(false));
  }
};



  return (
    <div className="signup-wrapper">
      <h3 className="signup-title">Create an account</h3>
      <p className="signup-subtitle">
        Join us today by entering your details
      </p>

      <form className="signup-form" onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="profile-image-container">
          {previewImage ? (
            <img
              src={previewImage}
              alt="avatar"
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">
              <CiUser size={40} />
            </div>
          )}

          <label className="image-upload-icon">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Inputs */}
        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Switch to Login */}
        <span
          className="forgot-link"
          onClick={() => {
            dispatch(clearError());
            dispatch(switchAuthMode("login"));
          }}
        >
          Already have an account? Login
        </span>

        {/* Error */}
        {error && <div className="signup-error">{error}</div>}

        {/* Actions */}
        <div className="signup-actions">
          <button
            className="signup-btn-submit"
            disabled={isLoading}
            type="submit"
          >
            <span>{isLoading ? "Signing up..." : "Signup"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
