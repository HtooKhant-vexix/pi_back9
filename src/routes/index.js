const express = require('express');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const gpioRoutes = require('./gpioRoutes');
const serialRoutes = require('./serialRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/gpio', gpioRoutes);
router.use('/serial', serialRoutes);

module.exports = router;