import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import Usuario from '../entities/DTO/Usuario/Usuario';
import UsuarioService from '../services/UsuarioService';
import { Rol } from '../entities/enums/Rol';

interface AuthContextType {
  isAuthenticated: boolean;
  activeUser: string;
  userRol: Rol;
  activeSucursal: string;
  isSelected: boolean;
  login: (email: string, username: string, rol: Rol) => void;
  logout: () => void;
  selectSucursal: (idSucursal: number) => void;
  googleLogin: (response: CredentialResponse) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  activeUser: '',
  userRol: Rol.Cliente,
  activeSucursal: '0',
  isSelected: false,
  login: () => {},
  logout: () => {},
  selectSucursal: () => {},
  googleLogin: () => {},
});

const GOOGLE_CLIENT_ID = '44321289734-fugt7imldhfb9cb8prachhhugfol4o5o.apps.googleusercontent.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuthState = localStorage.getItem('isAuthenticated');
    return storedAuthState === 'true' || false;
  });
  const [activeUser, setActiveUser] = useState<string>(() => {
    return localStorage.getItem('activeUser') || '';
  });
  const [userRol, setUserRol] = useState<Rol>(() => {
    const storedUserRol = localStorage.getItem('userRol');
    return (storedUserRol as Rol) || Rol.Cliente;
  });
  const [isSelected, setIsSelected] = useState<boolean>(() => {
    const storedAuthState = localStorage.getItem('isSelected');
    return storedAuthState === 'true' || false;
  });
  const [activeSucursal, setActiveSucursal] = useState<string>(() => {
    return localStorage.getItem('activeSucursal') || '0';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
    localStorage.setItem('activeUser', activeUser);
    localStorage.setItem('userRol', userRol);
    localStorage.setItem('isSelected', String(isSelected));
    localStorage.setItem('activeSucursal', activeSucursal);
  }, [isAuthenticated, activeUser, userRol, isSelected, activeSucursal]);

  const login = (email: string, username: string, rol: Rol) => {
    setIsAuthenticated(true);
    setActiveUser(username);
    setUserRol(rol);
    localStorage.setItem('email', email); // Guardar el email en localStorage
    localStorage.setItem('username', username); // Guardar el username en localStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveUser('');
    setUserRol(Rol.Cliente);
    localStorage.removeItem('email');
    localStorage.removeItem('username');
  };

  const selectSucursal = (idSucursal: number) => {
    setIsSelected(true);
    setActiveSucursal(String(idSucursal));
  };

  const googleLogin = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        const decoded: any = jwtDecode(response.credential);
        const email = decoded.email;

        const validacion = await UsuarioService.validarExistenciaUsuario(email);

        if (!validacion) {
          const usuario: Usuario = {
            auth0Id: '', // Debes obtener el ID de autenticación si es necesario
            username: email,
            email: email,
            rol: Rol.Cliente, // Definir el rol adecuado
          };
          await UsuarioService.guardarUsuario(usuario);
        } else {
          await UsuarioService.login(email);
        }

        // Realizar el login con el email como username
        login(email, email, Rol.Cliente);
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          activeUser,
          userRol,
          isSelected,
          activeSucursal,
          login,
          logout,
          selectSucursal,
          googleLogin,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
