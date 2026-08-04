const express = require("express");
const router = express.Router();
const {
  getModeratorDashboard,
  reviewItem,
  reviewClaim,
  getAllUsers,
  getUserStats,
  changeUserRole,
  toggleSuspendUser,
  deleteUser,
  getDashboardOverview,
  getAnalytics,
  getActivityLogs,
} = require("../controllers/admin.controller");

const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Moderator routes — accessible to moderators and admins
router.get("/moderator/dashboard", auth, allowRoles("moderator", "admin"), getModeratorDashboard);
router.post("/items/:id/review", auth, allowRoles("moderator", "admin"), reviewItem);
router.post("/items/:id/claims/review", auth, allowRoles("moderator", "admin"), reviewClaim);

// Admin-only routes
router.use(auth, allowRoles("admin"));

// Dashboard
router.get("/dashboard", getDashboardOverview);

// Users
router.get("/users", getAllUsers);
router.get("/users/stats", getUserStats);
router.patch("/users/:id/role", changeUserRole);
router.patch("/users/:id/suspend", toggleSuspendUser);
router.delete("/users/:id", deleteUser);

// Analytics
router.get("/analytics", getAnalytics);

// Activity logs
router.get("/activity", getActivityLogs);

module.exports = router;
