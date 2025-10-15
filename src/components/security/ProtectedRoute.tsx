import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { path } from '../../utilities/path';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isPublic?: boolean; // If true, redirect authenticated users away from this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isPublic = false }) => {
  const authState = useSelector((state: any) => state.auth);
  const { token } = authState;

  if (isPublic && token) {
    console.log('🔄 ProtectedRoute - User authenticated, redirecting from public route to home');
    return <Navigate to={path.HOME} replace />;
  }

  if (!isPublic && !token) {
    console.log('🚫 ProtectedRoute - No token found, redirecting to landing');
    return <Navigate to={path.LANDING} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
