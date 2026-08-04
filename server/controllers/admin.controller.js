const User = require("../models/User");
const Announcement = require("../models/Announcement");
const ActivityLog = require("../models/ActivityLog");

// --- Helper to record activity ---
async function logActivity(actor, action, targetType, targetId, metadata = {}) {
  try {
    await ActivityLog.create({ actor, action, targetType, targetId, metadata });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role && ["student", "moderator", "admin"].includes(role)) query.role = role;
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { email: regex }, { studentId: regex }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
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

// GET /api/admin/users/stats
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

// PATCH /api/admin/users/:id/role
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

    await logActivity(req.userId, "user.role_changed", "User", user._id, {
      newRole: role,
      userName: user.name,
    });

    return res.json({ user });
  } catch (err) {
    console.error("changeUserRole error:", err);
    return res.status(500).json({ message: "Failed to update role." });
  }
};

// PATCH /api/admin/users/:id/suspend
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

    await logActivity(
      req.userId,
      user.isSuspended ? "user.suspended" : "user.unsuspended",
      "User",
      user._id,
      { userName: user.name }
    );

    const safeUser = user.toObject();
    delete safeUser.password;
    return res.json({ user: safeUser });
  } catch (err) {
    console.error("toggleSuspendUser error:", err);
    return res.status(500).json({ message: "Failed to update suspension." });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (String(req.userId) === String(id)) {
      return res.status(400).json({ message: "You cannot delete yourself." });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    await logActivity(req.userId, "user.deleted", "User", user._id, {
      userName: user.name,
      email: user.email,
    });

    return res.json({ message: "User deleted." });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ message: "Failed to delete user." });
  }
};

// GET /api/admin/dashboard
exports.getDashboardOverview = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersThisWeek,
      suspendedUsers,
      totalAnnouncements,
      activeAnnouncements,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ isSuspended: true }),
      Announcement.countDocuments(),
      Announcement.countDocuments({
        isPublished: true,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      }),
      ActivityLog.find()
        .populate("actor", "name email")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    return res.json({
      stats: {
        totalUsers,
        newUsersThisWeek,
        suspendedUsers,
        totalAnnouncements,
        activeAnnouncements,
        totalItems: null,
        recoveredItems: null,
        pendingReviews: null,
      },
      recentActivity,
    });
  } catch (err) {
    console.error("getDashboardOverview error:", err);
    return res.status(500).json({ message: "Failed to load dashboard." });
  }
};

// GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const signupsRaw = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const signupsByDay = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const match = signupsRaw.find((r) => r._id === key);
      signupsByDay.push({ date: key, count: match ? match.count : 0 });
    }

    const announcementsByType = await Announcement.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    return res.json({
      usersByRole: usersByRole.map((r) => ({ role: r._id, count: r.count })),
      signupsByDay,
      announcementsByType: announcementsByType.map((a) => ({
        type: a._id,
        count: a.count,
      })),
    });
  } catch (err) {
    console.error("getAnalytics error:", err);
    return res.status(500).json({ message: "Failed to load analytics." });
  }
};

// GET /api/admin/activity
exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      ActivityLog.find()
        .populate("actor", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ActivityLog.countDocuments(),
    ]);

    return res.json({
      logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("getActivityLogs error:", err);
    return res.status(500).json({ message: "Failed to load activity logs." });
  }
};