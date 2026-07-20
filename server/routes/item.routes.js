const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const auth = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

// Public: browse approved items
router.get('/', itemController.listItems);
router.get('/:id', itemController.getItem);

// Protected: create an item (images upload)
router.post('/', auth, upload.array('images', 6), itemController.createItem);

// Protected: user's own items
router.get('/my/list', auth, itemController.myItems);

// Update / delete
router.patch('/:id', auth, upload.array('images', 6), itemController.updateItem);
router.delete('/:id', auth, itemController.deleteItem);

module.exports = router;
