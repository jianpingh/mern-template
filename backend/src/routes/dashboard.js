const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

const SECRET_KEY = 'your_secret_key';

/**
 * @swagger
 * /dashboard/students:
 *   get:
 *     summary: Get all students
 *     responses:
 *       200:
 *         description: List of students
 *   post:
 *     summary: Add a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               grade:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student added successfully
 */

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    console.log('Token missing');
    return res.status(403).json({ message: 'Token required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Fetch all students
router.get('/students', authenticateToken, dashboardController.getStudents);

// Add a new student
router.post('/students', authenticateToken, dashboardController.addStudent);

module.exports = router;
