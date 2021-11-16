import React from 'react'
import { useHistory } from 'react-router-dom';

const ErrorPage = () => {
  const history = useHistory();

  return (
    <>
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-8">
              <div className="text-center form-input-content error-page">
                <h1 className="error-text font-weight-bold">404</h1>
                <h4><i className="fa fa-exclamation-triangle text-warning"></i> The page you were looking for is not found!</h4>
                <p>You may have mistyped the address or the page may have moved.</p>
                <div>
                  <span className="btn btn-primary" onClick={() => history.push('/')}>Back to Home</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
