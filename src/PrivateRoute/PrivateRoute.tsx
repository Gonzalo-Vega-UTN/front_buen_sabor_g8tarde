import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Rol } from '../entities/enums/Rol';

interface PrivateRouteProps {
  element: React.ComponentType<any>;
  roles?: Rol[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component, roles }) => {
  const { isAuthenticated, userRol } = useAuth0();
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
