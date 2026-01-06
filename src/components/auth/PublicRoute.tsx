import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuthStore();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated()) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}

