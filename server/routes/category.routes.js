const express = require("express");
const router = express.Router();
const {
  getActiveCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  hardDeleteCategory,
} = require("../controllers/category.controller");

const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Public: any authenticated user can see active categories (for dropdowns)
router.get("/", getActiveCategories);

// Admin only
router.get("/admin", auth, allowRoles("admin"), getAllCategories);
router.post("/admin", auth, allowRoles("admin"), createCategory);
router.patch("/admin/:id", auth, allowRoles("admin"), updateCategory);
router.delete("/admin/:id", auth, allowRoles("admin"), deleteCategory);
router.delete("/admin/:id/permanent", auth, allowRoles("admin"), hardDeleteCategory);

module.exports = router;