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

  static async fetchSucursalesByActiveEmpresa(activeEmpresa: number): Promise<Sucursal[]> {
    try {
      const responseData = await this.request(`/empresa/${activeEmpresa}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as Sucursal[];
    } catch (error) {
      console.error(`Error al obtener sucursales por empresa activa ${activeEmpresa}:`, error);
      throw error;
    }
  }

  static async create(activeEmpresa: string, sucursal: Sucursal): Promise<Sucursal> {
    sucursal.empresa.id = Number(activeEmpresa);
    console.log("ANTES DE GUARDAR UNA SUCURSAL", sucursal);
  
    // Verificar si el nombre ya existe
    const sucursales = await this.fetchSucursales();
    const nombreExiste = sucursales.some((s) => s.nombre === sucursal.nombre);
  
    if (nombreExiste) {
      throw new Error(`Ya existe una sucursal con el nombre '${sucursal.nombre}'.`);
    }
  
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
  static async update(id: number, sucursal: Sucursal): Promise<Sucursal> {
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
      const response = await fetch(`${this.urlServer}/baja/${id}?activo=${activo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
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
}

export default SucursalService;