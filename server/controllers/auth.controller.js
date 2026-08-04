const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function validateEmail(email) {
  return typeof email === 'string' && /.+@.+\..+/.test(email.trim());
}

exports.register = async (req, res) => {
  try {
    const { name, studentId, email, password } = req.body;
    if (!name || !studentId || !email || !password) {
      return res.status(400).json({ message: 'Name, studentId, email and password are required.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { studentId }] });
    if (existing) {
      return res.status(409).json({ message: 'User with provided email or student ID already exists.' });
    }

    const user = new User({ name, studentId, email: email.toLowerCase(), password });
    await user.save();

    const token = signToken(user);

    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(201).json({ token, user: userSafe });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = signToken(user);
    const userSafe = user.toObject();
    delete userSafe.password;

    return res.json({ token, user: userSafe });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

// Logout -- since JWT is stateless, client should discard token. Provide helper response.
exports.logout = async (req, res) => {
  // For stateless JWT, instruct client to delete token. If token blacklist is used, add to blacklist here.
  return res.json({ message: 'Logged out. Please delete the token on the client.' });
};

exports.me = async (req, res) => {
  try {
    // auth.middleware attaches req.userId
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    const { name, profile } = req.body;
    if (name) updates.name = name;
    if (profile) updates.profile = profile;

    const user = await User.findByIdAndUpdate(req.userId, { $set: updates }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};
