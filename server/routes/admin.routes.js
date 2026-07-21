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

router.use(auth, allowRoles("admin"));

// --- User management ---
router.get("/users", getAllUsers);
router.get("/users/stats", getUserStats);
router.patch("/users/:id/role", changeUserRole);
router.patch("/users/:id/suspend", toggleSuspendUser);
router.delete("/users/:id", deleteUser);

module.exports = router;