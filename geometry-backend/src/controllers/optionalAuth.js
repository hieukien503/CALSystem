// src/middleware/optionalAuth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // no token — tiếp tục, req.user undefined
      return next();
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("userId name email role");
      if (user) {
        req.user = {
          id: user._id,
          userId: user.userId,
          name: user.name,
          role: user.role
        };
      }
      console.log(`✅ OptionalAuth: token valid for ${user.userId} (${user.email})`);
    } catch (err) {
      // token invalid/expired => treat as not logged in (don't reject)
      console.warn("optionalAuth: invalid token - treat as guest");
    }
    return next();
  } catch (err) {
    console.error("optionalAuth error:", err);
    return next(); // vẫn tiếp tục
  }
};
