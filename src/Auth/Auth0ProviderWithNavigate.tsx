import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth0Provider, AppState, Auth0ContextInterface, User, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import UsuarioService from '../services/UsuarioService';
import { Rol } from '../entities/enums/Rol';

interface Auth0ContextInterfaceExtended<UserType extends User> extends Auth0ContextInterface<UserType> {
  selectSucursal: (sucursalId: number) => void;
  activeSucursal: string | null;
  
}

const Auth0Context = createContext<Auth0ContextInterfaceExtended<User> | undefined>(undefined);

type Props = {
  children: JSX.Element;
};

export const Auth0ProviderWithNavigate = ({ children }: Props) => {
  const navigate = useNavigate();
  const [activeSucursal, setActiveSucursal] = useState<string | null>(null);
  console.log(activeSucursal);
  const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL as string;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  const selectSucursal = (sucursalId: number) => {
    setActiveSucursal(String(sucursalId));
  };

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <Auth0ContextWrapper selectSucursal={selectSucursal} activeSucursal={activeSucursal}>
        {children}
      </Auth0ContextWrapper>
    </Auth0Provider>
  );
};

const Auth0ContextWrapper = ({ children, selectSucursal, activeSucursal }: { children: JSX.Element, selectSucursal: (sucursalId: number) => void, activeSucursal: string | null }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const loginUser = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await UsuarioService.login(token);
          console.log('Usuario logueado:', response);
        } catch (error) {
          console.error("Error al hacer login del usuario:", error);
        }
      }
    };

    loginUser();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <Auth0Context.Provider value={{ ...useAuth0(), selectSucursal, activeSucursal }}>
      {children}
    </Auth0Context.Provider>
  );
};

export const useAuth0Extended = () => {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error('useAuth0Extended must be used within an Auth0ProviderWithNavigate');
  }
  return context;
};