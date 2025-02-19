const express = require('express');
const { authenticate } = require('../middleware/auth');
const GpioController = require('../controllers/gpioController');

const router = express.Router();

router.get('/:pinNumber', authenticate, GpioController.getPin);
router.post('/set', authenticate, GpioController.setPin);

module.exports = router;