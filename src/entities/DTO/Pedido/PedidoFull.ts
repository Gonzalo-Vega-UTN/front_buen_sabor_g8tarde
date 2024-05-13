class PedidoFull {
    horaEstimadaFinalizacion: string | null = ''; // Considera cómo deseas representar LocalTime en TypeScript
    total: number | null = 0;
    totalCosto: number | null = 0;
    estado: Estado | null = null;
    tipoEnvio: TipoEnvio | null = null;
    formaDePago: string = '';
    fechaPedido: string | null = ''; // Considera cómo deseas representar LocalDate en TypeScript
    domicilioShort: DomicilioShort | null = null;
    cliente: ClienteFull | null = null;
    detallePedidoList: DetallePedido[] | null = null;
}