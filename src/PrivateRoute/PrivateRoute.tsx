import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/Auth';
import { Rol } from '../entities/enums/Rol';

interface PrivateRouteProps {
  element: React.ComponentType<any>;
  roles?: Rol[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component, roles }) => {
  const { isAuthenticated, userRol } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(userRol)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado y tiene el rol adecuado, renderiza el componente
  return <Component />;
};

export default PrivateRoute;
