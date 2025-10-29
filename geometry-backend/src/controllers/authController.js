const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

// --- Signup ---
const registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        let existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Generate incremental userId
        const lastUser = await User.findOne().sort({ createdAt: -1 });
        let nextId = 1;
        if (lastUser && lastUser.userId) {
            const num = parseInt(lastUser.userId.replace("U", ""), 10);
            nextId = num + 1;
        }
        const userId = `U${nextId.toString().padStart(4, "0")}`;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            userId,
            name: `${username}`,
            email,
            passwordHash: hashedPassword,
            project: [],
            role: "student", // default
        });

        await user.save();

        res.status(201).json({ message: "Signup successful", user });
    } catch (err) {
        res.status(500).json({ message: "Error signing up", error: err.message });
    }
};

// --- Login ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Sử dụng user._id làm id trong token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h"
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- Logout ---
const logoutUser = async (req, res) => {
    try {
        // If using JWT: client just discards token, or you keep blacklist server-side
        res.json({ message: "Logout successful (client should clear token)" });
    } catch (err) {
        res.status(500).json({ message: "Error logging out", error: err.message });
    }
};

// --- Profile ---
const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error loading profile", error: err.message });
    }
};

// --- Forgot Password ---
const forgotPassword = async (req, res) => {
    try {
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:3001/reset-password/${resetToken}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            text: `You are receiving this email because you (or someone else) requested a password reset for your account.\n\n
            Please click on the following link, or paste it into your browser to complete the process:\n\n
            ${resetLink}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset email sent successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error sending reset email", error: err.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.passwordHash = hashedPassword;
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined; // Clear the expiration
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Error resetting password", error: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    forgotPassword,
    resetPassword,
};
