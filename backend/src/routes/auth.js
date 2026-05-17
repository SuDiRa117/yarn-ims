const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.createUser);
router.get('/users', authenticateToken, AuthController.getUsers);

module.exports = router;
