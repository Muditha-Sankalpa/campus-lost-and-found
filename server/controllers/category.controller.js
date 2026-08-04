const Category = require("../models/Category");
const ActivityLog = require("../models/ActivityLog");

async function logActivity(actor, action, targetType, targetId, metadata = {}) {
  try {
    await ActivityLog.create({ actor, action, targetType, targetId, metadata });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

// GET /api/categories — public: only active categories (for dropdowns)
exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return res.json({ categories });
  } catch (err) {
    console.error("getActiveCategories error:", err);
    return res.status(500).json({ message: "Failed to fetch categories." });
  }
};

// GET /api/categories/admin — admin: all including inactive
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    return res.json({ categories });
  } catch (err) {
    console.error("getAllCategories error:", err);
    return res.status(500).json({ message: "Failed to fetch categories." });
  }
};

// POST /api/categories/admin — admin: create
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    const existing = await Category.findOne({
      name: new RegExp(`^${name.trim()}$`, "i"),
    });
    if (existing) {
      return res.status(409).json({ message: "A category with this name already exists." });
    }

    const category = new Category({
      name: name.trim(),
      description: (description || "").trim(),
      icon: (icon || "").trim(),
      createdBy: req.userId,
    });
    await category.save();

    await logActivity(req.userId, "category.created", "Category", category._id, {
      name: category.name,
    });

    return res.status(201).json({ category });
  } catch (err) {
    console.error("createCategory error:", err);
    return res.status(500).json({ message: "Failed to create category." });
  }
};

// PATCH /api/categories/admin/:id — admin: update
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, isActive } = req.body;

    if (name !== undefined) {
      // Guard against duplicate name (case-insensitive) on different doc
      const dupe = await Category.findOne({
        _id: { $ne: id },
        name: new RegExp(`^${name.trim()}$`, "i"),
      });
      if (dupe) {
        return res.status(409).json({ message: "Another category has that name." });
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (icon !== undefined) updates.icon = icon.trim();
    if (isActive !== undefined) updates.isActive = isActive;

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found." });

    await logActivity(req.userId, "category.updated", "Category", category._id, {
      name: category.name,
    });

    return res.json({ category });
  } catch (err) {
    console.error("updateCategory error:", err);
    return res.status(500).json({ message: "Failed to update category." });
  }
};

// DELETE /api/categories/admin/:id — admin: soft-delete (set isActive=false)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found." });

    await logActivity(req.userId, "category.deleted", "Category", category._id, {
      name: category.name,
    });

    return res.json({ message: "Category deactivated.", category });
  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({ message: "Failed to delete category." });
  }
};

// DELETE /api/categories/admin/:id/permanent — admin: hard-delete (real removal)
exports.hardDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: "Category not found." });

    await logActivity(req.userId, "category.hard_deleted", "Category", category._id, {
      name: category.name,
    });

    return res.json({ message: "Category permanently deleted." });
  } catch (err) {
    console.error("hardDeleteCategory error:", err);
    return res.status(500).json({ message: "Failed to permanently delete category." });
  }
};