const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getAllMenuItems);
router.get('/category/:category', menuController.getMenuItemsByCategory);

module.exports = router;
