// 加载环境变量
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./config/logger');
const { requestLogger, errorLogger } = require('./middleware/loggerMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// 启动日志
logger.info('Starting MERN Backend Server', {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: PORT,
  logLevel: process.env.LOG_LEVEL || 'info'
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(requestLogger); // 添加请求日志中间件

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:123456@47.98.120.26:27017/admin';

// 设置 Mongoose strictQuery 选项以避免弃用警告
mongoose.set('strictQuery', false);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  logger.info('Successfully connected to MongoDB', {
    host: '47.98.120.26:27017',
    database: 'admin'
  });
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', {
    error: err.message,
    stack: err.stack
  });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Routes
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed', { requestId: req.requestId });
  res.send('Hello from the backend!');
});

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const swaggerSetup = require('./swagger');

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Swagger documentation
swaggerSetup(app);

// 错误处理中间件
app.use(errorLogger);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 
    'Internal Server Error' : err.message;
  
  res.status(statusCode).json({ 
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// 处理未找到的路由
app.use('*', (req, res) => {
  logger.warn('Route not found', {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl
  });
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`, {
    environment: process.env.NODE_ENV || 'development'
  });
});
