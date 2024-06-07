import PreferenceMP from "../entities/DTO/MP/PreferenceMP";
import PedidoFull from "../entities/DTO/Pedido/PedidoFull";

export async function createPreferenceMP(pedido?: PedidoFull) {
    let urlServer = "http://localhost:8080/MercadoPago/crear_preference_mp";
    let method: string = "POST";
    const response = await fetch(urlServer, {
        method: method,
        body: JSON.stringify(pedido),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return (await response.json()) as PreferenceMP;
}