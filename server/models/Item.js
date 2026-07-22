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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);
