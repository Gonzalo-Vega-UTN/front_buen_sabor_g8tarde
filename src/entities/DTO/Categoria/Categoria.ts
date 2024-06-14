import { Base } from "../Base";

export class Categoria extends Base {
    denominacion: string = '';
    imagen:string = '';
    subCategorias: Categoria[] = [];
}