import { Imagen } from "../entities/DTO/Articulo/Imagen";
import { ArticuloInsumo } from "../entities/DTO/Articulo/Insumo/ArticuloInsumo";


class ArticuloInsumoService {
  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/articulos/insumos`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al procesar la solicitud');
    }
    return responseData;
  }

  static async obtenerArticulosInsumo(): Promise<ArticuloInsumo[]> {
    try {
      const responseData = await this.request('', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as ArticuloInsumo[];
    } catch (error) {
      console.error('Error al obtener todos los articulos Insumos:', error);
      throw error;
    }
  }

  static async obtenerArticulosInsumosFiltrados(idCategoria?: number, idUnidadMedida?: number, denominacion?: string): Promise<ArticuloInsumo[]> {
    const params = new URLSearchParams();
    if (idCategoria !== undefined) params.append("categoria_id", idCategoria.toString());
    if (idUnidadMedida !== undefined) params.append("unidad_id", idUnidadMedida.toString());
    if (denominacion !== undefined) params.append("denominacion", denominacion);

    try {
      const responseData = await this.request(`/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as ArticuloInsumo[];
    } catch (error) {
      console.error('Error al obtener todos los articulos Insumos: filtrados', error);
      throw error;
    }

  }

  static async crearArticuloInsumo(articuloInsumo: ArticuloInsumo): Promise<ArticuloInsumo> {

    try {
      const responseData = await this.request(``, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articuloInsumo),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al agregar el Articulo Insumo:', error);
      throw error;
    }
  }

  static async actualizarArticuloInsumo(id: number, articuloInsumo: ArticuloInsumo): Promise<ArticuloInsumo> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articuloInsumo),
        mode: 'cors'
      });
      return responseData as ArticuloInsumo;
    } catch (error) {
      console.error('Error al actualizar el Articulo Insumo:', error);
      throw error;
    }
  }

  static async eliminarArticuloInsumoById(id: number): Promise<ArticuloInsumo> {
    try {
      return await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as ArticuloInsumo;
    } catch (error) {
      console.error(`Error al dar de baja el Articulo Insumo con ID ${id}:`, error);
      throw error;
    }
  }

  static async uploadFile(id: number, file: File): Promise<Imagen> {
    const formData = new FormData();
    formData.append('uploads', file);
    formData.append('id', String(id));
    try {
      return await this.request(`/uploads`, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      }) as Imagen;
    } catch (error) {
      console.error(`Error al subir una imagen ${id}:`, error);
      throw error;
    }
  }
};

export default ArticuloInsumoService;