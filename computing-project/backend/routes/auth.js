const express = require('express');
const AuthController = require('../controllers/AuthController');
const authenticateJWT = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/validate-token', authenticateJWT, AuthController.validateToken)

module.exports = router;
