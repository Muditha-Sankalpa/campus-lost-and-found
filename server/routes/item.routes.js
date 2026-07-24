const express = require("express");
const router = express.Router();

const ItemController = require("../controllers/Item.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Public routes
router.get("/", ItemController.getItems);
router.get("/:id", ItemController.getItemById);

// Protected routes
router.post("/", auth, upload.array("images", 6), ItemController.createItem);

router.patch("/:id", auth, upload.array("images", 6), ItemController.updateItem);

router.delete("/:id", auth, ItemController.deleteItem);

module.exports = router;