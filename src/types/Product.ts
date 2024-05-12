import { RubroType } from "./RubroType";
import { StateType } from "./StateType";

export interface Product {
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
  tiempoEstimadoCocina: number;
  precioCosto: number;
  receta: string;
  detallesArtManufacturado: [
    {
      cantidad: number;
      articuloInsumo: {
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
      };
    }
  ];
  url_Imagen: string;
}
