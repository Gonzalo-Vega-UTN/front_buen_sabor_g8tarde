class ReporteService {
    static async getDataByMonthPerAnio(anio: number) {
        let urlServer = 'http://localhost:8080/api/reportes/bars/year/' + anio;
        const response = await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors'
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return await response.json() as any[];
    }

    static async getDataPerAnio() {
        let urlServer = 'http://localhost:8080/api/reportes/bars';
        const response = await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors'
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return await response.json() as any[];
    }

    static async generateExcelReport(fechaDesde: string, fechaHasta: string) {
        const urlServer = `http://localhost:8080/api/reportes/excel?desde=${fechaDesde}&hasta=${fechaHasta}`;
        const response = await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Error al generar el reporte Excel');
        }

        return response.blob();
    }

    static async getDataPerInstrumento() {
        const urlServer = `http://localhost:8080/api/reportes/chart`;
        const response = await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return await response.json() as any[];
    }

    static async generatePdfReport(idInstrumento: string) {
        const urlServer = `http://localhost:8080/api/reportes/pdf/${idInstrumento}`;
        const response = await fetch(urlServer, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/pdf',
            'Access-Control-Allow-Origin': '*'
          },
          mode: "cors"
        });
        console.log(response);
        
      
        if (!response.ok) {
          throw new Error('Error al generar el reporte PDF');
        }
      
        return response.blob();
    }
}

export default ReporteService;