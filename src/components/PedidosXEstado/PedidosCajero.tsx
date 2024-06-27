// src/components/PedidosCajero.tsx
import { useEffect, useState } from 'react';
import { Accordion, Button, ListGroup } from 'react-bootstrap';
import PedidoFull from '../../entities/DTO/Pedido/PedidoFull';
import PedidoService from '../../services/PedidoService';
import { Estado } from '../../entities/enums/Estado';

export const PedidosCajero = () => {
    const [pedidos, setPedidos] = useState<PedidoFull[]>([]);

    const fetchPedidos = async () => {
        try {
            const pedidos = await PedidoService.obtenerPedidosXEstado(Estado.Pendiente);
            setPedidos(pedidos);
        } catch (error) {
            console.error(error);
        }
    };

    const actualizarEstado = async (id: number, nuevoEstado: Estado) => {
        try {
            await PedidoService.actualizarEstado(id, nuevoEstado);
            fetchPedidos(); // Volver a cargar los pedidos después de actualizar el estado
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    return (
        <>
            <h1>Pedidos para Cajero</h1>
            {pedidos.length > 0 ? pedidos.map((pedido, index) =>
                <Accordion style={{ maxWidth: "80%" }} key={index} className='gap-3'>
                    <Accordion.Item eventKey={String(index)}>
                        <Accordion.Header className='mx-'>
                            <div className="d-flex justify-content-between px-5 w-100">
                                <div>{pedido.id}</div>
                                <div>{pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleDateString() : "Fecha No disponible"}</div>
                                <div>{pedido.tipoEnvio ? pedido.tipoEnvio : 'Estado no disponible'}</div>
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
                            <div className="d-flex justify-content-between mt-3">
                                <Button variant="warning" onClick={() => actualizarEstado(pedido.id, Estado.EnDelivery)}>Marcar como En Delivery</Button>
                                <Button variant="success" onClick={() => actualizarEstado(pedido.id, Estado.Entregado)}>Marcar como Entregado</Button>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            ) : <p>No hay pedidos pendientes</p>}
        </>
    );
};
