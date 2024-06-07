// Auth.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Rol } from '../entities/enums/Rol';

interface AuthContextType {
  isAuthenticated: boolean;
  userRol: Rol;
  login: (role: Rol) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRol, setUserRol] = useState<Rol>(Rol.Cliente);

  const login = (role: Rol) => {
    setIsAuthenticated(true);
    setUserRol(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRol(Rol.Cliente);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
