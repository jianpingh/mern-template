// 环境配置工具
export const config = {
  // 环境信息
  env: process.env.REACT_APP_ENV || 'development',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  debug: process.env.REACT_APP_DEBUG === 'true',
  logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
  
  // 功能开关
  enableDevtools: process.env.REACT_APP_ENABLE_DEVTOOLS === 'true',
  enableMock: process.env.REACT_APP_ENABLE_MOCK === 'true',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  
  // 应用信息
  appName: process.env.REACT_APP_APP_NAME || 'MERN App',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  
  // 环境检查
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // API 配置
  api: {
    timeout: process.env.REACT_APP_API_TIMEOUT || 10000,
    retries: process.env.REACT_APP_API_RETRIES || 3,
  }
};

// 打印配置信息（仅开发环境）
if (config.isDevelopment && config.debug) {
  console.log('🔧 App Configuration:', config);
}

export default config;
