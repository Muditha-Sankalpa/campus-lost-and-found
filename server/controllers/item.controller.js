const Item = require("../models/Item");

// ===============================
// Create Item
// ===============================
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      status,
      contactInfo,
    } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        message: "Title, description, category and location are required",
      });
    }

    const images = req.files
      ? req.files.map((file) => `/uploads/items/${file.filename}`)
      : [];

    const item = await Item.create({
      title,
      description,
      category,
      location,
      status: status || "lost",
      images,
      contactInfo,
      reportedBy: req.user.id,
      moderationStatus: "pending",
    });

    res.status(201).json({
      message: "Item reported successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
};

// ===============================
// Get All Items
// ===============================
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

    query.moderationStatus = moderationStatus || "approved";

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const items = await Item.find(query)
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Item.countDocuments(query);

    res.status(200).json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};

// ===============================
// Get Single Item
// ===============================
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "reportedBy",
      "name email"
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch item",
      error: error.message,
    });
  }
};

// ===============================
// Update Item
// ===============================
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const isOwner = item.reportedBy.toString() === req.user.id;
    const isAdmin =
      req.user.role === "admin" || req.user.role === "moderator";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const {
      title,
      description,
      category,
      location,
      status,
      contactInfo,
    } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    if (status) item.status = status;

    if (contactInfo !== undefined) {
      item.contactInfo = contactInfo;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => `/uploads/items/${file.filename}`
      );

      item.images = [...item.images, ...newImages];
    }

    if (isOwner && !isAdmin) {
      item.moderationStatus = "pending";
    }

    const updatedItem = await item.save();

    res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
};

// ===============================
// Delete Item
// ===============================
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const isOwner = item.reportedBy.toString() === req.user.id;
    const isAdmin =
      req.user.role === "admin" || req.user.role === "moderator";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete item",
      error: error.message,
    });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
};