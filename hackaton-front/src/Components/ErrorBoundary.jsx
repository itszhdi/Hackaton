import React, { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false, error: null, errorInfo: null };
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      this.setState({
        error,
        errorInfo
      });
      console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <div>Что-то пошло не так. Попробуйте перезагрузить страницу.</div>;
      }
  
      return this.props.children;
    }
  }
  
  export default ErrorBoundary;