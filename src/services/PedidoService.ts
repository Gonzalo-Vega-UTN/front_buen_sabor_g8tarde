import PedidoFull from "../entities/DTO/Pedido/PedidoFull";
import { obtenerPedidosMock } from "./mocks";

class PedidoService {
    private static  urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/pedidos`;

    private static async request(endpoint: string, options: RequestInit) {
        console.log("URL: ", this.urlServer);
        console.log("ENPOINT", endpoint );
        
        const response = await fetch(`${this.urlServer}${endpoint}`, options);
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Error al procesar la solicitud');
        }
        return responseData;
    }

    static async agregarPedido(pedido: PedidoFull): Promise<number> {
        try {
            const responseData = await this.request('/guardar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedido),
                mode: 'cors'
            });
            return responseData; 
        } catch (error) {
            console.error('Error al agregar el pedido:', error);
            throw error;
        }
    }

    static async obtenerPedidoById(id: number): Promise<PedidoFull> {
        try {
            return await this.request(`/traer/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            }) as PedidoFull;
        } catch (error) {
            console.error(`Error al obtener el pedido con ID ${id}:`, error);
            throw error;
        }
    }

    static async obtenerPedidos(fecha : string, flag? : boolean): Promise<PedidoFull[]> {
        if(flag) return obtenerPedidosMock() 
        try {
            return await this.request('/fecha/' + fecha , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            }) as PedidoFull[];
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
            throw error;
        }

    }

    
    
}


export default PedidoService;
