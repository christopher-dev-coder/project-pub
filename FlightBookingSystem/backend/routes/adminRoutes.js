const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// POST /api/admin/flights
router.post('/flights', adminController.addFlight);

module.exports = router;
