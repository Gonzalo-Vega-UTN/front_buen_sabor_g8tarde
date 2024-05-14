import { Articulo } from "../Articulo";
import { ArticuloManufacturadoDetalle } from "./ArticuloManufacturadoDetalle";

export class ArticuloManufacturado extends Articulo {
    descripcion: string = '';
    tiempoEstimadoMinutos: number | null = 0;
    preparacion: string = '';
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[] | null = null;
  detallesArtManufacturado: any;
}