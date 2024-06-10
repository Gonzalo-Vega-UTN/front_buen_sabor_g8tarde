import Usuario from "../entities/DTO/Usuario/Usuario";


class UsuarioService {
  private static  urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/auth`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || 'Error al procesar la solicitud');
    }
    return responseData;
}

  static async login (usuario: Usuario): Promise<Usuario>  {
    try {
      const responseData = await this.request('/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(usuario),
          mode: 'cors'
      });
      return responseData; 
  } catch (error) {
      console.error('Error al hacer el Login', error);
      throw error;
  }
  }

  static async register (usuario: Usuario): Promise<string> {
    try {
      const responseData = await this.request('/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(usuario),
          mode: 'cors'
      });
      return responseData; 
  } catch (error) {
      console.error('Error al agregar el pedido:', error);
      throw error;
  }
  }

  // static async validarExistenciaUsuario: async (nombreUsuario: string): Promise<boolean> => {
  //   const response = await fetch(`${BASE_URL}/validar?nombreUsuario=${encodeURIComponent(nombreUsuario)}`);
    
  //   if (!response.ok) {
  //     const errorText = await response.text();
  //     throw new Error(errorText);
  //   }

  //   const data = await response.json();
  //   return data;
  // },
  
};

export default UsuarioService;