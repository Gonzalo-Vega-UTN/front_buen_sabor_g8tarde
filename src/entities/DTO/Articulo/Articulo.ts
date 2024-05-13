class Articulo extends Base {
    denominacion: string = '';
    precioVenta: number | null = 0;
    unidadMedida: string ='';
    categoria: Categoria | null = null;
    promocionDetalle: PromocionDetalle[] | null = null;
}