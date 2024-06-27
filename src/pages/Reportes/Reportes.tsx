import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import BarChart from './reportes/BarChart';
import ReporteService from '../../services/ReporteService';
import { ReporteComponente } from './reportes/ReporteComponente';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
export const Reportes = () => {

    const [rankingArticulos, setRankingArticulos] = useState<any[]>([])
    const [movimientos, setMovimietos] = useState<any[]>([])

    const fecthRankingComidas = async (desde: string, hasta: string) => {
        try {
            const rankingData = await ReporteService.getRankingPeriodo(desde, hasta);
            setRankingArticulos(rankingData);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }

    const [movimientosMonetarios, setMovimientosMonetarios] = useState<any[]>([])

    const fetchMovimientos = async (desde: string, hasta: string) => {
        try {
            const movimientos = await ReporteService.getMovimientos(desde, hasta);
            setMovimietos(movimientos);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }

    const generateExcelMovimientos = async (desde: string, hasta: string) => {
        try {
            const excelData = await ReporteService.getMovimientosExel(desde, hasta);
            const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
            //navigate("")
          } catch (error) {
            console.error('Error al generar el Excel:', error);
            if (error instanceof Error) {
              console.log("FALLO");
            }
          }
       
    }

    const generateExcelRanking = async (desde: string, hasta: string) => {
        try {
            await ReporteService.getMovimientosExel(desde, hasta);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }





    return (
        <Container>
            <h1 className=''>Reportes</h1>
            <Row>
                <Col>
                    <ReporteComponente
                        titulo='Ranking comidas más pedidas'
                        fetchData={fecthRankingComidas}
                        data={rankingArticulos}
                        typeChart='bar'
                        generateExcel={generateExcelMovimientos}
                    />
                </Col>
                <Col>
                    <ReporteComponente
                        titulo='Movimientos Monetarios'
                        fetchData={fetchMovimientos}
                        data={movimientos}
                        typeChart='line'
                        generateExcel={generateExcelMovimientos}
                    />
                </Col>
            </Row>





        </Container>
    );
};
