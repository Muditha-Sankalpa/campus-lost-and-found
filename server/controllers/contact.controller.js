const ContactMessage = require("../models/ContactMessage");
const ActivityLog = require("../models/ActivityLog");

async function logActivity(actor, action, targetType, targetId, metadata = {}) {
  try {
    await ActivityLog.create({ actor, action, targetType, targetId, metadata });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

// POST /api/contact — public: submit a message
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Simple email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const doc = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      // Attach user id if the sender happens to be logged in
      submittedBy: req.userId || null,
    });
    await doc.save();

    return res.status(201).json({
      message: "Thanks! We've received your message and will get back to you soon.",
    });
  } catch (err) {
    console.error("submitMessage error:", err);
    return res.status(500).json({ message: "Failed to send message." });
  }
};

// GET /api/contact/admin — admin: list all with filters
exports.getAllMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && ["new", "read", "replied", "archived"].includes(status)) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [messages, total, unreadCount] = await Promise.all([
      ContactMessage.find(query)
        .populate("handledBy", "name")
        .populate("submittedBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContactMessage.countDocuments(query),
      ContactMessage.countDocuments({ status: "new" }),
    ]);

    return res.json({
      messages,
      unreadCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("getAllMessages error:", err);
    return res.status(500).json({ message: "Failed to load messages." });
  }
};

// PATCH /api/contact/admin/:id — admin: update status and note
exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const updates = {};
    if (status !== undefined) {
      if (!["new", "read", "replied", "archived"].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
      }
      updates.status = status;
      updates.handledBy = req.userId;
      updates.handledAt = new Date();
    }
    if (adminNote !== undefined) {
      updates.adminNote = adminNote.trim();
    }

    const doc = await ContactMessage.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("handledBy", "name")
      .populate("submittedBy", "name email role");

    if (!doc) return res.status(404).json({ message: "Message not found." });

    if (status) {
      await logActivity(req.userId, "contact.status_changed", "ContactMessage", doc._id, {
        newStatus: status,
        subject: doc.subject,
      });
    }

    return res.json({ contactMessage: doc });
  } catch (err) {
    console.error("updateMessage error:", err);
    return res.status(500).json({ message: "Failed to update message." });
  }
};

// DELETE /api/contact/admin/:id — admin: delete
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await ContactMessage.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Message not found." });

    await logActivity(req.userId, "contact.deleted", "ContactMessage", doc._id, {
      subject: doc.subject,
    });

    return res.json({ message: "Message deleted." });
  } catch (err) {
    console.error("deleteMessage error:", err);
    return res.status(500).json({ message: "Failed to delete message." });
  }
};