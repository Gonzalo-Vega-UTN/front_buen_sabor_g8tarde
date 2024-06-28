import Usuario from "../entities/DTO/Usuario/Usuario";

class UsuarioService {
  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/auth`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al procesar la solicitud');
    }
    return responseData;
  }

  static async login(usuario: Usuario): Promise<Usuario> {
    try {
      const responseData = await this.request('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
        mode: 'cors',
      });
      console.log(responseData)
      return responseData;
    } catch (error) {
      console.error('Error al hacer el Login', error);
      throw error;
    }
  }

  static async register(usuario: Usuario): Promise<Usuario> {
    try {
      const responseData = await this.request('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
        mode: 'cors',
      });
      return responseData;
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    }
  }

  static async validarExistenciaUsuario(username: string): Promise<boolean> {
    try {
      const responseData = await this.request(`/validar/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      return responseData;
    } catch (error) {
      console.error('Error al validar existencia usuario:', error);
      throw error;
    }
  }

 

  // Nuevo método para eliminar un usuario
  static async deleteUsuario(id: string): Promise<void> {
    try {
      await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}

export default UsuarioService;