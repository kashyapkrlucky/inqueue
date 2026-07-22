import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../features/auth/store/useAuthStore';

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
  // isAuthenticated is derived synchronously from localStorage when the
  // store is created, so it's already correct on first render — no need
  // to re-derive it (via initialize()) on every route mount.
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // For guest routes (login/signup), redirect if authenticated
    if (type === 'guest' && isAuthenticated) {
      navigate(redirectTo);
    }
    // For protected routes, redirect to login if not authenticated
    else if (type === 'auth' && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo, type]);

  // Only render children if the route is accessible
  if ((type === 'guest' && !isAuthenticated) || (type === 'auth' && isAuthenticated)) {
    return <>{children}</>;
  }

  return null;
};
