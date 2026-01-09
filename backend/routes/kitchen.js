const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchenController');

router.get('/queue/:station_id', kitchenController.getQueue);
router.post('/items/:id/start', kitchenController.startItem);
router.post('/items/:id/complete', kitchenController.completeItem);
router.get('/stats', kitchenController.getStats);

module.exports = router;
