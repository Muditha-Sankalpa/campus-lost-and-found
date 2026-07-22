const express = require("express");
const router = express.Router();

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

module.exports = router;
