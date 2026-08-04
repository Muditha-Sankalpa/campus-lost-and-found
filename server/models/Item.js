const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true },
    location: { type: String, trim: true },
    status: { type: String, enum: ['lost', 'found', 'recovered'], default: 'lost' },
    images: [{ type: String }],
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    moderationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    moderationReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderationReviewedAt: { type: Date },
    moderationReason: { type: String, trim: true },
    claimStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    claimDescription: { type: String, trim: true },
    claimProof: { type: String, trim: true },
    claimPhoto: { type: String },
    claimContactNumber: { type: String, trim: true },
    claimRequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    claimRequestedAt: { type: Date },
    claimReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    claimReviewedAt: { type: Date },
    claimReviewReason: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);
