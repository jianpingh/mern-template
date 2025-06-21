const Student = require('../models/student');
const jwt = require('jsonwebtoken');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.addStudent = async (req, res) => {
  const { name, age, grade } = req.body;
  const newStudent = new Student({ name, age, grade });

  try {
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ message: 'Error adding student' });
  }
};
