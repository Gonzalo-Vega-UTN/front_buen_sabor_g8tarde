import { Articulo } from "../entities/DTO/Articulo/Articulo";
import { ClienteFull } from "../entities/DTO/Cliente/ClienteFull";
import { DomicilioShort } from "../entities/DTO/Domicilio/DomicilioShort";
import PedidoFull from "../entities/DTO/Pedido/PedidoFull";
import { TipoEnvio } from "../entities/enums/TipoEnvio";

function crearMockPedidoFull(index: number): PedidoFull {
    const pedido = new PedidoFull();
    pedido.id = index
    pedido.horaEstimadaFinalizacion = '2024-06-07T12:00:00';
    pedido.total = 100;
    pedido.totalCosto = 70;
    pedido.formaDePago = 'Tarjeta';
    pedido.fechaPedido = new Date();
    pedido.tipoEnvio = TipoEnvio.Delivery

    pedido.domicilioShort = new DomicilioShort();
    pedido.domicilioShort.calle = 'Av. Siempre Viva';
    pedido.domicilioShort.numero = 742;
    pedido.domicilioShort.localidad = 'Springfield';


    pedido.cliente = {
        nombre: 'Homer',
        apellido: 'Simpson',
        telefono: '555-1234',
        email: 'homer@simpson.com',
        fechaNacimiento: '1956-05-12',
        imagen: 'homer.jpg',
        domicilios: null,
        usuario: { /* datos del usuario */ }
    } as ClienteFull;

    pedido.detallePedidos = [
        {
            id: index,
            alta: true,
            cantidad: 2,
            subTotal: 50,
            articulo: {
                denominacion: 'Donuts',
                precioVenta: 25,
                unidadMedida: null,
                categoria: null
            } as Articulo
        },
        {
            id: index,
            alta: true,
            cantidad: 1,
            subTotal: 50,
            articulo: {
                denominacion: 'Cerveza Duff',
                precioVenta: 50,
                unidadMedida: null,
                categoria: null
            } as Articulo
        }
    ];

    return pedido;
}

export function obtenerPedidosMock(): PedidoFull[] {
    const pedidos: PedidoFull[] = [];

    // Bucle for que se ejecuta 10 veces
    for (let i = 0; i < 10; i++) {
        // Se crea un PedidoFull con el índice del bucle como valor
        const pedidoMock = crearMockPedidoFull(i);

        // Se agrega el PedidoFull al array
        pedidos.push(pedidoMock);
    }

    return pedidos;
}