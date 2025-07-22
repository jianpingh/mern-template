const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const logger = require('../config/logger');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

const SECRET_KEY = 'your_secret_key';

// 验证规则
const studentValidationRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('姓名不能为空')
      .isLength({ min: 2, max: 50 })
      .withMessage('姓名长度必须在2-50个字符之间')
      .trim(),
    body('age')
      .isInt({ min: 1, max: 150 })
      .withMessage('年龄必须是1-150之间的整数'),
    body('grade')
      .notEmpty()
      .withMessage('年级不能为空')
      .isLength({ min: 1, max: 20 })
      .withMessage('年级长度必须在1-20个字符之间')
      .trim()
  ];
};

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
    logger.warn('Authentication failed: Token missing', {
      requestId: req.requestId,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    return res.status(403).json({ message: 'Token required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      logger.warn('Authentication failed: Invalid token', {
        requestId: req.requestId,
        error: err.message,
        ip: req.ip
      });
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    logger.info('Authentication successful', {
      requestId: req.requestId,
      userId: user.id,
      username: user.username
    });
    next();
  });
};

// Fetch all students
router.get('/students', authenticateToken, dashboardController.getStudents);

// Add a new student
router.post('/students', authenticateToken, studentValidationRules(), dashboardController.addStudent);

module.exports = router;
