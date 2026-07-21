const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');

// Public
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected
router.get('/me', auth, authController.me);
router.patch('/me', auth, authController.updateProfile);

// Example: admin-only route (usage example for role middleware)
// router.get('/admin-only', auth, allowRoles('admin'), (req, res) => res.json({ msg: 'admin content' }));

module.exports = router;
