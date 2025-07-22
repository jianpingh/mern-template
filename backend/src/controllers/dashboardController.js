const Student = require('../models/student');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.addStudent = async (req, res) => {
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: '输入数据验证失败',
      errors: errors.array()
    });
  }

  const { name, age, grade } = req.body;
  const newStudent = new Student({ name, age, grade });

  try {
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    console.error('Error saving student:', err);
    res.status(500).json({ message: 'Error adding student' });
  }
};
