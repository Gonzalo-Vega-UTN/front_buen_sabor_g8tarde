// src/context/Auth0Context.tsx
import  { createContext, useContext, useState, useEffect } from "react";
import {
  Auth0Provider,
  AppState,
  Auth0ContextInterface,
  User,
  useAuth0,
} from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import UsuarioService from "../services/UsuarioService";
import ClienteService from "../services/ClienteService";
import Usuario from "../entities/DTO/Usuario/Usuario";
import { Rol } from "../entities/enums/Rol";

interface Auth0ContextInterfaceExtended<UserType extends User>
  extends Auth0ContextInterface<UserType> {
  selectSucursal: (sucursalId: number) => void;
  activeSucursal: string;
}

const Auth0Context = createContext<
  Auth0ContextInterfaceExtended<User> | undefined
>(undefined);

type Props = {
  children: JSX.Element;
};

export const Auth0ProviderWithNavigate = ({ children }: Props) => {
  const navigate = useNavigate();
  const [activeSucursal, setActiveSucursal] = useState<string>("");
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
      <Auth0ContextWrapper
        selectSucursal={selectSucursal}
        activeSucursal={activeSucursal}
      >
        {children}
      </Auth0ContextWrapper>
    </Auth0Provider>
  );
};

const Auth0ContextWrapper = ({
  children,
  selectSucursal,
  activeSucursal,
}: {
  children: JSX.Element;
  selectSucursal: (sucursalId: number) => void;
  activeSucursal: string;
}) => {
  const { isAuthenticated, getAccessTokenSilently, logout, user } = useAuth0();
  const navigate = useNavigate();
  const [, setClientFormCompleted] = useState(false);

  useEffect(() => {
    const handleUserAuthentication = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          let response: Usuario;

          const isNewUser = await UsuarioService.validarExistenciaUsuario(token);
          if (!isNewUser) {
            // Construir el objeto Usuario
            const newUsuario: Usuario = {
              auth0Id: user?.sub || '',
              username: user?.name || '',
              email: user?.email || '',
              rol: undefined, // Establecer el rol según la lógica de tu aplicación
            };
            response = await UsuarioService.register(newUsuario, token);
          } else {
            response = await UsuarioService.login(token);
          }

          // Verificar si el usuario tiene un cliente vinculado
          const cliente = await ClienteService.obtenerClienteByUsername(response.username);
          if (!cliente && response.rol== Rol.Cliente ) {
            console.error('Cliente no encontrado:', response.username);
            setClientFormCompleted(false);
            navigate("/formulario-cliente");
          } else {
            setClientFormCompleted(true);
          }
        } catch (error) {
          console.error("Error durante la autenticación del usuario:", error);
          logout({ logoutParams: { returnTo: window.location.origin } });
        }
      }
    };

    handleUserAuthentication();
  }, [isAuthenticated, getAccessTokenSilently, logout, navigate, user]);

  return (
    <Auth0Context.Provider
      value={{ ...useAuth0(), selectSucursal, activeSucursal }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

export const useAuth0Extended = () => {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error(
      "useAuth0Extended must be used within an Auth0ProviderWithNavigate"
    );
  }
  return context;
};
