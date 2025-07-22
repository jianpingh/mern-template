const Student = require('../models/student');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');
const { dbLogger } = require('../middleware/loggerMiddleware');

exports.getStudents = async (req, res) => {
  const requestId = req.requestId;
  
  try {
    logger.info('Fetching all students', { 
      requestId,
      userId: req.user?.id 
    });
    
    dbLogger.logQuery('find', 'students', {}, requestId);
    const students = await Student.find();
    dbLogger.logResult('find', 'students', students, requestId);
    
    logger.info(`Successfully fetched ${students.length} students`, { 
      requestId,
      count: students.length 
    });
    
    res.json(students);
  } catch (error) {
    dbLogger.logError('find', 'students', error, requestId);
    logger.error('Error fetching students', {
      requestId,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.addStudent = async (req, res) => {
  const requestId = req.requestId;
  
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Student validation failed', { 
      requestId,
      errors: errors.array(),
      body: req.body,
      userId: req.user?.id
    });
    return res.status(400).json({ 
      message: '输入数据验证失败',
      errors: errors.array()
    });
  }

  const { name, age, grade } = req.body;
  
  try {
    logger.info('Adding new student', { 
      requestId,
      studentData: { name, age, grade },
      userId: req.user?.id 
    });
    
    const studentData = { name, age, grade };
    dbLogger.logQuery('create', 'students', studentData, requestId);
    
    const newStudent = new Student(studentData);
    const savedStudent = await newStudent.save();
    
    dbLogger.logResult('create', 'students', savedStudent, requestId);
    
    logger.info('Student added successfully', { 
      requestId,
      studentId: savedStudent._id,
      studentName: savedStudent.name,
      userId: req.user?.id
    });
    
    res.status(201).json(savedStudent);
  } catch (error) {
    dbLogger.logError('create', 'students', error, requestId);
    logger.error('Error adding student', {
      requestId,
      error: error.message,
      stack: error.stack,
      studentData: { name, age, grade }
    });
    res.status(500).json({ message: 'Error adding student' });
  }
};
