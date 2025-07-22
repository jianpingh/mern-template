const winston = require('winston');
const path = require('path');

// 创建日志目录
const fs = require('fs');
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}] [${service}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

// 生产环境日志格式（JSON格式，便于日志分析工具解析）
const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// 开发环境日志格式（彩色输出，便于阅读）
const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    let log = `${timestamp} [${level}] [${service}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    return log;
  })
);

// 创建 logger 实例
const createLogger = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

  const transports = [];

  if (isProduction) {
    // 生产环境：输出到文件
    transports.push(
      // 错误日志文件
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        format: productionFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 5
      }),
      // 警告及以上级别日志
      new winston.transports.File({
        filename: path.join(logDir, 'warn.log'),
        level: 'warn',
        format: productionFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 5
      }),
      // 所有日志文件
      new winston.transports.File({
        filename: path.join(logDir, 'combined.log'),
        format: productionFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 10
      })
    );
  } else {
    // 开发环境：输出到控制台
    transports.push(
      new winston.transports.Console({
        format: developmentFormat
      })
    );
    
    // 开发环境也可以选择输出到文件（用于调试）
    if (process.env.LOG_TO_FILE === 'true') {
      transports.push(
        new winston.transports.File({
          filename: path.join(logDir, 'dev.log'),
          format: logFormat,
          maxsize: 5242880, // 5MB
          maxFiles: 3
        })
      );
    }
  }

  return winston.createLogger({
    level: logLevel,
    defaultMeta: { service: 'mern-backend' },
    transports,
    // 处理未捕获的异常
    exceptionHandlers: [
      new winston.transports.File({ 
        filename: path.join(logDir, 'exceptions.log'),
        format: productionFormat
      })
    ],
    // 处理未处理的 Promise 拒绝
    rejectionHandlers: [
      new winston.transports.File({ 
        filename: path.join(logDir, 'rejections.log'),
        format: productionFormat
      })
    ]
  });
};

const logger = createLogger();

// 添加请求ID生成函数（用于追踪请求）
logger.generateRequestId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

module.exports = logger;
