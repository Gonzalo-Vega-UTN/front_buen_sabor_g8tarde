import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import Row from 'react-bootstrap/esm/Row'
import BarChart from './BarChart'
import { LineChart } from './LineChart'

interface Props {
    titulo: string
    fetchData: (startDate: string, endDate: string) => void
    data: any[]
    typeChart: string
    generateExcel : () => void
}
export const ReporteComponente = ({ fetchData, titulo, data, typeChart, generateExcel }: Props) => {

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

    useEffect(() => {
        fetchData(startDate, endDate)
    }, [startDate, endDate]);

    return (
        <Container className="mt-5">
            <h1>{titulo}</h1>
            <h4>Seleccionar rango de fechas</h4>
            <Form onSubmit={(e) => {
                e.preventDefault()
                console.log("Generar Reporte")
            }} style={{ maxWidth: '50%' }}>
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

                <Row className='my-5'>
                    {typeChart === "bar" ?

                        <BarChart
                            title='Ranking'
                            data={data}
                        />
                        :
                        <LineChart
                            title='Ranking'
                            data={data}
                        />}
                </Row>

            </Form>
            <Button variant="primary" onClick={() => generateExcel(startDate, endDate)}>
                            Generar Excel
                        </Button>
        </Container>
    )
}
