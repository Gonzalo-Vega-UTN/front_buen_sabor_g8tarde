// src/components/PedidosCocinero.tsx
import { useEffect, useState } from 'react';
import { Accordion, Button, ListGroup } from 'react-bootstrap';
import PedidoFull from '../../entities/DTO/Pedido/PedidoFull';
import PedidoService from '../../services/PedidoService';
import { Estado } from '../../entities/enums/Estado';

export const PedidosCocinero = () => {
    const [pedidos, setPedidos] = useState<PedidoFull[]>([]);

    const fetchPedidos = async () => {
        try {
            const pedidos = await PedidoService.obtenerPedidosXEstado(Estado.Preparacion);
            setPedidos(pedidos);
        } catch (error) {
            console.error(error);
        }
    };

    const actualizarEstado = async (id: number) => {
        try {
            await PedidoService.actualizarEstado(id, Estado.Pendiente);
            fetchPedidos();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    return (
        <>
            <h1>Pedidos para Cocinero</h1>
            {pedidos.length > 0 ? pedidos.map((pedido, index) =>
                <Accordion style={{ maxWidth: "80%" }} key={index} className='gap-3'>
                    <Accordion.Item eventKey={String(index)}>
                        <Accordion.Header className='mx-'>
                            <div className="d-flex justify-content-between px-5 w-100">
                                <div>{pedido.id}</div>
                                <div>{pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleDateString() : "Fecha No disponible"}</div>
                                <div>{pedido.domicilioShort ? pedido.domicilioShort.calle : 'Dirección no disponible'}</div>
                                <div>{pedido.total}</div>
                                <div>{`Cliente: ${pedido.cliente ? pedido.cliente.nombre + ' ' + pedido.cliente.apellido : 'Cliente no disponible'} `}</div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ListGroup as="ol" numbered>
                                {pedido.detallePedidos.map((detalle, index) =>
                                    <ListGroup.Item as="li" key={index}>{`${detalle.articulo.denominacion}: ${detalle.cantidad} ${detalle.articulo.unidadMedida?.denominacion} = $${detalle.articulo.precioVenta}`}</ListGroup.Item>
                                )}
                            </ListGroup>
                            <Button variant="warning" onClick={() => actualizarEstado(pedido.id)}>Marcar como Pendiente</Button>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            ) : <p>No hay pedidos en preparación</p>}
        </>
    );
};
