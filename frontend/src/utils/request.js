import { config } from '../config';

export const request = async (url, options = {}) => {
  // 如果URL不是完整的URL（不包含http），则添加API基础URL
  const fullUrl = url.startsWith('http') ? url : `${config.apiBaseUrl}${url}`;
  
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  const response = await fetch(fullUrl, { ...options, headers });
  return response;
};
