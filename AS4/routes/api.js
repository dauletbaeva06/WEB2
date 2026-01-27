const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/measurements', dataController.getMeasurements);
router.get('/measurements/metrics', dataController.getMetrics);

module.exports = router;