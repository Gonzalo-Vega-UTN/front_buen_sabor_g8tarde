import { Categoria } from "../entities/DTO/Categoria/Categoria";
import { Imagen } from "../entities/DTO/Imagen";


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

  static async obtenerCategorias(activeSucursalId: string): Promise<Categoria[]> {
    
    try {
      const responseData = await this.request(`/all/${activeSucursalId}`, {
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

  static async obtenerCategoriasPadre(activeSucursalId: string): Promise<Categoria[]> {
    try {
      const responseData = await this.request(`/padres/${activeSucursalId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as Categoria[];
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

  static async agregarCategoria(idPadre: number, activeSucursalId: string,categoria: Categoria): Promise<Categoria> {
    try {
      console.log("Sucursal",activeSucursalId);
      
      
      const responseData = await this.request(`/${activeSucursalId}/${idPadre}`, {
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

  static async eliminarCategoriaById(idSucursal : string , id: number): Promise<Categoria> {
    try {
      return await this.request(`/${idSucursal}/${id}`, {
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

  static async uploadFiles(id: number, files: File[]): Promise<Imagen[]> {
    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('uploads', file);
      formData.append('id', String(id));

      return this.request(`/uploads`, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      }) as Promise<Imagen>;
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error(`Error al subir imágenes para el id ${id}:`, error);
      throw error;
    }
  }

};
