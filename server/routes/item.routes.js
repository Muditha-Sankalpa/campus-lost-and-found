const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public: browse approved items
router.get('/search', itemController.searchItems);
router.get('/', itemController.listItems);
router.get('/my/list', auth, itemController.myItems);
router.get('/my/claims', auth, itemController.myClaims);
router.get('/:id', itemController.getItem);

// Protected: create an item (images upload)
router.post('/', auth, upload.array('images', 6), itemController.createItem);
router.post('/:id/claim', auth, upload.single('claimPhoto'), itemController.submitClaim);

// Update / delete
router.put('/:id', auth, upload.array('images', 6), itemController.updateItem);
router.patch('/:id', auth, upload.array('images', 6), itemController.updateItem);
router.delete('/:id', auth, itemController.deleteItem);

module.exports = router;
