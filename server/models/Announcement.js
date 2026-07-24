const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ["info", "warning", "urgent"],
      default: "info",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual: is this announcement currently active (published and not expired)
AnnouncementSchema.virtual("isActive").get(function () {
  if (!this.isPublished) return false;
  if (this.expiresAt && this.expiresAt < new Date()) return false;
  return true;
});

// Include virtuals when converting to JSON
AnnouncementSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Announcement", AnnouncementSchema);