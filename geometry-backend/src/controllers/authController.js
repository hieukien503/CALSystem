const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Signup successful", user });
    } catch (err) {
        res.status(500).json({ message: "Error signing up", error: err.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });

        res.json({ message: "Login successful", token, user });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};

// Profile
const profile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error loading profile", error: err.message });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // ⚠️ Here you should send email reset link
        res.json({ message: "Password reset link sent (mock)" });
    } catch (err) {
        res.status(500).json({ message: "Error in forgot password", error: err.message });
    }
};

module.exports = { signup, login, profile, forgotPassword };
