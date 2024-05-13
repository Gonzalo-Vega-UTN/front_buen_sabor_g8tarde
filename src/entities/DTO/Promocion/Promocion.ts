class Promocion extends Base {
    denominacion: string = '';
    fechaDesde: string | null = ''; 
    fechaHasta: string | null = '';
    horaDesde: string | null = ''; 
    horaHasta: string | null = ''; 
    descripcionDescuento: string = '';
    precioPromocional: number | null = 0;
    tipoPromocion: TipoPromocion | null = null;
    detallesPromocion: PromocionDetalle[] | null = null;
}