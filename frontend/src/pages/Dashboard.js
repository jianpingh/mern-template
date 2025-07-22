import React, { useState, useEffect } from 'react';
import { request } from '../utils/request';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', grade: '' });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await request(`${API_BASE_URL}/dashboard/students`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    // 非空校验
    if (!newStudent.name.trim()) {
      alert('请输入学生姓名');
      return;
    }
    if (!newStudent.age || newStudent.age <= 0) {
      alert('请输入有效的年龄');
      return;
    }
    if (!newStudent.grade.trim()) {
      alert('请输入学生年级');
      return;
    }
    
    try {
      const response = await request(`${API_BASE_URL}/dashboard/students`, {
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
      } else {
        const errorData = await response.json();
        if (errorData.errors && errorData.errors.length > 0) {
          // 显示详细的验证错误
          const errorMessages = errorData.errors.map(error => error.msg).join('\n');
          alert(`添加失败:\n${errorMessages}`);
        } else {
          alert(`添加失败: ${errorData.message || '未知错误'}`);
        }
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('网络错误，请稍后重试');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>{student.name} - {student.age} - {student.grade}</li>
        ))}
      </ul>
      <form onSubmit={handleAddStudent}>
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={newStudent.age}
          onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
        />
        <input
          type="text"
          placeholder="Grade"
          value={newStudent.grade}
          onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
        />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default Dashboard;
