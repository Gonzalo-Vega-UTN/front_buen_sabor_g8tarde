
import { Base } from "../Base";
import { PromocionDetalle } from "./PromocionDetalle";

export class Promocion extends Base {
    denominacion: string = '';
    fechaDesde: Date = new Date(); 
    fechaHasta: Date = new Date();
    horaDesde: string  = ''; 
    horaHasta: string  = ''; 
    descripcionDescuento:string = '';
    precioPromocional: number = 0;
    tipoPromocion?: TipoPromocion ;
    detallesPromocion: PromocionDetalle[] =[];
}

