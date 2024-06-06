import { Base } from "../Base";
import { DomicilioShort } from "../Domicilio/DomicilioShort";
import { DetallePedido } from "./DetallePedido";

export default class PedidoFull extends Base {
    horaEstimadaFinalizacion: string  = ''; 
    total: number  = 0;
    totalCosto: number = 0;
    estado?: Estado;
    tipoEnvio?: TipoEnvio;
    formaDePago: string = '';
    fechaPedido: Date = new Date();
    domicilioShort: DomicilioShort=new DomicilioShort() ;
    //cliente: ClienteFull ;
    detallePedidoList: DetallePedido[] = [];
}