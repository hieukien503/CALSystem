// Example controllers – here you would load data if needed

const getCalApp = (req, res) => {
    res.json({ page: "CalApp", message: "Calendar App View" });
};

const getForgotPassword = (req, res) => {
    res.json({ page: "ForgotPassword", message: "Forgot Password View" });
};

const getHome = (req, res) => {
    res.json({ page: "Home", message: "Home Page" });
};

const getLogin = (req, res) => {
    res.json({ page: "Login", message: "Login View" });
};

const getProfilePage = (req, res) => {
    res.json({ page: "ProfilePage", message: "Profile Page View" });
};

const getSearchResults = (req, res) => {
    const { q } = req.query;
    res.json({ page: "SearchResults", keyword: q || null });
};

const getSignUp = (req, res) => {
    res.json({ page: "SignUp", message: "Sign Up View" });
};

module.exports = {
    getCalApp,
    getForgotPassword,
    getHome,
    getLogin,
    getProfilePage,
    getSearchResults,
    getSignUp
};
