import Usuario from "../entities/DTO/Usuario/Usuario";
import { Rol } from "../entities/enums/Rol";


const BASE_URL = "http://localhost:8080/api/auth";

export const UsuarioService = {
  login: async (usuario: Usuario): Promise<Usuario> => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return data;
  },

  register: async (usuario: Usuario): Promise<string> => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.text();
    return data;
  },

  validarExistenciaUsuario: async (nombreUsuario: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/validar?nombreUsuario=${encodeURIComponent(nombreUsuario)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return data;
  },

   LoginFalso  (isAdmin: boolean): Promise<Usuario>  {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = new Usuario();
        if (isAdmin) {
          response.username = "admin";
          response.rol = Rol.Admin;
        } else {
          response.username = "user";
          response.rol = Rol.Cliente;
        }
        resolve(response);
      }, 1000); // Simula un retraso de 1 segundo
    });
  }
  
};
