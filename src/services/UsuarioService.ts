import Usuario from "../entities/DTO/Usuario/Usuario";


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
  }
};
