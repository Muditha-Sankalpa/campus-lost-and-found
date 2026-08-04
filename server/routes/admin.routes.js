const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');

router.get('/dashboard', auth, allowRoles('moderator', 'admin'), adminController.getModeratorDashboard);
router.post('/items/:id/review', auth, allowRoles('moderator', 'admin'), adminController.reviewItem);
router.post('/items/:id/claims/review', auth, allowRoles('moderator', 'admin'), adminController.reviewClaim);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
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
