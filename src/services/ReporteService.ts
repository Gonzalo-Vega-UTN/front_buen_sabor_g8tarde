
export class ReporteService {
    private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/reportes`;

    private static async request(endpoint: string, options: RequestInit) {
        const response = await fetch(`${this.urlServer}${endpoint}`, options);
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Error al procesar la solicitud');
        }
        return responseData;
    }

    static async getRankingPeriodo(startDate: string, endDate: string) {
        const params = new URLSearchParams();
        params.append("startDate", startDate);
        params.append("endDate", endDate);

        try {
            const responseData = await this.request(`/top-products?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            console.log(responseData)
            return responseData as any[];
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
            throw error;
        }

    }

    static async getMovimientos(startDate: string, endDate: string) {
        const params = new URLSearchParams();
        params.append("startDate", startDate);
        params.append("endDate", endDate);

        try {
            const responseData = await this.request(`/reporte-diario?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            console.log(responseData)
            return responseData as any[];
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
            throw error;
        }

    }


}

export default ReporteService;