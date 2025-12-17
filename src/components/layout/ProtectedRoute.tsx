import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
  type?: 'auth' | 'guest';
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  type = 'auth',
  redirectTo = type === 'auth' ? '/login' : '/',
}: ProtectedRouteProps) => {
  const { isAuthenticated, initialize } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      await initialize();
      
      // For guest routes (login/signup), redirect if authenticated
      if (type === 'guest' && isAuthenticated) {
        navigate(redirectTo);
      }
      // For protected routes, redirect to login if not authenticated
      else if (type === 'auth' && !isAuthenticated) {
        navigate(redirectTo);
      }
    };

    checkAuth();
  }, [isAuthenticated, navigate, redirectTo, type, initialize]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or your preferred loading component
  }

  // Only render children if the route is accessible
  if ((type === 'guest' && !isAuthenticated) || (type === 'auth' && isAuthenticated)) {
    return <>{children}</>;
  }

  return null;
};
