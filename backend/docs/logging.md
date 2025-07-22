# 日志系统使用说明

## 概述
本项目使用 Winston 作为日志库，支持开发环境和生产环境的不同配置。

## 环境配置

### 开发环境
- 日志输出到控制台，彩色显示
- 日志级别：debug
- 包含详细的请求信息和数据库查询信息
- 可选择性输出到文件（设置 LOG_TO_FILE=true）

### 生产环境
- 日志输出到文件
- 日志级别：info
- JSON 格式，便于日志分析工具解析
- 自动日志轮转（单文件最大10MB，保留5个历史文件）

## 日志文件

### 开发环境
- `logs/dev.log` - 开发环境日志（可选）

### 生产环境
- `logs/error.log` - 错误日志
- `logs/warn.log` - 警告及以上级别日志
- `logs/combined.log` - 所有日志
- `logs/exceptions.log` - 未捕获的异常
- `logs/rejections.log` - 未处理的 Promise 拒绝

## 日志级别
- `error`: 错误信息
- `warn`: 警告信息
- `info`: 一般信息
- `debug`: 调试信息

## 启动命令

### 开发环境
```bash
npm run dev          # 开发模式
npm run dev:watch    # 开发模式（自动重启）
```

### 生产环境
```bash
npm start           # 生产模式
npm run prod        # 生产模式（显式）
```

## 环境变量

### 必需变量
- `NODE_ENV`: 环境类型（development/production）
- `PORT`: 服务端口
- `MONGODB_URI`: MongoDB 连接字符串
- `JWT_SECRET`: JWT 密钥

### 可选变量
- `LOG_LEVEL`: 日志级别（debug/info/warn/error）
- `LOG_TO_FILE`: 是否输出到文件（true/false）

## 日志内容

### 请求日志
- 请求开始和结束时间
- HTTP 方法和 URL
- 状态码和响应时间
- IP 地址和 User-Agent
- 唯一请求 ID（便于追踪）

### 数据库日志
- 数据库操作类型
- 集合名称
- 查询参数（开发环境）
- 结果数量

### 认证日志
- 登录成功/失败
- Token 验证结果
- 用户信息

### 错误日志
- 错误消息和堆栈
- 请求上下文
- 用户和请求 ID

## 最佳实践

1. **使用请求 ID**：所有日志都包含请求 ID，便于追踪整个请求生命周期
2. **结构化日志**：使用对象传递额外信息，便于查询和分析
3. **敏感信息**：生产环境不记录敏感数据（密码、token等）
4. **性能监控**：记录请求处理时间，便于性能分析
5. **错误处理**：详细记录错误信息，包含足够的上下文

## 示例用法

```javascript
// 基本日志
logger.info('User logged in', { userId: user.id, username: user.username });

// 带请求 ID 的日志
logger.error('Database error', {
  requestId: req.requestId,
  error: error.message,
  operation: 'findUser'
});

// 数据库操作日志
dbLogger.logQuery('find', 'users', { email: user.email }, req.requestId);
```
