import Usuario from "../entities/DTO/Usuario/Usuario";

class UsuarioService {
  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/auth`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al procesar la solicitud');
    }
    return response.json();
  }

  static async login(usuario: Usuario, token: string): Promise<Usuario> {
    try {
      const responseData = await this.request('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuario),
      });
      
      // Aquí asumes que el backend devuelve el usuario con el rol
      return responseData as Usuario;
    } catch (error) {
      console.error('Error al hacer el Login', error);
      throw error;
    }
  }

  static async register(usuario: Usuario, token: string): Promise<Usuario> {
    try {
      const responseData = await this.request('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuario),
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
      });
      return responseData;
    } catch (error) {
      console.error('Error al validar existencia usuario:', error);
      throw error;
    }
  }

  static async deleteUsuario(id: string, token: string): Promise<void> {
    try {
      await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}

export default UsuarioService;