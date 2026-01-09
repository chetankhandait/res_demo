const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/today', analyticsController.getTodayMetrics);

router.get('/hourly-sales', analyticsController.getHourlySales);
router.get('/popular-categories', analyticsController.getPopularCategories);

module.exports = router;
