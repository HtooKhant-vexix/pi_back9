const express = require('express');
const { validateUser } = require('../middleware/validators');
const { authenticate } = require('../middleware/auth');
const UserController = require('../controllers/userController');

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', validateUser, UserController.createUser);
router.put('/:id', authenticate, validateUser, UserController.updateUser);
router.delete('/:id', authenticate, UserController.deleteUser);

module.exports = router;