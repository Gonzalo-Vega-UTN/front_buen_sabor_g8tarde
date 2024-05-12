import { RubroType } from "./RubroType";
import { StateType } from "./StateType";

export interface ArticuloInsumo {
  id: number;
  denominacion: string;
  descripcion: string;
  precioVenta: number;
  estadoArticulo: StateType;
  rubro: {
    id: number;
    denominacion: string;
    estadoRubro: StateType;
    tipoRubro: RubroType;
  };
  precioCompra: number;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: {
    id: number;
    denominacion: string;
    abreviatura: string;
  };
  url_Imagen: string;
}
