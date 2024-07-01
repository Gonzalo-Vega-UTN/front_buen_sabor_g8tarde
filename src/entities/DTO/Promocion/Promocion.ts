
import { TipoPromocion } from "../../enums/TipoPromocion";
import { Articulo } from "../Articulo/Articulo";
import { Base } from "../Base";
import { Imagen } from "../Imagen";

export class Promocion extends Base {
  denominacion: string = '';
  fechaDesde: Date = new Date();
  fechaHasta: Date = new Date();
  horaDesde: string  = '';
  horaHasta: string  = '';
  descripcionDescuento: string = '';
  precioPromocional: number = 0;
  tipoPromocion: TipoPromocion | undefined = undefined;
  detallesPromocion: PromocionDetalle[] = [];
  imagenes: Imagen[] = [];
}
export class PromocionDetalle extends Base {
    cantidad: number = 0;
    articulo: Articulo = new Articulo();
}

