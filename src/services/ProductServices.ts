import { ArticuloManufacturado } from "../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";

const BASE_URL = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/articulos/manufacturados`;
export class ProductServices {

  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/articulos/manufacturados`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al procesar la solicitud');
    }
    return responseData;
  }

  static async getAll(): Promise<ArticuloManufacturado[]> {
    try {
      const responseData = await this.request('', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as ArticuloManufacturado[];
    } catch (error) {
      console.error('Error al obtener todas los ArticuloManufacturados:', error);
      throw error;
    }
  }

  static async getOne(id: number): Promise<ArticuloManufacturado> {
    try {
      return await this.request(`/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as ArticuloManufacturado;
    } catch (error) {
      console.error(`Error al obtener el ArticuloManufacturado con ID ${id}:`, error);
      throw error;
    }
  }

  static async create(ArticuloManufacturado: ArticuloManufacturado): Promise<ArticuloManufacturado> {
    try {
      const responseData = await this.request(``, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ArticuloManufacturado),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al agregar el ArticuloManufacturado:', error);
      throw error;
    }
  }

  static async update(id: number, ArticuloManufacturado: ArticuloManufacturado): Promise<ArticuloManufacturado> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ArticuloManufacturado),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al actualizar el ArticuloManufacturado:', error);
      throw error;
    }
  }

  static async delete(id: number): Promise<ArticuloManufacturado> {
    try {
      return await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as ArticuloManufacturado;
    } catch (error) {
      console.error(`Error al dar de baja el ArticuloManufacturado con ID ${id}:`, error);
      throw error;
    }
  }

  static async getAllFiltered(idCategoria?: number, idUnidadMedida?: number, denominacion?: string): Promise<ArticuloManufacturado[]> {
    try {
      const params = new URLSearchParams();
      if (idCategoria !== undefined) params.append("categoria_id", idCategoria.toString());
      if (idUnidadMedida !== undefined) params.append("unidad_id", idUnidadMedida.toString());
      if (denominacion !== undefined) params.append("denominacion", denominacion);

      const responseData = await this.request(`/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as ArticuloManufacturado[];
    } catch (error) {
      console.error('Error al obtener todas los ArticuloManufacturados:', error);
      throw error;
    }
  }

};
