import { Base } from "../Base";
import {Imagen} from "../Imagen"
export class Categoria extends Base {
    denominacion: string = '';
    imagenes : Imagen[] = [];
    subCategorias: Categoria[] = [];
} 