import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sucursales';

export const fetchSucursales = async () => {
  try {
    const response = await axios.get(API_URL);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Response is not an array:', response.data);
      throw new Error('Error fetching sucursales: Response is not an array');
    }
  } catch (error) {
    console.error('Error fetching sucursales:', error);
    throw new Error('Error fetching sucursales');
  }
};
export const fetchSucursalesByEmpresaId = async (empresaId:number) => {
  try {
    const response = await axios.get(`${API_URL}/empresa/${empresaId}`);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Response is not an array:', response.data);
      throw new Error('Error fetching sucursales: Response is not an array');
    }
  } catch (error) {
    console.error('Error fetching sucursales by empresa ID:', error);
    throw new Error('Error fetching sucursales by empresa ID');
  }
};
export const createSucursal = async (sucursal: any) => {
    try {
      console.log(sucursal)
      await axios.post(API_URL, sucursal);
    } catch (error) {
      console.error('Error creating sucursal:', error);
      throw new Error('Error creating sucursal');
    }
  };
  
  export const updateSucursal = async (id: number, sucursal: any) => {
    try {
      
      console.log(sucursal)
      await axios.put(`${API_URL}/${id}`, sucursal);
    } catch (error) {
      console.error('Error updating sucursal:', error);
      throw new Error('Error updating sucursal');
    }
  };
