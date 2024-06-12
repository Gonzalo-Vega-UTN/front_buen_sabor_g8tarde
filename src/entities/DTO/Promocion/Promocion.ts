
import { Articulo } from "../Articulo/Articulo";
import { Base } from "../Base";

export class Promocion extends Base {
    denominacion: string = '';
    fechaDesde: Date = new Date(); 
    fechaHasta: Date = new Date();
    horaDesde: string  = ''; 
    horaHasta: string  = ''; 
    descripcionDescuento: string = '';
    precioPromocional: number = 0;
    tipoPromocion?: TipoPromocion;
    detallesPromocion: PromocionDetalle[] = [];
  }
export class PromocionDetalle extends Base {
    cantidad: number | null = 0;
    articulo: Articulo = new Articulo();
}

