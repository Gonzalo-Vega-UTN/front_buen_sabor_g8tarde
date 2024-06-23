import { Empresa } from "../entities/DTO/Empresa/Empresa";
import { Imagen } from "../entities/DTO/Imagen";

export class EmpresaService {

  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/empresas`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al procesar la solicitud');
    }
    return responseData;
  }

  static async getAll(): Promise<Empresa[]> {
    try {
      const responseData = await this.request('', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as Empresa[];
    } catch (error) {
      console.error('Error al obtener todas los Empresas:', error);
      throw error;
    }
  }

  static async getOne(id: number): Promise<Empresa> {
    try {
      return await this.request(`/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as Empresa;
    } catch (error) {
      console.error(`Error al obtener el Empresa con ID ${id}:`, error);
      throw error;
    }
  }

  static async create(Empresa: Empresa): Promise<Empresa> {
    try {
      const responseData = await this.request(``, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Empresa),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al agregar el Empresa:', error);
      throw error;
    }
  }

  static async update(id: number, Empresa: Empresa): Promise<Empresa> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Empresa),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al actualizar el Empresa:', error);
      throw error;
    }
  }

  static async delete(id: number): Promise<Empresa> {
    try {
      return await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as Empresa;
    } catch (error) {
      console.error(`Error al dar de baja el Empresa con ID ${id}:`, error);
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

