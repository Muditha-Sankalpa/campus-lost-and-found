const express = require("express");
const router = express.Router();
const {
  submitMessage,
  getAllMessages,
  updateMessage,
  deleteMessage,
} = require("../controllers/contact.controller");

const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Public: anyone can send a contact message (no auth required)
router.post("/", submitMessage);

// Admin only
router.get("/admin", auth, allowRoles("admin"), getAllMessages);
router.patch("/admin/:id", auth, allowRoles("admin"), updateMessage);
router.delete("/admin/:id", auth, allowRoles("admin"), deleteMessage);

module.exports = router;