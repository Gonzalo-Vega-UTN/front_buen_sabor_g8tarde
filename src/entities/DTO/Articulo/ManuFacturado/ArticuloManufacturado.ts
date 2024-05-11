class ArticuloManufacturado extends Articulo {
    descripcion: string = '';
    tiempoEstimadoMinutos: number | null = 0;
    preparacion: string = '';
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[] | null = null;
}