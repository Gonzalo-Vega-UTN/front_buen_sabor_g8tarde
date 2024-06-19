import React, { createContext, useContext, useState, useEffect } from 'react';
import { Rol } from '../entities/enums/Rol';

// Define el tipo de contexto
interface AuthContextType {
  isAuthenticated: boolean;
  activeUser: string;
  userRol: Rol;
  activeSucursal:string;
  isSelected:boolean;
  login: (username: string, rol: Rol) => void;
  logout: () => void;
  selectSucursal:(idSucursal:number)=>void;
}

// Crea el contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  activeUser: '',
  userRol: Rol.Cliente,
  activeSucursal:'0',
  isSelected:false,
  login: () => {},
  logout: () => {},
  selectSucursal:()=>{}
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
  const [isSelected, setisSelected] = useState<boolean>(() => {
    const storedAuthState = localStorage.getItem('isSelected');
    return storedAuthState === 'true' || false;
  });
  const [activeSucursal, setactiveSucursal] = useState<string>(() => {
    return localStorage.getItem('activeSucursal') ||'0';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
    localStorage.setItem('activeUser', activeUser);
    localStorage.setItem('userRol', userRol);
    localStorage.setItem('isSelected', String(isSelected));
    localStorage.setItem('activeSucursal', activeSucursal); 
  }, [isAuthenticated, activeUser, userRol,isSelected,activeSucursal]);

  const login = (username: string, rol: Rol) => { 
    setIsAuthenticated(true);
    setActiveUser(username);
    setUserRol(rol);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveUser('');
    setUserRol(Rol.Cliente); 
  };
  const selectSucursal = (idSucursal:number) => { 
    setisSelected(true)
    setactiveSucursal(String(idSucursal))
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, activeUser, userRol, isSelected, activeSucursal, login, logout,selectSucursal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
