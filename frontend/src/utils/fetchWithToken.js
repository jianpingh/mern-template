import config from '../config';
import logger from './logger';

export const request = async (url, options = {}) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  // 构建完整的 URL
  const fullUrl = url.startsWith('http') ? url : `${config.apiBaseUrl}${url}`;
  
  // 记录请求日志
  logger.logApiRequest(options.method || 'GET', fullUrl, options.body);
  
  try {
    const response = await fetch(fullUrl, { ...options, headers });
    
    // 记录响应日志
    let responseData = {};
    try {
      responseData = await response.clone().json();
    } catch (e) {
      // 响应不是 JSON 格式
    }
    
    logger.logApiResponse(
      options.method || 'GET', 
      fullUrl, 
      response.status, 
      config.debug ? responseData : {}
    );
    
    return response;
  } catch (error) {
    logger.error('API Request Failed', {
      url: fullUrl,
      method: options.method || 'GET',
      error: error.message
    });
    throw error;
  }
};