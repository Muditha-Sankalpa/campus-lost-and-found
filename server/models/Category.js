const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Electronics",
        "Documents",
        "Accessories",
        "Bags",
        "Clothing",
        "Keys",
        "Pets",
        "Others",
      ],
      default: "Others",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["lost", "found", "recovered"],
      default: "lost",
    },
    images: [
      {
        type: String, // stored file path / URL
      },
    ],
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    moderationNote: {
      type: String, // optional reason set by moderator on rejection
      default: "",
    },
    contactInfo: {
      type: String, // optional phone/email for the reporter
      default: "",
    },
  },
  { timestamps: true }
);

// Text index to support keyword search on title/description/location
itemSchema.index({ title: "text", description: "text", location: "text" });

module.exports = mongoose.model("Item", itemSchema);