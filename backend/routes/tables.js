const express = require('express');
const router = express.Router();
const tablesController = require('../controllers/tablesController');

router.get('/', tablesController.getAllTables);
router.get('/:id', tablesController.getTableById);
router.post('/:id/status', tablesController.updateTableStatus);
router.post('/:id/free', tablesController.freeTable);

module.exports = router;
