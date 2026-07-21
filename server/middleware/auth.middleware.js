const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach minimal info to request
    req.userId = decoded.id;
    req.user = { id: decoded.id, role: decoded.role };

    // Optionally fetch fresh user data (uncomment if needed):
    // const user = await User.findById(decoded.id).select('-password');
    // if (!user) return res.status(401).json({ message: 'User not found.' });
    // req.user = user;

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Token is not valid.' });
  }
};
