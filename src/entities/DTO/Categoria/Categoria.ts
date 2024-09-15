import { Base } from "../Base";
import { Imagen } from "../Imagen"

export class Categoria extends Base {
    [x: string]: any;
    denominacion: string = '';
    imagenes: Imagen[] = [];
    subCategorias: Categoria[] = [];
}