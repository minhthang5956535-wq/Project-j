const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

router.use(authenticateToken, isAdmin);

// Stats
router.get('/stats', adminController.getStats);

// Properties
router.get('/properties', adminController.getAllPropertiesAdmin);
router.post('/properties', adminController.createProperty);
router.delete('/properties/:id', adminController.deleteProperty);

// Bookings
router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);

// Users
router.get('/users', adminController.getAllUsers);

module.exports = router;
