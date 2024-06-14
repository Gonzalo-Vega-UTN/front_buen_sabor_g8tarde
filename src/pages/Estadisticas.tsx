import { Container, Row, Col, Card } from 'react-bootstrap'
import { Chart } from 'react-google-charts';

const salesData = [
    ['Month', 'Sales'],
    ['January', 1000],
    ['February', 1170],
    ['March', 660],
    ['April', 1030],
];

const categoryData = [
    ['Category', 'Sales'],
    ['Pizza', 400],
    ['Burgers', 460],
    ['Salads', 1120],
    ['Desserts', 540],
];

const customerSatisfactionData = [
    ['Satisfaction', 'Number'],
    ['Very Satisfied', 20],
    ['Satisfied', 15],
    ['Neutral', 5],
    ['Unsatisfied', 3],
    ['Very Unsatisfied', 2],
];
export const Estadisticas = () => {
    return (
        <>
            <Container>
                <h1 className="my-4">Estadisticas Buen Sabor</h1>
                <Row>
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header>Monthly Sales</Card.Header>
                            <Card.Body>
                                <Chart
                                    chartType="LineChart"
                                    data={salesData}
                                    options={{ title: 'Monthly Sales', curveType: 'function', legend: { position: 'bottom' } }}
                                    width="100%"
                                    height="300px"
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header>Sales by Category</Card.Header>
                            <Card.Body>
                                <Chart
                                    chartType="PieChart"
                                    data={categoryData}
                                    options={{ title: 'Sales by Category' }}
                                    width="100%"
                                    height="300px"
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header>Customer Satisfaction</Card.Header>
                            <Card.Body>
                                <Chart
                                    chartType="BarChart"
                                    data={customerSatisfactionData}
                                    options={{ title: 'Customer Satisfaction' }}
                                    width="100%"
                                    height="300px"
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
