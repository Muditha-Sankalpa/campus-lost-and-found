const express = require("express");
const router = express.Router();
const {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");

// Auth middleware attaches req.user = { id, role } from JWT
const auth = require("../middleware/auth.middleware");
// Role middleware: allowRoles("admin") or allowRoles("admin", "moderator")
const allowRoles = require("../middleware/role.middleware");

// --- Public endpoint (anyone can see active announcements) ---
router.get("/", getActiveAnnouncements);

// --- Admin-only endpoints ---
router.get("/admin", auth, allowRoles("admin"), getAllAnnouncements);
router.post("/admin", auth, allowRoles("admin"), createAnnouncement);
router.patch("/admin/:id", auth, allowRoles("admin"), updateAnnouncement);
router.delete("/admin/:id", auth, allowRoles("admin"), deleteAnnouncement);

module.exports = router;