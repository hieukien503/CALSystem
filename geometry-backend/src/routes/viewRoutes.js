const express = require("express");
const router = express.Router();

// Controllers
const {
    getCalApp,
    getForgotPassword,
    getHome,
    getLogin,
    getProfilePage,
    getSearchResults,
    getSignUp
} = require("../controllers/viewController");

// Map React views to routes
router.get("/calapp", getCalApp);
router.get("/forgot-password", getForgotPassword);
router.get("/", getHome);
router.get("/login", getLogin);
router.get("/profile", getProfilePage);
router.get("/search", getSearchResults); // expects ?q=keyword
router.get("/signup", getSignUp);

module.exports = router;
