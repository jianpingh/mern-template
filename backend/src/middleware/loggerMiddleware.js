const logger = require('../config/logger');

// HTTP 请求日志中间件
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = logger.generateRequestId();
  
  // 将 requestId 添加到请求对象中
  req.requestId = requestId;
  
  // 记录请求开始信息
  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    body: req.method === 'POST' || req.method === 'PUT' ? 
          (process.env.NODE_ENV === 'development' ? req.body : '[BODY]') : undefined
  });

  // 监听响应结束事件
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel]('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0
    });
  });

  // 监听响应错误事件
  res.on('error', (error) => {
    logger.error('Response error', {
      requestId,
      error: error.message,
      stack: error.stack
    });
  });

  next();
};

// 错误日志中间件
const errorLogger = (err, req, res, next) => {
  const requestId = req.requestId || 'unknown';
  
  logger.error('Request error', {
    requestId,
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    body: process.env.NODE_ENV === 'development' ? req.body : '[BODY]'
  });
  
  next(err);
};

// 数据库操作日志中间件
const dbLogger = {
  logQuery: (operation, collection, query = {}, requestId = null) => {
    logger.debug('Database operation', {
      requestId,
      operation,
      collection,
      query: process.env.NODE_ENV === 'development' ? query : '[QUERY]'
    });
  },
  
  logResult: (operation, collection, result, requestId = null) => {
    logger.debug('Database result', {
      requestId,
      operation,
      collection,
      resultCount: Array.isArray(result) ? result.length : (result ? 1 : 0)
    });
  },
  
  logError: (operation, collection, error, requestId = null) => {
    logger.error('Database error', {
      requestId,
      operation,
      collection,
      error: error.message,
      stack: error.stack
    });
  }
};

module.exports = { 
  requestLogger, 
  errorLogger, 
  dbLogger 
};
