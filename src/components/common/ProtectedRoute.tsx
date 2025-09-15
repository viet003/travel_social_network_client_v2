import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { path } from '../../utilities/path';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isPublic?: boolean; // If true, redirect authenticated users away from this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isPublic = false }) => {
  const authState = useSelector((state: any) => state.auth);
  const { token, isLoggedIn } = authState;

  // useEffect(() => {
  //   console.log('🔐 ProtectedRoute - Auth State Changed:', authState);
  //   console.log('🔐 ProtectedRoute - Token:', token);
  //   console.log('🔐 ProtectedRoute - IsLoggedIn:', isLoggedIn);
  //   console.log('🔐 ProtectedRoute - IsPublic:', isPublic);
  // }, [authState, token, isLoggedIn, isPublic]);

  // For public routes (like landing page), redirect authenticated users to home
  if (isPublic && token) {
    console.log('🔄 ProtectedRoute - User authenticated, redirecting from public route to home');
    return <Navigate to={path.HOME} replace />;
  }

  // For protected routes, redirect unauthenticated users to landing
  if (!isPublic && !token) {
    console.log('🚫 ProtectedRoute - No token found, redirecting to landing');
    return <Navigate to={path.LANDING} replace />;
  }

  // console.log('✅ ProtectedRoute - Rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
