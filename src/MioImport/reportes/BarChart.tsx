import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

interface Props{
    data : any[] 
    subtitle?: string
}
const BarChart = ({ data, subtitle } : Props) => {

    const sub = subtitle ? subtitle : "Pedidos por Año"
    
    const options = {
        chart: {
            title: "Venta de Pedidos",
            subtitle: sub,
        },
    };

    return (
        <>
            <Chart
                chartType="Bar"
                width="80%"
                height="300px"
                data={data}
                options={options}
            />
        </>
    );
};

export default BarChart;
