import { Imagen } from "../entities/DTO/Imagen";
import { Sucursal } from "../entities/DTO/Sucursal/Sucursal";

const BASE_URL = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/sucursales`;

export class SucursalService {
  private static urlServer = BASE_URL;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error during request');
    }
    return responseData;
  }

  static async fetchSucursales(): Promise<Sucursal[]> {
    try {
      const responseData = await this.request('', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });

      return responseData as Sucursal[];
    } catch (error) {
      console.error('Error al obtener todas las Sucursales:', error);
      throw error;
    }
  }

  static async getOne(id: string): Promise<Sucursal> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });

      return responseData as Sucursal;
    } catch (error) {
      console.error('Error al obtener todas las Sucursales:', error);
      throw error;
    }
  }

  static async fetchSucursalesByEmpresaId(empresaId: number): Promise<Sucursal[]> {
    try {
      const responseData = await this.request(`/empresa/${empresaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as Sucursal[];
    } catch (error) {
      console.error(`Error al obtener sucursales por empresa ID ${empresaId}:`, error);
      throw error;
    }
  }

  static async createSucursal(sucursal: Sucursal): Promise<Sucursal> {
    console.log("ANTES DE GUARDAR UNA SUCURSAL" , sucursal)
    try {
      const responseData = await this.request('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sucursal),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al crear sucursal:', error);
      throw error;
    }
  }

  static async updateSucursal(id: number, sucursal: Sucursal): Promise<Sucursal> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sucursal),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error(`Error actualizando sucursal con ID ${id}:`, error);
      throw error;
    }
  }
  static async bajaSucursal(id: number, activo: boolean): Promise<void> {
    try {
      // Hacemos la solicitud PUT a /baja/{id} con el parámetro de consulta ?activo
      const response = await fetch(`${this.urlServer}/baja/${id}?activo=${activo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Incluimos CORS para asegurar la compatibilidad
      });
  
      // Verificamos si la respuesta fue exitosa (status 204: No Content)
      if (!response.ok) {
        // Si no fue exitosa, lanzamos un error con el código de estado y el mensaje
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      // Si la respuesta fue exitosa, no hay cuerpo en el retorno (status 204), por lo que no necesitamos responseData
    } catch (error) {
      console.error(`Error actualizando sucursal con ID ${id}:`, error);
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

export default SucursalService;