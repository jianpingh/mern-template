const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const router = express.Router();

const SECRET_KEY = 'your_secret_key';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */

// Mock user data
const users = [
  { username: 'student1', password: 'password1' },
  { username: 'student2', password: 'password2' },
];

// Login route
router.post('/login', authController.login);

module.exports = router;
