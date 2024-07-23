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

  static async login(token: string): Promise<Usuario> {
    try {
      const responseData = await this.request('/login', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return responseData as Usuario;
    } catch (error) {
      console.error('Error al hacer el Login', error);
      throw error;
    }
  }

  static async register(token: string): Promise<Usuario> {
    try {
      const responseData = await this.request('/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        
      });
      return responseData as Usuario;
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    }
  }

  static async validarExistenciaUsuario(token: string): Promise<boolean> {
    try {
      const responseData = await this.request(`/validar`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return responseData;
    } catch (error) {
      console.error('Error al validar existencia usuario:', error);
      throw error;
    }
  }

  static async deleteUsuario(id: number, token: string): Promise<void> {
    try {
      await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  static async getAll(token: string): Promise<Usuario[]> {
    try {
      const responseData = await this.request('', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return responseData;
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      throw error;
    }
  }
}

export default UsuarioService;