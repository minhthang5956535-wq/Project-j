const express = require('express');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
