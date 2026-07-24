const Announcement = require("../models/Announcement");

// GET /api/announcements — public: fetch active announcements
exports.getActiveAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      isPublished: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({ announcements });
  } catch (err) {
    console.error("getActiveAnnouncements error:", err);
    return res.status(500).json({ message: "Failed to fetch announcements." });
  }
};

// GET /api/admin/announcements — admin: fetch all (including unpublished/expired)
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    return res.json({ announcements });
  } catch (err) {
    console.error("getAllAnnouncements error:", err);
    return res.status(500).json({ message: "Failed to fetch announcements." });
  }
};

// POST /api/admin/announcements — admin: create
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, body, type, isPublished, expiresAt } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required." });
    }

    const announcement = new Announcement({
      title,
      body,
      type: type || "info",
      isPublished: isPublished !== undefined ? isPublished : true,
      expiresAt: expiresAt || null,
      createdBy: req.userId,
    });

    await announcement.save();
    return res.status(201).json({ announcement });
  } catch (err) {
    console.error("createAnnouncement error:", err);
    return res.status(500).json({ message: "Failed to create announcement." });
  }
};

// PATCH /api/admin/announcements/:id — admin: update
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, type, isPublished, expiresAt } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (body !== undefined) updates.body = body;
    if (type !== undefined) updates.type = type;
    if (isPublished !== undefined) updates.isPublished = isPublished;
    if (expiresAt !== undefined) updates.expiresAt = expiresAt || null;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found." });
    }

    return res.json({ announcement });
  } catch (err) {
    console.error("updateAnnouncement error:", err);
    return res.status(500).json({ message: "Failed to update announcement." });
  }
};

// DELETE /api/admin/announcements/:id — admin: delete
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found." });
    }

    return res.json({ message: "Announcement deleted." });
  } catch (err) {
    console.error("deleteAnnouncement error:", err);
    return res.status(500).json({ message: "Failed to delete announcement." });
  }
};