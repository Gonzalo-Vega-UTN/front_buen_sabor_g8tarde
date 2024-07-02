import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import BarChart from "./reportes/BarChart";
import ReporteService from "../../services/ReporteService";
import { ReporteComponente } from "./reportes/ReporteComponente";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
export const Reportes = () => {
    const [rankingArticulos, setRankingArticulos] = useState<any[]>([]);
    const [movimientos, setMovimietos] = useState<any[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<string>('2020-01-01');
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        // Convert to ISO string and then slice to get YYYY-MM-DD format
        setEndDate(today.toISOString().split('T')[0]);
        setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
    }, []);


    const fecthRankingComidas = async (desde: string, hasta: string) => {
        try {
            const rankingData = await ReporteService.getRankingPeriodo(desde, hasta);
            setRankingArticulos(rankingData);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    const [movimientosMonetarios, setMovimientosMonetarios] = useState<any[]>([]);

    const fetchMovimientos = async (desde: string, hasta: string) => {
        try {
            const movimientos = await ReporteService.getMovimientos(desde, hasta);
            setMovimietos(movimientos);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    const generateExcelMovimientos = async (desde: string, hasta: string) => {
        try {
            const excelData = await ReporteService.getMovimientosExel(desde, hasta);
            const blob = new Blob([excelData], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
            //navigate("")
        } catch (error) {
            console.error("Error al generar el Excel:", error);
            if (error instanceof Error) {
                console.log("FALLO");
            }
        }
    };

    const generarExcelCompleto = async (desde: string, hasta: string) => {
        try {
            const excelData = await ReporteService.getReporteCompleto(desde, hasta);
            const blob = new Blob([excelData], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
            //navigate("")
        } catch (error) {
            console.error("Error al generar el Excel:", error);
            if (error instanceof Error) {
                console.log("FALLO");
            }
        }
    };

    const generateExcelRanking = async (desde: string, hasta: string) => {
        try {
            await ReporteService.getMovimientosExel(desde, hasta);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    return (
        <>
            <Container>
                <h1 className="">Reportes</h1>
                <Button onClick={() => setShowModal(true)}>Generar Reporte Completo</Button>
                <Row>
                    <Col>
                        <ReporteComponente
                            titulo="Ranking comidas más pedidas"
                            fetchData={fecthRankingComidas}
                            data={rankingArticulos}
                            typeChart="bar"
                            generateExcel={generateExcelMovimientos}
                        />
                    </Col>
                    <Col>
                        <ReporteComponente
                            titulo="Movimientos Monetarios"
                            fetchData={fetchMovimientos}
                            data={movimientos}
                            typeChart="line"
                            generateExcel={generateExcelMovimientos}
                        />
                    </Col>
                </Row>
            </Container>
            {showModal && (
                <Modal
                    show={showModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Reporte Completo
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Seleccionar rango de fechas</h4>
                        <Row className='' >
                            <Col>
                                <Form.Group controlId="formStartDate">
                                    <Form.Label>Fecha desde</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group controlId="formEndDate" >
                                    <Form.Label>Fecha hasta</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col className='d-flex align-items-end'>

                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button size="lg" className="mx-2" onClick={() => {
                            generarExcelCompleto(startDate, endDate)
                            setShowModal(false)
                        }}>Generar!</Button>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};
