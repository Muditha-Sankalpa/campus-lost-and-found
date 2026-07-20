const jwt = require("jsonwebtoken");

// Basic JWT auth guard.
// Expects header: Authorization: Bearer <token>
// This assumes Member 1 (Auth & User Management) issues tokens signed with
// process.env.JWT_SECRET and payload { id: user._id, role: user.role }
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role, ... }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

// Restrict route to specific roles, e.g. authorize("moderator", "admin")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

module.exports = { protect, authorize };
