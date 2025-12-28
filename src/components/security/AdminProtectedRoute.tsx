import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { path } from '../../utilities/path';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const authState = useSelector((state: any) => state.auth);
  const { token, role } = authState;

  // Not logged in -> redirect to landing page
  if (!token) {
    return <Navigate to={path.LANDING} replace />;
  }

  // Logged in but not admin -> redirect to home page
  if (role !== 'ADMIN') {
    return <Navigate to={path.HOME} replace />;
  }

  // Admin user -> allow access
  return <>{children}</>;
};

export default AdminProtectedRoute;
