const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

        res.json({ message: "Login successful", token, user });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
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
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // ⚠️ Implement actual email sending here
        res.json({ message: "Password reset link sent (mock)" });
    } catch (err) {
        res.status(500).json({ message: "Error in forgot password", error: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    forgotPassword,
};
