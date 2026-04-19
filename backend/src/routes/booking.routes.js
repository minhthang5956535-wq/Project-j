const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/my', bookingController.getMyBookings);
router.post('/', bookingController.createBooking);

module.exports = router;
