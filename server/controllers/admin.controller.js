const User = require("../models/User");

// GET /api/admin/users?role=&search=&page=&limit=
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role && ["student", "moderator", "admin"].includes(role)) {
      query.role = role;
    }
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { email: regex }, { studentId: regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    return res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ message: "Failed to fetch users." });
  }
};

// GET /api/admin/users/stats — user stats for dashboard
exports.getUserStats = async (req, res) => {
  try {
    const [total, students, moderators, admins, suspended] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "moderator" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ isSuspended: true }),
    ]);

    return res.json({ total, students, moderators, admins, suspended });
  } catch (err) {
    console.error("getUserStats error:", err);
    return res.status(500).json({ message: "Failed to fetch user stats." });
  }
};

// PATCH /api/admin/users/:id/role — change user role
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "moderator", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    if (String(req.userId) === String(id) && role !== "admin") {
      return res.status(400).json({ message: "You cannot change your own role." });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { role } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found." });

    return res.json({ user });
  } catch (err) {
    console.error("changeUserRole error:", err);
    return res.status(500).json({ message: "Failed to update role." });
  }
};

// PATCH /api/admin/users/:id/suspend — toggle suspension
exports.toggleSuspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(req.userId) === String(id)) {
      return res.status(400).json({ message: "You cannot suspend yourself." });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.isSuspended = !user.isSuspended;
    user.suspendedAt = user.isSuspended ? new Date() : null;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.json({ user: safeUser });
  } catch (err) {
    console.error("toggleSuspendUser error:", err);
    return res.status(500).json({ message: "Failed to update suspension." });
  }
};

// DELETE /api/admin/users/:id — delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(req.userId) === String(id)) {
      return res.status(400).json({ message: "You cannot delete yourself." });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.json({ message: "User deleted." });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ message: "Failed to delete user." });
  }
};