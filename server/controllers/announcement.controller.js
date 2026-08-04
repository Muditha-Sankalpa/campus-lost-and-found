const Announcement = require("../models/Announcement");
const ActivityLog = require("../models/ActivityLog");

async function logActivity(actor, action, targetType, targetId, metadata = {}) {
  try {
    await ActivityLog.create({ actor, action, targetType, targetId, metadata });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

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

    await logActivity(req.userId, "announcement.created", "Announcement", announcement._id, {
      title: announcement.title,
      type: announcement.type,
    });

    return res.status(201).json({ announcement });
  } catch (err) {
    console.error("createAnnouncement error:", err);
    return res.status(500).json({ message: "Failed to create announcement." });
  }
};

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
    if (!announcement) return res.status(404).json({ message: "Announcement not found." });

    await logActivity(req.userId, "announcement.updated", "Announcement", announcement._id, {
      title: announcement.title,
    });

    return res.json({ announcement });
  } catch (err) {
    console.error("updateAnnouncement error:", err);
    return res.status(500).json({ message: "Failed to update announcement." });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found." });

    await logActivity(req.userId, "announcement.deleted", "Announcement", announcement._id, {
      title: announcement.title,
    });

    return res.json({ message: "Announcement deleted." });
  } catch (err) {
    console.error("deleteAnnouncement error:", err);
    return res.status(500).json({ message: "Failed to delete announcement." });
  }
};