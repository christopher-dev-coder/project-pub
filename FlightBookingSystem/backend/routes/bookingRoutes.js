const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/lock', bookingController.lockSeats);
// router.post('/confirm', bookingController.confirmBooking);

module.exports = router;
