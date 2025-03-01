import { Navigate, Outlet } from 'react-router-dom';
import { isTokenValid } from '../lib/api';

export default function ProtectedRoute() {
  const isAuthenticated = isTokenValid();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}