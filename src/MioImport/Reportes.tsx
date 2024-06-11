import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
export const Reportes = () => {
    const [selectedAnio, setSelectedAnio] = useState(Number(new Date().getFullYear()));
    const [dataByMonth, setDataByMonth] = useState<any[]>([]);
    const [dataPerAnio, setDataPerAnio] = useState<any[]>([]);
    const [dataByInstrumento, setDataByInstrumento] = useState<any[]>([])

    useEffect(() => {
        async function fetchData() {
            try {
                const dataByMonthResponse = await ReporteService.getDataByMonthPerAnio(selectedAnio);
                setDataByMonth(dataByMonthResponse);

                const dataPerAnioResponse = await ReporteService.getDataPerAnio();
                setDataPerAnio(dataPerAnioResponse);

                const dataByInstrumentoResponse = await ReporteService.getDataPerInstrumento();
                setDataByInstrumento(dataByInstrumentoResponse);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [selectedAnio]);

    return (
        <Container>
            <h1 className=''>Reportes</h1>
            <div className='d-flex justify-content-between'>
                {dataPerAnio.length > 0 ? (
                    <Container className='pt-1'>
                        <BarChart data={dataPerAnio} />
                    </Container>
                ) : (
                    <p>Error buscando la información por mes</p>
                )}
                {dataByMonth.length > 0 ? (
                    <Container>
                        <label className='mb-1 mr-1' htmlFor="">
                            Elegir un Año:
                            <input
                                type='number'
                                value={selectedAnio}
                                onChange={(e) => setSelectedAnio(Number(e.target.value))}
                            />
                        </label>
                        <BarChart data={dataByMonth} subtitle={`Pedidos del Año: ${selectedAnio}`} />
                    </Container>
                ) : (
                    <p>Error buscando la información por año</p>
                )}
            </div>

            {dataByInstrumento.length > 0 ? (
                <div>
                    <PieChart
                        data={dataByInstrumento}
                    />
                </div>
            ) : (
                <p>Error buscando la información por Instrumento</p>
            )}
        </Container>
    );
};
