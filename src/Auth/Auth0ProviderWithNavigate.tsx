import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth0Provider, AppState, Auth0ContextInterface, User, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import UsuarioService from '../services/UsuarioService'; // Asegúrate de tener la ruta correcta

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
  const { isAuthenticated, user } = useAuth0();
  const [activeSucursal, setActiveSucursal] = useState<string | null>(null);

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

  useEffect(() => {
    const registerOrUpdateUser = async () => {
      if (isAuthenticated && user) {
        const usuario = {
          email: user?.email,
          username: user?.nickname,
          auth0Id: user?.sub ?? '', // Ensure auth0Id is a string, even if undefined
        };
        try {
          await UsuarioService.register(usuario);
        } catch (error) {
          console.error("Error al registrar o actualizar el usuario:", error);
        }
      }
    };

    registerOrUpdateUser();
  }, [isAuthenticated, user]);

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      audience={audience}
      redirectUri={redirectUri}
      onRedirectCallback={onRedirectCallback}
    >
      <Auth0Context.Provider value={{ selectSucursal, activeSucursal }}>
        {children}
      </Auth0Context.Provider>
    </Auth0Provider>
  );
};

export const useAuth0Extended = () => {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error('useAuth0Extended must be used within an Auth0ProviderWithNavigate');
  }
  return context;
};
