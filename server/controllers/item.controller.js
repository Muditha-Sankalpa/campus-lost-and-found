const Item = require('../models/Item');

exports.createItem = async (req, res) => {
  try {
    const { title, description, category, location, status } = req.body;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const item = new Item({
      title,
      description,
      category,
      location,
      status: status || 'lost',
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
    // filters: category, status, q (search), moderationStatus
    const { category, status, q, moderation } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (q) filter.$or = [ { title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') } ];
    // By default show only approved items
    if (moderation) filter.moderationStatus = moderation;
    else filter.moderationStatus = 'approved';

    const items = await Item.find(filter).sort({ createdAt: -1 }).populate('reportedBy', 'name');
    return res.json({ items });
  } catch (err) {
    console.error('List items error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.myItems = async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.userId }).sort({ createdAt: -1 });
    return res.json({ items });
  } catch (err) {
    console.error('My items error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // allow owner or moderators/admins (controller assumes role middleware will protect where necessary)
    if (String(item.reportedBy) !== String(req.userId) && req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length) {
      updates.images = (req.files || []).map(f => `/uploads/${f.filename}`);
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
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