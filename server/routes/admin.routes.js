const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserStats,
  changeUserRole,
  toggleSuspendUser,
  deleteUser,
} = require("../controllers/admin.controller");

const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Only admin users can access these routes
router.use(auth, allowRoles("admin"));

// ===============================
// User Management Routes
// ===============================

// Get all users
router.get("/users", getAllUsers);

// Get user statistics
router.get("/users/stats", getUserStats);

// Change user role
router.patch("/users/:id/role", changeUserRole);

// Suspend / activate user
router.patch("/users/:id/suspend", toggleSuspendUser);

// Delete user
router.delete("/users/:id", deleteUser);


module.exports = router;