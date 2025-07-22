import config from '../config';

// 日志级别
const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const levelNames = {
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.DEBUG]: 'DEBUG'
};

const levelColors = {
  [LogLevel.ERROR]: '#ff4757',
  [LogLevel.WARN]: '#ffa502',
  [LogLevel.INFO]: '#2ed573',
  [LogLevel.DEBUG]: '#70a1ff'
};

class Logger {
  constructor() {
    this.level = this.getLogLevel();
    this.isDevelopment = config.isDevelopment;
  }

  getLogLevel() {
    const level = config.logLevel.toUpperCase();
    return LogLevel[level] !== undefined ? LogLevel[level] : LogLevel.INFO;
  }

  shouldLog(level) {
    return level <= this.level;
  }

  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const levelName = levelNames[level];
    
    if (this.isDevelopment) {
      // 开发环境：彩色控制台输出
      return {
        prefix: `%c[${timestamp}] [${levelName}]`,
        style: `color: ${levelColors[level]}; font-weight: bold;`,
        message,
        data
      };
    } else {
      // 生产环境：结构化输出
      return {
        timestamp,
        level: levelName,
        message,
        ...data,
        userAgent: navigator.userAgent,
        url: window.location.href
      };
    }
  }

  log(level, message, data = {}) {
    if (!this.shouldLog(level)) return;

    const formatted = this.formatMessage(level, message, data);

    if (this.isDevelopment) {
      // 开发环境输出
      if (Object.keys(formatted.data).length > 0) {
        console.log(formatted.prefix, formatted.style, formatted.message, formatted.data);
      } else {
        console.log(formatted.prefix, formatted.style, formatted.message);
      }
    } else {
      // 生产环境输出
      console.log(JSON.stringify(formatted));
      
      // 生产环境可以发送到日志服务
      if (config.enableAnalytics && level <= LogLevel.WARN) {
        this.sendToLogService(formatted);
      }
    }
  }

  error(message, data = {}) {
    this.log(LogLevel.ERROR, message, data);
  }

  warn(message, data = {}) {
    this.log(LogLevel.WARN, message, data);
  }

  info(message, data = {}) {
    this.log(LogLevel.INFO, message, data);
  }

  debug(message, data = {}) {
    this.log(LogLevel.DEBUG, message, data);
  }

  // 发送到日志服务（生产环境）
  async sendToLogService(logData) {
    try {
      // 这里可以集成第三方日志服务，如 Sentry、LogRocket 等
      if (config.enableAnalytics) {
        // 示例：发送到后端日志接口
        await fetch(`${config.apiBaseUrl}/api/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logData)
        });
      }
    } catch (error) {
      // 静默处理日志发送失败，避免影响用户体验
      console.error('Failed to send log to service:', error);
    }
  }

  // 性能监控
  time(label) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.time(label);
    }
  }

  timeEnd(label) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.timeEnd(label);
    }
  }

  // 用户行为跟踪
  trackEvent(eventName, properties = {}) {
    this.info(`Event: ${eventName}`, {
      event: eventName,
      properties,
      timestamp: Date.now()
    });
  }

  // API 请求日志
  logApiRequest(method, url, data = {}) {
    this.debug(`API Request: ${method} ${url}`, {
      method,
      url,
      requestData: data,
      timestamp: Date.now()
    });
  }

  logApiResponse(method, url, status, data = {}) {
    const level = status >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
    this.log(level, `API Response: ${method} ${url} (${status})`, {
      method,
      url,
      status,
      responseData: data,
      timestamp: Date.now()
    });
  }

  // 错误边界日志
  logError(error, errorInfo = {}) {
    this.error('Application Error', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo,
      timestamp: Date.now()
    });
  }
}

// 创建全局日志实例
const logger = new Logger();

export default logger;
