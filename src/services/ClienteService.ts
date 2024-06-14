import { Cliente } from "../entities/DTO/Cliente/Cliente";

class ClienteService {
    private static  urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/clientes`;

    private static async request(endpoint: string, options: RequestInit) {
        const response = await fetch(`${this.urlServer}${endpoint}`, options);
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Error al procesar la solicitud');
        }
        return responseData;
    }

    static async agregarcliente(cliente: Cliente): Promise<Cliente> {
        try {
            const responseData = await this.request('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente),
                mode: 'cors'
            });
            return responseData as Cliente; 
        } catch (error) {
            console.error('Error al agregar el cliente:', error);
            throw error;
        }
    }

    static async obtenerclienteById(id: number): Promise<Cliente> {
        try {
            return await this.request(`/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            }) as Cliente;
        } catch (error) {
            console.error(`Error al obtener el cliente con ID ${id}:`, error);
            throw error;
        }
    }

   
}

export default ClienteService;
