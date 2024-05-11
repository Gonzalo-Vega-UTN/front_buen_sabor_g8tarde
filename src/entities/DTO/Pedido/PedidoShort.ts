class PedidoShort {
    horaEstimadaFinalizacion: string | null = ''; // Considera cómo deseas representar LocalTime en TypeScript
    total: number | null = 0;
    estado: Estado | null = null;
    tipoEnvio: TipoEnvio | null = null;
    formaDePago: string = '';
    domicilioShortDto: DomicilioShort | null = null;
    cliente: ClienteFull | null = null;
    detallePedidoList: DetallePedido[] | null = null;
}