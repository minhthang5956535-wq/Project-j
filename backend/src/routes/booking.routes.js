const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/my', authenticateToken, bookingController.getMyBookings);
router.post('/', authenticateToken, bookingController.createBooking);
router.patch('/:id/cancel', authenticateToken, bookingController.cancelBooking);

module.exports = router;
