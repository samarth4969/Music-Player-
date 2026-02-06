import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  setError,
  clearError,
  setUser,
  setLoading,
} from "../../redux/slices/authSlice";

import Input from "../common/Input";
import "../../css/auth/EditProfile.css";
import { CiUser } from "react-icons/ci";

function EditProfile({ onClose }) {
  const dispatch = useDispatch();

  // ✅ Redux state
  const { user, token, isLoading, error } = useSelector(
    (state) => state.auth
  );

  // ✅ Profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // ✅ Avatar
  const [previewImage, setPreviewImage] = useState("");
  const [base64Image, setBase64Image] = useState("");

  // Populate form from redux user
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPreviewImage(user.avatar || "");
    }
  }, [user]);

  // Avatar → base64
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result);
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const payload = {};

    if (name !== user.name) payload.name = name;
    if (email !== user.email) payload.email = email;
    if (base64Image) payload.avatar = base64Image;

    if (showPasswordFields) {
  if (!currentPassword || !newPassword) {
    dispatch(setError("Both passwords are required"));
    return;
  }

  if (currentPassword === newPassword) {
    dispatch(setError("New password must be different"));
    return;
  }

  payload.currentPassword = currentPassword;
  payload.newPassword = newPassword; // ✅ CORRECT

}


    if (Object.keys(payload).length === 0) {
      dispatch(setError("No changes to update"));
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        setUser({
          user: res.data.user,
          token,
        })
      );

      if (onClose) onClose();
    } catch (err) {
       console.log("EDIT PROFILE ERROR 👉", err.response);
      dispatch(
        setError(
          err?.response?.data?.message ||
            "Failed to update profile"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="editprofile-wrapper">
      <h3 className="editprofile-title">Edit Profile</h3>
      <p className="editprofile-subtitle">
        Update your profile information
      </p>

      <form className="editprofile-form" onSubmit={handleSubmit}>
        {!showPasswordFields && (
          <>
            {/* Avatar */}
            <div className="profile-image-container">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <CiUser size={60} />
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

            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        {showPasswordFields && (
          <>
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />
          </>
        )}

        {error && (
          <div className="editprofile-error">{error}</div>
        )}

        <button
          type="button"
          className="editprofile-password-toggle"
          onClick={() =>
            setShowPasswordFields(!showPasswordFields)
          }
        >
          {showPasswordFields
            ? "Back to Profile"
            : "Change Password"}
        </button>

        <div className="editprofile-actions">
          <button
            type="button"
            className="editprofile-btn-cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="editprofile-btn-submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
