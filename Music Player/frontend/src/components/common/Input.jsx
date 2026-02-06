import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import "../../css/auth/Input.css";

const Input = ({
    value,
    onChange,
    label,
    placeholder,
    type = "text",
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const inputType =
        type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    return (
        <div className="input-wrapper">
            <label>{label}</label>

            <div className="input-container">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="input-field"
                />

                {type === "password" && (
                    <button
                        type="button"
                        className="input-eye-btn"
                        onClick={toggleShowPassword}
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? (
                            <FaRegEye size={22} />
                        ) : (
                            <FaRegEyeSlash size={22} />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;
