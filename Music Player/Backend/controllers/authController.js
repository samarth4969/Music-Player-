import imagekit from "../config/imagekit.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import sendMail from "../utils/sendemail.js";


dotenv.config();

/* Generate JWT */
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

   const existingUser = await User.findOne({ email });
if (existingUser) {
  return res.status(409).json({
    message: "User with this email is already registered",
  });
}


    let avatarUrl = "";
if (avatar) {
  const base64Data = avatar.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const uploadResponse = await imagekit.upload({
    file: base64Data,
    fileName: `avatar_${Date.now()}.jpg`, // ✅ REQUIRED
    folder: "/mern-music-player",
  });

  avatarUrl = uploadResponse.url;
}


    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarUrl,
    });

    const token = createToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Signup error" });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
         avatar: user.avatar, // ✅ ADD THIS
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login error" });
  }
};

/* ================= GET ME ================= */
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await User.findById(req.user.id).select(
    "name email avatar"
  );

  res.status(200).json({ user });
};


/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
if (!user) {
  return res.status(404).json({ message: "User not found" });
}

// ✅ ADD THIS
if (
  user.resetPasswordTokenExpires &&
  user.resetPasswordTokenExpires > Date.now()
) {
  return res.status(429).json({
    message: "Reset link already sent. Please wait 10 minutes.",
  });
}


    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 10 minutes</p>
      `,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* ================= EDIT PROFILE ================= */
/* ================= EDIT PROFILE ================= */
const editProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const {
      name,
      email,
      avatar,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ================= UPDATE NAME ================= */
    if (name) {
      user.name = name;
    }

    /* ================= UPDATE EMAIL (UNIQUE CHECK) ================= */
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }
      user.email = email;
    }

    /* ================= UPDATE PASSWORD ================= */
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Both current and new password are required",
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          message: "Current password incorrect",
        });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({
          message: "New password must be different",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      user.password = newPassword;
    }

    /* ================= UPDATE AVATAR ================= */
    if (avatar) {
  const base64Data = avatar.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const uploadResponse = await imagekit.upload({
    file: base64Data,
    fileName: `avatar_${userId}_${Date.now()}.jpg`,
    folder: "/mern-music-player",
  });

  user.avatar = uploadResponse.url;
}


    /* ================= SAVE ================= */
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Edit profile error:", error.message);
    res.status(500).json({
      message: "Error updating profile",
    });
  }
};


export { signup, login, getMe, forgotPassword, resetPassword, editProfile };
