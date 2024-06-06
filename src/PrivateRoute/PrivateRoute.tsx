import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/Auth';

interface PrivateRouteProps {
  element: React.ComponentType<any>;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component, roles }) => {
  const { isAuthenticated, userRol } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página principal
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(userRol)) {
    // Si está autenticado pero no tiene el rol adecuado, redirige a /lista
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado y tiene el rol adecuado, renderiza el componente
  return <Component />;
};

export default PrivateRoute;
