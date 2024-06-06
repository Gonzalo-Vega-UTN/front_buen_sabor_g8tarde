import PedidoFull from "../entities/DTO/Pedido/PedidoFull";

export async function agregarPedido(pedido: PedidoFull): Promise<number> {
    const urlServer = `http://localhost:8080/api/pedidos/guardar`;
    console.log(JSON.stringify(pedido));
    const response = await fetch(urlServer, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(pedido),
        mode: 'cors'
    });
    const responseData = await response.json();
    console.log(responseData);
    if (response.ok) {
        return responseData; // Devuelve el ID del pedido si la respuesta es exitosa
    } else {
        throw new Error('Error al agregar el pedido');
    }
}


export async function traerPedido(id: number) {
    const urlServer = `http://localhost:8080/api/pedidos/traer/${id}`;
    const response = await fetch(urlServer, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
    });
    return (await response.json()) as PedidoFull;
}