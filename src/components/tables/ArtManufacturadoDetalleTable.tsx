import React from 'react';
import { Table, Form } from 'react-bootstrap';
import { ArticuloManufacturadoDetalle } from '../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturadoDetalle';

interface Props {
    detalles: ArticuloManufacturadoDetalle[];
    onCantidadChange: (index: number, newCantidad: number) => void;
}

export const ArticuloManufacturadoDetalleTable = ({ detalles, onCantidadChange }: Props) => {

    const handleCantidadChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCantidad = parseInt(event.target.value, 10);
        if (!isNaN(newCantidad)) {
            onCantidadChange(index, newCantidad);
        }
    };

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Artículo Insumo</th>
                    <th>Precio Compra</th>
                    <th>Stock Actual</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                {detalles.map((detalle, index) => (
                    <tr key={index}>
                        <td>{detalle.articuloInsumo?.denominacion}</td>
                        <td>{detalle.articuloInsumo?.precioCompra ?? 'N/A'}</td>
                        <td>{detalle.articuloInsumo?.stockActual ?? 'N/A'}</td>
                        <td>
                            <Form.Control
                                type="number"
                                value={detalle.cantidad || '0'}
                                onChange={handleCantidadChange(index)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};
