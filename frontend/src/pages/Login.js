import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../utils/request';
import config from '../config';
import logger from '../utils/logger';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    logger.info('Login attempt', { username });
    
    try {
      const response = await request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Save token to localStorage
        logger.info('Login successful', { username });
        
        // 用户行为跟踪
        logger.trackEvent('user_login', { username });
        
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        const message = errorData.message || 'Login failed';
        alert(message);
        logger.warn('Login failed', { 
          username, 
          status: response.status, 
          error: message 
        });
      }
    } catch (error) {
      logger.error('Login error', { 
        username, 
        error: error.message 
      });
      alert('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{config.appName} - Login</h2>
      {config.debug && (
        <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
          <small>Environment: {config.env} | API: {config.apiBaseUrl}</small>
        </div>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? '登录中...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
