# 前端环境配置说明

## 概述
前端项目支持多环境配置，包括开发环境、生产环境和本地环境，每个环境都有独立的配置文件和特性。

## 环境文件

### 环境优先级
React 环境变量加载优先级（从高到低）：
1. `.env.local` - 本地环境（会被 git 忽略）
2. `.env.development` / `.env.production` - 特定环境
3. `.env` - 默认环境

### 环境文件说明

#### `.env` - 默认配置
```bash
REACT_APP_ENV=development
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=info
```

#### `.env.development` - 开发环境
```bash
REACT_APP_ENV=development
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_DEVTOOLS=true
REACT_APP_ENABLE_MOCK=false
REACT_APP_ENABLE_ANALYTICS=false
```

#### `.env.production` - 生产环境
```bash
REACT_APP_ENV=production
REACT_APP_API_BASE_URL=https://your-production-api.com
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
REACT_APP_ENABLE_DEVTOOLS=false
REACT_APP_ENABLE_MOCK=false
REACT_APP_ENABLE_ANALYTICS=true
```

#### `.env.local` - 本地环境
```bash
REACT_APP_ENV=local
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_MOCK=true
```

## 启动命令

### 开发环境
```bash
npm start              # 默认启动
npm run start:dev      # 明确指定开发环境
npm run start:local    # 本地环境（启用 mock）
```

### 构建命令
```bash
npm run build          # 生产环境构建
npm run build:dev      # 开发环境构建
npm run build:prod     # 生产环境构建
```

### 分析工具
```bash
npm run analyze        # 构建并启动本地服务器预览
```

## 功能特性

### 开发环境特性
- ✅ 详细的控制台日志
- ✅ 错误边界显示详细错误信息
- ✅ API 请求/响应日志
- ✅ 性能监控
- ✅ 开发工具集成
- ✅ 环境信息显示

### 生产环境特性
- ✅ 精简日志输出
- ✅ 错误日志发送到服务器
- ✅ 用户行为分析
- ✅ 性能优化
- ❌ 开发工具禁用
- ❌ 调试信息隐藏

### 本地环境特性
- ✅ Mock 数据支持
- ✅ 完整开发工具
- ✅ 本地 API 调试
- ✅ 详细日志

## 环境变量说明

### 必需变量
- `REACT_APP_ENV`: 环境标识
- `REACT_APP_API_BASE_URL`: API 基础路径
- `REACT_APP_DEBUG`: 调试模式开关
- `REACT_APP_LOG_LEVEL`: 日志级别

### 功能开关
- `REACT_APP_ENABLE_DEVTOOLS`: 开发工具
- `REACT_APP_ENABLE_MOCK`: Mock 数据
- `REACT_APP_ENABLE_ANALYTICS`: 用户分析

### 应用信息
- `REACT_APP_APP_NAME`: 应用名称
- `REACT_APP_VERSION`: 应用版本

## 日志系统

### 日志级别
- `ERROR`: 错误信息（生产环境默认）
- `WARN`: 警告信息
- `INFO`: 一般信息（默认级别）
- `DEBUG`: 调试信息（开发环境推荐）

### 使用方式
```javascript
import logger from '../utils/logger';

// 基本日志
logger.info('User action', { userId: '123' });
logger.error('API error', { error: error.message });

// 性能监控
logger.time('api-request');
// ... API 调用
logger.timeEnd('api-request');

// 用户行为跟踪
logger.trackEvent('button_click', { buttonName: 'submit' });

// API 日志（自动记录）
logger.logApiRequest('POST', '/api/users', userData);
logger.logApiResponse('POST', '/api/users', 201, responseData);
```

## 错误处理

### 错误边界
自动捕获 React 组件错误并记录到日志系统：
- 开发环境：显示详细错误信息
- 生产环境：显示友好错误页面，错误发送到服务器

### 网络错误
自动处理 API 请求错误：
- 记录详细错误信息
- 用户友好的错误提示
- 自动重试机制（可配置）

## 最佳实践

1. **环境隔离**：不同环境使用不同的 API 地址和配置
2. **敏感信息**：不要在前端环境变量中存储敏感信息
3. **日志管理**：生产环境减少日志输出，避免暴露内部信息
4. **错误处理**：使用错误边界和统一的错误处理机制
5. **性能监控**：开发环境启用详细监控，生产环境关注关键指标

## 部署配置

### 开发部署
```bash
npm run build:dev
# 部署到开发服务器
```

### 生产部署
```bash
npm run build:prod
# 部署到生产服务器
```

### 环境检查
在部署前检查环境配置：
```javascript
console.log('Current environment:', config.env);
console.log('API Base URL:', config.apiBaseUrl);
console.log('Debug mode:', config.debug);
```
