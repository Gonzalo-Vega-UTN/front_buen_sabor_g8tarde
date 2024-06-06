import React, { createContext, useContext, useState, useEffect } from 'react';

// Define el tipo de contexto
interface AuthContextType {
  isAuthenticated: boolean;
  activeUser: string;
  userRol: string;
  login: (username: string, rol: string) => void;
  logout: () => void;
}

// Crea el contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  activeUser: '',
  userRol: '', 
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
  const [userRol, setUserRol] = useState<string>(() => {
    return localStorage.getItem('userRol') || '';
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
    setUserRol(''); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, activeUser, userRol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
