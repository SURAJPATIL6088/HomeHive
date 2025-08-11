import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const Unauthorized = () => {
  const { isAuthenticated, role, email } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getRedirectPath = () => {
    if (!isAuthenticated) return '/login';
    
    switch (role) {
      case 'ROLE_ADMIN':
        return '/admin';
      case 'ROLE_ACCOUNTANT':
        return '/accountant';
      case 'ROLE_RESIDENT':
        return '/resident';
      default:
        return '/';
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center">
              <div className="mb-4">
                <i className="fas fa-shield-alt text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              
              <h1 className="display-4 text-danger mb-3">403</h1>
              <h2 className="h4 mb-4">Access Denied</h2>
              
              <div className="alert alert-warning" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Oops!</strong> You don't have permission to access this page.
              </div>

              {isAuthenticated ? (
                <div className="mb-4">
                  <p className="text-muted">
                    Hi <strong>{email}</strong>, 
                    your current role is <span className="badge bg-secondary">{role}</span>.
                    You don't have the required permissions to access this resource.
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-muted">
                    Please log in to access this page.
                  </p>
                </div>
              )}

              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button 
                  className="btn btn-outline-secondary me-md-2" 
                  onClick={handleGoBack}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Go Back
                </button>
                
                <Link to={getRedirectPath()} className="btn btn-primary">
                  <i className="fas fa-home me-2"></i>
                  {isAuthenticated ? 'Dashboard' : 'Login'}
                </Link>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <small className="text-muted">
                  If you believe this is an error, please contact your administrator.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
