const Item = require("../models/Item");

// @desc    Create a new lost/found item report
// @route   POST /api/items
// @access  Private (logged-in users)
const createItem = async (req, res) => {
  try {
    const { title, description, category, location, status, contactInfo } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: "Title, description, category and location are required" });
    }

    const images = req.files ? req.files.map((file) => `/uploads/items/${file.filename}`) : [];

    const item = await Item.create({
      title,
      description,
      category,
      location,
      status: status || "lost",
      images,
      contactInfo,
      reportedBy: req.user.id,
      moderationStatus: "pending", // every new item starts pending moderator review
    });

    res.status(201).json({ message: "Item reported successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Failed to create item", error: error.message });
  }
};

// @desc    Get list of items with search, filter & pagination
// @route   GET /api/items
// @access  Public
// Query params supported:
//   keyword     - text search across title/description/location
//   category    - exact category match
//   status      - lost | found | recovered
//   moderationStatus - pending | approved | rejected (defaults to "approved" for public view)
//   page, limit - pagination
const getItems = async (req, res) => {
  try {
    const {
      keyword,
      category,
      status,
      moderationStatus,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    // Public listing only shows approved items unless a specific status is requested
    // (e.g. a moderator dashboard would pass moderationStatus=pending explicitly)
    query.moderationStatus = moderationStatus || "approved";

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 12, 1);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Item.find(query)
        .populate("reportedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Item.countDocuments(query),
    ]);

    res.status(200).json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items", error: error.message });
  }
};

// @desc    Get a single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("reportedBy", "name email");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item", error: error.message });
  }
};

// @desc    Edit an existing item
// @route   PUT /api/items/:id
// @access  Private (owner or admin)
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const isOwner = item.reportedBy.toString() === req.user.id;
    const isPrivileged = ["admin", "moderator"].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: "Not authorized to edit this item" });
    }

    const { title, description, category, location, status, contactInfo } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    if (status) item.status = status;
    if (contactInfo !== undefined) item.contactInfo = contactInfo;

    // Append any newly uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/items/${file.filename}`);
      item.images = [...item.images, ...newImages];
    }

    // Any edit by the owner sends it back to pending review
    if (isOwner && !isPrivileged) {
      item.moderationStatus = "pending";
    }

    const updatedItem = await item.save();
    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (owner or admin)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const isOwner = item.reportedBy.toString() === req.user.id;
    const isPrivileged = ["admin", "moderator"].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
};