const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const {
    loadHome,
    searchAll
} = require("../controllers/publicController");

// Auth routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile/:userId", getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Public views (no auth required)
router.get("/home", loadHome);               // Home.tsx
router.get("/search", searchAll);       // SearchResults.tsx

module.exports = router;
