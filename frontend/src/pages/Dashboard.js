import React, { useState, useEffect } from 'react';
import { request } from '../utils/request';
import config from '../config';
import logger from '../utils/logger';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', grade: '' });

  useEffect(() => {
    logger.info('Dashboard component mounted');
    
    const fetchStudents = async () => {
      try {
        logger.debug('Fetching students list');
        const response = await request('/dashboard/students');
        const data = await response.json();
        setStudents(data);
        logger.info(`Successfully loaded ${data.length} students`);
      } catch (error) {
        logger.error('Error fetching students', { error: error.message });
      }
    };
    fetchStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    // 非空校验
    if (!newStudent.name.trim()) {
      const message = '请输入学生姓名';
      alert(message);
      logger.warn('Student validation failed: name is empty');
      return;
    }
    if (!newStudent.age || newStudent.age <= 0) {
      const message = '请输入有效的年龄';
      alert(message);
      logger.warn('Student validation failed: invalid age', { age: newStudent.age });
      return;
    }
    if (!newStudent.grade.trim()) {
      const message = '请输入学生年级';
      alert(message);
      logger.warn('Student validation failed: grade is empty');
      return;
    }
    
    try {
      logger.info('Adding new student', { 
        name: newStudent.name, 
        age: newStudent.age, 
        grade: newStudent.grade 
      });
      
      const response = await request('/dashboard/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newStudent.name.trim(),
          age: parseInt(newStudent.age),
          grade: newStudent.grade.trim()
        }),
      });
      
      if (response.ok) {
        const addedStudent = await response.json();
        setStudents([...students, addedStudent]);
        setNewStudent({ name: '', age: '', grade: '' });
        alert('学生添加成功');
        logger.info('Student added successfully', { studentId: addedStudent._id });
        
        // 用户行为跟踪
        logger.trackEvent('student_added', {
          studentName: addedStudent.name,
          studentAge: addedStudent.age,
          studentGrade: addedStudent.grade
        });
      } else {
        const errorData = await response.json();
        if (errorData.errors && errorData.errors.length > 0) {
          // 显示详细的验证错误
          const errorMessages = errorData.errors.map(error => error.msg).join('\n');
          alert(`添加失败:\n${errorMessages}`);
          logger.warn('Student validation failed on server', { errors: errorData.errors });
        } else {
          alert(`添加失败: ${errorData.message || '未知错误'}`);
          logger.error('Failed to add student', { error: errorData });
        }
      }
    } catch (error) {
      logger.error('Network error while adding student', { error: error.message });
      alert('网络错误，请稍后重试');
    }
  };

  return (
    <div>
      <h2>{config.appName} - Dashboard</h2>
      {config.debug && (
        <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
          <small>Environment: {config.env} | Debug Mode: {config.debug.toString()}</small>
        </div>
      )}
      <ul>
        {students.map((student, index) => (
          <li key={student._id || index}>{student.name} - {student.age} - {student.grade}</li>
        ))}
      </ul>
      <form onSubmit={handleAddStudent}>
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={newStudent.age}
          onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
          required
          min="1"
          max="150"
        />
        <input
          type="text"
          placeholder="Grade"
          value={newStudent.grade}
          onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
          required
        />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default Dashboard;
