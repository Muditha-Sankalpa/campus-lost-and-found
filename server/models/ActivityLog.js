const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "user.role_changed",
        "user.suspended",
        "user.unsuspended",
        "user.deleted",
        "announcement.created",
        "announcement.updated",
        "announcement.deleted",
        "category.created",
        "category.updated",
        "category.deleted",
        "category.hard_deleted",
      ],
    },
    targetType: {
      type: String,
      enum: ["User", "Announcement", "Item", "Claim"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);