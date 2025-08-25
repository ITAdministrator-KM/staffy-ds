import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role if roles are specified
  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    // Redirect to unauthorized or home if role doesn't match
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <ProtectedRoute roles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const StaffRoute = ({ children }) => (
  <ProtectedRoute roles={['staff', 'division_cc', 'division_head', 'hod', 'admin']}>
    {children}
  </ProtectedRoute>
);

// Add more role-based route components as needed
