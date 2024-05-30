import { Base } from "../Base";
import { Categoria } from "../Categoria/Categoria";
import { UnidadMedida } from "../UnidadMedida/UnidadMedida";

export class Articulo extends Base {
    denominacion: string = '';
    precioVenta: number  = 0;
    unidadMedida: UnidadMedida | null = null;
    //imagenes: Imagen | null = null;
    categoria: Categoria | null = null;
    //promocionDetalle: PromocionDetalle[] | null = null;
}