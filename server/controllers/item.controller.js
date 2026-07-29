const Item = require('../models/Item');

const normalizeStatus = (status) => {
  const value = (status || 'lost').toString().trim().toLowerCase();
  if (['lost', 'found', 'recovered'].includes(value)) return value;
  return 'lost';
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildItemFilter = (query = {}, defaultModeration = 'approved') => {
  const filter = {};
  const { category, status, q, location, moderation } = query;

  if (category) filter.category = new RegExp(escapeRegex(category), 'i');
  if (status) filter.status = normalizeStatus(status);
  if (location) filter.location = new RegExp(escapeRegex(location), 'i');
  if (q) {
    filter.$or = [
      { title: new RegExp(escapeRegex(q), 'i') },
      { description: new RegExp(escapeRegex(q), 'i') },
      { category: new RegExp(escapeRegex(q), 'i') },
      { location: new RegExp(escapeRegex(q), 'i') }
    ];
  }

  if (moderation && moderation !== 'all') {
    filter.moderationStatus = moderation;
  } else if (defaultModeration) {
    filter.moderationStatus = defaultModeration;
  }

  return filter;
};

exports.createItem = async (req, res) => {
  try {
    const { title, description, category, location, status } = req.body;
    const images = (req.files || []).map((file) => `/uploads/${file.filename}`);

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const item = new Item({
      title,
      description,
      category,
      location,
      status: normalizeStatus(status),
      images,
      reportedBy: req.userId,
      moderationStatus: 'pending'
    });

    await item.save();
    return res.status(201).json({ item });
  } catch (err) {
    console.error('Create item error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name studentId email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    return res.json({ item });
  } catch (err) {
    console.error('Get item error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listItems = async (req, res) => {
  try {
    const filter = buildItemFilter(req.query, 'approved');
    const items = await Item.find(filter).sort({ createdAt: -1 }).populate('reportedBy', 'name');
    return res.json({ items });
  } catch (err) {
    console.error('List items error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.searchItems = async (req, res) => {
  try {
    const filter = buildItemFilter(req.query, 'approved');
    const items = await Item.find(filter).sort({ createdAt: -1 }).populate('reportedBy', 'name');
    return res.json({ items });
  } catch (err) {
    console.error('Search items error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.myItems = async (req, res) => {
  try {
    const filter = { reportedBy: req.userId };
    const { moderation, status, q, category, location } = req.query;

    if (moderation && moderation !== 'all') {
      if (moderation === 'recovered') {
        filter.status = 'recovered';
      } else {
        filter.moderationStatus = moderation;
      }
    }
    if (status) filter.status = normalizeStatus(status);
    if (category) filter.category = new RegExp(escapeRegex(category), 'i');
    if (location) filter.location = new RegExp(escapeRegex(location), 'i');
    if (q) {
      filter.$or = [
        { title: new RegExp(escapeRegex(q), 'i') },
        { description: new RegExp(escapeRegex(q), 'i') },
        { category: new RegExp(escapeRegex(q), 'i') },
        { location: new RegExp(escapeRegex(q), 'i') }
      ];
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    return res.json({ items });
  } catch (err) {
    console.error('My items error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.submitClaim = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { claimDescription, claimProof, claimContactNumber } = req.body;
    if (!claimDescription || !claimProof || !claimContactNumber) {
      return res.status(400).json({ message: 'Please provide a description, proof, and contact number.' });
    }

    const claimPhoto = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          claimStatus: 'pending',
          claimDescription,
          claimProof,
          claimPhoto: claimPhoto || item.claimPhoto,
          claimContactNumber,
          claimRequestedBy: req.userId,
          claimRequestedAt: new Date(),
          claimReviewedBy: null,
          claimReviewedAt: null,
          claimReviewReason: null,
        }
      },
      { new: true }
    ).populate('reportedBy', 'name studentId email').populate('claimRequestedBy', 'name studentId email');

    return res.json({ item: updated });
  } catch (err) {
    console.error('Submit claim error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (String(item.reportedBy) !== String(req.userId) && req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = {};
    const allowedFields = ['title', 'description', 'category', 'location', 'status', 'moderationStatus'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = field === 'status' ? normalizeStatus(req.body[field]) : req.body[field];
    });

    if (req.files && req.files.length) {
      updates.images = (req.files || []).map((file) => `/uploads/${file.filename}`);
    }

    if (updates.status === 'recovered') {
      updates.moderationStatus = 'approved';
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).populate('reportedBy', 'name');
    return res.json({ item: updated });
  } catch (err) {
    console.error('Update item error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (String(item.reportedBy) !== String(req.userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await item.deleteOne();
    return res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Delete item error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
