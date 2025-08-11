import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredRoles = [], 
  requireAuth = true 
}) => {
  const { isAuthenticated, role, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Helper function to check if user has specific role
  const hasRole = (requiredRole) => {
    return role === requiredRole;
  };

  // Helper function to check if user has any of the required roles
  const hasAnyRole = (roles) => {
    return roles.includes(role);
  };

  // Check specific role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user has any of the required roles
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required permissions
  return children;
};

// Specific role-based route components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="ROLE_ADMIN">
    {children}
  </ProtectedRoute>
);

export const AccountantRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_ACCOUNTANT']}>
    {children}
  </ProtectedRoute>
);

export const ResidentRoute = ({ children }) => (
  <ProtectedRoute requiredRole="ROLE_RESIDENT">
    {children}
  </ProtectedRoute>
);

// Public route (accessible without authentication)
export const PublicRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);

// Authentication route (redirect if already authenticated)
export const AuthRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect based on user role
    if (role === 'ROLE_ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'ROLE_ACCOUNTANT') {
      return <Navigate to="/accountant" replace />;
    } else if (role === 'ROLE_RESIDENT') {
      return <Navigate to="/resident" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
