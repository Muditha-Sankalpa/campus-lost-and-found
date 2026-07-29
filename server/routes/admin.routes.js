const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');

router.get('/dashboard', auth, allowRoles('moderator', 'admin'), adminController.getModeratorDashboard);
router.post('/items/:id/review', auth, allowRoles('moderator', 'admin'), adminController.reviewItem);
router.post('/items/:id/claims/review', auth, allowRoles('moderator', 'admin'), adminController.reviewClaim);

module.exports = router;
