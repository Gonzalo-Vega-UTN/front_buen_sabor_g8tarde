import { Promocion } from "../entities/DTO/Promocion/Promocion";
import { TipoPromocion } from "../entities/enums/TipoPromocion";


const BASE_URL = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/promociones`;

export class PromocionService {
  private static urlServer = BASE_URL;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al procesar la solicitud');
    }
    return responseData;
  }

  static async getAll(): Promise<Promocion[]> {
    try {
      const responseData = await this.request('', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as Promocion[];
    } catch (error) {
      console.error('Error al obtener todas las promociones:', error);
      throw error;
    }
  }

  static async getOne(id: number): Promise<Promocion> {
    try {
      return await this.request(`/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as Promocion;
    } catch (error) {
      console.error(`Error al obtener la promoción con ID ${id}:`, error);
      throw error;
    }
  }

  static async create(promocion: Promocion): Promise<Promocion> {
    try {
      if(!promocion.tipoPromocion) {
        promocion.tipoPromocion = TipoPromocion.HappyHour;
      }
      const responseData = await this.request('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promocion),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al agregar la promoción:', error);
      throw error;
    }
  }

  static async update(id: number, promocion: Promocion): Promise<Promocion> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promocion),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al actualizar la promoción:', error);
      throw error;
    }
  }

  static async delete(id: number): Promise<Promocion> {
    try {
      return await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as Promocion;
    } catch (error) {
      console.error(`Error al eliminar la promoción con ID ${id}:`, error);
      throw error;
    }
  }
}

export default PromocionService;
