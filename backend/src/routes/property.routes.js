const express = require('express');
const propertyController = require('../controllers/property.controller');

const router = express.Router();

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.get('/:id/availability', propertyController.getPropertyAvailability);

module.exports = router;
