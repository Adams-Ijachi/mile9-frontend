import {Component} from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
    
    console.log('Error: ', error);
    console.log('ErrorInfo: ', errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.errorInfo) {
      return (
        <>
          <div className="container text-center">
            <h1>Something went wrong.</h1>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;