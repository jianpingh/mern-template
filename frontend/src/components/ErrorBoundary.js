import React from 'react';
import logger from '../utils/logger';
import config from '../config';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    logger.logError(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // 自定义的错误 UI
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          border: '1px solid #ff4757', 
          borderRadius: '5px',
          backgroundColor: '#ffe0e0'
        }}>
          <h2>🚨 Something went wrong!</h2>
          <p>We're sorry, but something unexpected happened.</p>
          
          {config.debug && this.state.error && (
            <details style={{ marginTop: '20px' }}>
              <summary>Error Details (Debug Mode)</summary>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                marginTop: '10px',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#2ed573',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
