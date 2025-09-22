import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { path } from '../../utilities/path';
import LoadingSpinner from './loading/LoadingSpinner';

interface ProtectedResetRouteProps {
  children: React.ReactNode;
}

const ProtectedResetRoute = ({ children }: ProtectedResetRouteProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      // Không có token, redirect về login
      navigate(path.LANDING, { replace: true });
      return;
    }

    // Có token, cho phép truy cập
    setIsValid(true);
    setIsLoading(false);
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isValid) {
    return null; // Sẽ redirect về login
  }

  return <>{children}</>;
};

export default ProtectedResetRoute;
