import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

interface RoleBasedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children, roles = [] }: ProtectedRouteProps) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role if roles are specified
  // Note: In a real app, you'd get the role from currentUser custom claims
  const userRole = "admin"; // TODO: Get actual role from currentUser
  
  if (roles.length > 0 && !roles.includes(userRole)) {
    // Redirect to unauthorized or home if role doesn't match
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }: RoleBasedRouteProps) => (
  <ProtectedRoute roles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const StaffRoute = ({ children }: RoleBasedRouteProps) => (
  <ProtectedRoute roles={['staff', 'division_cc', 'division_head', 'hod', 'admin']}>
    {children}
  </ProtectedRoute>
);

// Add more role-based route components as needed