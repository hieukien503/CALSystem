// controllers/middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware: Xác thực người dùng bằng JWT token
 * - Giải mã token từ header
 * - Tìm user tương ứng trong DB
 * - Gắn thông tin user vào req.user (bao gồm userId: "U0003")
 */
exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: user._id, // ObjectId trong Mongo
      userId: user.userId, // "U0003"
      email: user.email,
      role: user.role
    };
    
    console.log(`✅ Token valid for user: ${req.user.userId} (${req.user.email}) [authenticateUser]`);

    next();
  } catch (err) {
    console.error("Error in authentication:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
