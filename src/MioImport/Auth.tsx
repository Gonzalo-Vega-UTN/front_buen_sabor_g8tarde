import React, { createContext, useContext, useState, useEffect } from 'react';
import { Rol } from '../entities/enums/Rol';

// Define el tipo de contexto
interface AuthContextType {
  isAuthenticated: boolean;
  activeUser: string;
  userRol: Rol;
  login: (username: string, rol: string) => void;
  logout: () => void;
}

// Crea el contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  activeUser: '',
  userRol: Rol.Cliente, 
  login: () => {},
  logout: () => {}
});

// Proveedor de contexto para manejar la autenticación
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

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
    localStorage.setItem('activeUser', activeUser);
    localStorage.setItem('userRol', userRol); 
  }, [isAuthenticated, activeUser, userRol]);

  const login = (username: string, rol: string) => { 
    setIsAuthenticated(true);
    setActiveUser(username);
    setUserRol(rol);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveUser('');
    setUserRol(Rol.Cliente); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, activeUser, userRol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
