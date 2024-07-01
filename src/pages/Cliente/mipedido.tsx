import { useEffect, useState } from 'react';
import { Accordion, ListGroup } from 'react-bootstrap';
import PedidoFull from '../../entities/DTO/Pedido/PedidoFull';
import PedidoService from '../../services/PedidoService';
import { useAuth } from '../../Auth/Auth';

export const MisPedidosList = () => {
    const [pedidos, setPedidos] = useState<PedidoFull[]>();
    const{activeUser}=useAuth()

    const fetchPedidos = async () => {
        try {
            const pedidos = await PedidoService.obtenerPedidosCliente(activeUser);
            const sortedPedidos = pedidos.sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
            setPedidos(sortedPedidos);;
        } catch (error) {
            console.log(error);

        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);
    const formatHora = (hora) => {
        // Asumimos que la hora viene en formato HH:MM:SS
        if (hora && hora.length >= 5) {
            return hora.slice(0, 5); // Corta el string para obtener solo HH:MM
        }
        return "Hora No disponible";
    };
    return (
        <>
            <h1>Lista de Pedidos</h1>
            {pedidos ? pedidos.map((pedido, index) =>
                <Accordion style={{ maxWidth: "80%" }} key={index} className='gap-3'>
                    <Accordion.Item eventKey={String(index)}>
                        <Accordion.Header className='mx-'>
                            <div className="d-flex justify-content-between px-5 w-100">
                                <div>{pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleDateString() : "Fecha No disponible"}</div>
                                <div>Estado: {pedido.estado}</div>
                                <div>Tipo de envio: {pedido.tipoEnvio}</div>
                                <div>Hora de entrega: {formatHora(pedido.horaEstimadaFinalizacion)}</div>
                                <div>
                                {pedido.domicilio ? (
                                    <>
                                    <p>Calle: {pedido.domicilio.calle} Número: {pedido.domicilio.numero}</p>
                                    </>
                                ) : (
                                    <p>Dirección no disponible</p>
                                )}
                                </div>
                                <div>{pedido.total}</div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ListGroup as="ol" numbered>
                                {pedido.detallePedidos.map((detalle, index) =>
                                    <ListGroup.Item as="li" key={index}>{`${detalle.articulo.denominacion}: ${detalle.cantidad} ${detalle.articulo.unidadMedida?.denominacion} = $${detalle.articulo.precioVenta}`}</ListGroup.Item>
                                )}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

            ) : <p>No hay Pedidos realizados </p>}
        </>
    );
};
