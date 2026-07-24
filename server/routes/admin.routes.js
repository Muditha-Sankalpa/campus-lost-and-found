const express = require("express");
const router = express.Router();
<<<<<<< HEAD

const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/item.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public routes
router.get("/", getItems);
router.get("/:id", getItemById);

// Private routes (require login)
router.post("/", protect, upload.array("images", 5), createItem);
router.put("/:id", protect, upload.array("images", 5), updateItem);
router.delete("/:id", protect, deleteItem);
=======
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
>>>>>>> d43f376591a4cecabe8add19ad5eb37cf59cd362

module.exports = router;