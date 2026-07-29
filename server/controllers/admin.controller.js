const Item = require('../models/Item');
const { buildModeratorDashboardSummary } = require('../utils/moderation');

exports.getModeratorDashboard = async (req, res) => {
  try {
    const [pendingItems, pendingClaims, rejectedReports, stats] = await Promise.all([
      Item.find({ moderationStatus: 'pending' }).sort({ createdAt: -1 }).populate('reportedBy', 'name studentId email'),
      Item.find({ claimStatus: 'pending' }).sort({ createdAt: -1 }).populate('claimRequestedBy', 'name studentId email'),
      Item.find({ moderationStatus: 'rejected' }).sort({ createdAt: -1 }).populate('reportedBy', 'name studentId email'),
      Item.aggregate([
        {
          $group: {
            _id: null,
            totalItems: { $sum: 1 },
            pendingItems: { $sum: { $cond: [{ $eq: ['$moderationStatus', 'pending'] }, 1, 0] } },
            approvedItems: { $sum: { $cond: [{ $eq: ['$moderationStatus', 'approved'] }, 1, 0] } },
            recoveredItems: { $sum: { $cond: [{ $eq: ['$status', 'recovered'] }, 1, 0] } },
            rejectedItems: { $sum: { $cond: [{ $eq: ['$moderationStatus', 'rejected'] }, 1, 0] } }
          }
        }
      ])
    ]);

    const summary = buildModeratorDashboardSummary({
      pendingItems,
      pendingClaims,
      rejectedReports,
      stats: stats[0] || { totalItems: 0, pendingItems: 0, approvedItems: 0, recoveredItems: 0, rejectedItems: 0 }
    });

    return res.json(summary);
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.reviewItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { action, reason } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const updates = {
      moderationStatus: action === 'approve' ? 'approved' : 'rejected',
      moderationReviewedBy: req.userId,
      moderationReviewedAt: new Date(),
      moderationReason: reason || null
    };

    if (action === 'approve' && item.status === 'recovered') {
      updates.moderationStatus = 'approved';
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).populate('reportedBy', 'name studentId email');
    return res.json({ item: updated });
  } catch (err) {
    console.error('Review item error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.reviewClaim = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { action, reason } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const updates = {
      claimStatus: action === 'approve' ? 'approved' : 'rejected',
      claimReviewedBy: req.userId,
      claimReviewedAt: new Date(),
      claimReviewReason: reason || null
    };

    if (action === 'approve') {
      updates.status = 'recovered';
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).populate('reportedBy', 'name studentId email').populate('claimRequestedBy', 'name studentId email');
    return res.json({ item: updated });
  } catch (err) {
    console.error('Review claim error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
