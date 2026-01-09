const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/calculate', orderController.calculateOrder);
router.post('/create', orderController.createOrder);
router.get('/active', orderController.getActiveOrders);
router.get('/:order_id/status', orderController.getOrderStatus);

module.exports = router;
