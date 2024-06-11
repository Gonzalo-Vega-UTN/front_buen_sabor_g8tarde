import { Categoria } from "../entities/DTO/Categoria/Categoria";


export class CategoriaService {
  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/categorias`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al procesar la solicitud');
    }
    return responseData;
  }

  static async obtenerCategorias(): Promise<Categoria[]> {
    
    try {
      const responseData = await this.request('', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as Categoria[];
    } catch (error) {
      console.error('Error al obtener todas las categorias:', error);
      throw error;
    }
  }

  static async obtenerCategoriasPadre(): Promise<Categoria[]> {
    try {
      const responseData = await this.request('/padres', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al obtener todas las categorias padre:', error);
      throw error;
    }
  }

  static async obtenerCategoriaById(id: number): Promise<Categoria> {
    try {
      return await this.request(`/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as Categoria;
    } catch (error) {
      console.error(`Error al obtener la categoria con ID ${id}:`, error);
      throw error;
    }
  }

  static async agregarCategoria(idPadre: number, categoria: Categoria): Promise<Categoria> {
    try {
      console.log("SERVICE," , "PADRE", idPadre, "CATEGORIA", categoria );
      
      const responseData = await this.request(`/${idPadre}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al agregar la Categoria:', error);
      throw error;
    }
  }

  static async agregarSubCategoriaCategoria(idCateogriaPadre: number, categoria: Categoria): Promise<Categoria> {
    try {
      const responseData = await this.request(`/subcategoria/${idCateogriaPadre}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al agregar la Categoria:', error);
      throw error;
    }
  }

  static async actualizarCategoria(idCateogria: number, categoria: Categoria): Promise<Categoria> {
    try {
      const responseData = await this.request(`/subcategoria/${idCateogria}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al actualizar la Categoria:', error);
      throw error;
    }
  }

  static async eliminarCategoriaById(id: number): Promise<Categoria> {
    try {
      return await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as Categoria;
    } catch (error) {
      console.error(`Error al dar de baja la categoria con ID ${id}:`, error);
      throw error;
    }
  }

};
