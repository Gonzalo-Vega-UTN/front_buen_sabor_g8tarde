import { Articulo } from "../Articulo";

export class ArticuloInsumo extends Articulo {
    precioCompra: number = 0;
    stockActual: number | null = 0;
    stockMaximo: number | null = 0;
    esParaElaborar: boolean | null = false;
}