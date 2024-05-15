
import { StateType } from "./StateType";

export interface ArticuloInsumo {
  id: number;
  denominacion: string;
  descripcion: string;
  precioVenta: number;
  estadoArticulo: StateType;
 
  precioCompra: number;
  stockActual: number;
  stockMinimo: number;
  cantidad: number;
  unidadMedida: {
    id: number;
    denominacion: string;
    abreviatura: string;
  };
  url_Imagen: string;
}
