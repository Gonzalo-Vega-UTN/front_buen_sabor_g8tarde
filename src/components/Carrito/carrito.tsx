import React, { useEffect } from 'react';
import { useCart } from './ContextCarrito';
import 'react-toastify/dist/ReactToastify.css';
import { Alert, Form } from 'react-bootstrap';
import CheckoutMP from './MP/CheckoutMP';

const Carrito: React.FC<{ actualizarListaInstrumentos: () => void }> = ({ actualizarListaInstrumentos }) => {
  const { pedido, quitarDelCarrito, agregarAlCarrito, vaciarCarrito, handleCompra, handleCantidadChange, error, costoEnvio, preferenceId } = useCart();

  useEffect(() => {
    if (preferenceId) {
      console.log(preferenceId);
    }
  }, [preferenceId]);

  const RealizarCompra = async () => {
    await handleCompra();
    await actualizarListaInstrumentos();
  };

  return (
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      <p>Cantidad de ítems: {pedido.pedidoDetalle.length}</p>
      {pedido.pedidoDetalle.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        pedido.pedidoDetalle.map((detalle, index) => (
          <div key={index} className="item-carrito d-flex align-items-center mb-3">
            <div className="d-flex align-items-center flex-grow-1">
              <img src={`img/${detalle.instrumento?.imagen}`} alt={detalle.instrumento?.instrumento} className="img-fluid rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
              <div>
                <p>{detalle.instrumento?.instrumento}</p>
                <p>Precio: ${detalle.subtotal}</p>
              </div>
            </div>
            <div className="botones-carrito d-flex align-items-center">
              <button onClick={() => quitarDelCarrito(index)} className="btn btn-danger me-2">-</button>
              <Form.Control
                type="number"
                min={1}
                value={detalle.cantidad}
                onChange={(e) => handleCantidadChange(index, parseInt(e.target.value))}
                className="cantidad"
              />
              <button onClick={() => agregarAlCarrito(detalle.instrumento)} className="btn btn-success ms-2">+</button>
            </div>
          </div>
        ))
      )}
      <p>Costo de Envío: ${costoEnvio}</p>
      <p>Total del Pedido: ${pedido.totalPedido}</p>
      <div className="botones"> 
        <button onClick={vaciarCarrito} className="btn btn-warning me-2">Vaciar Carrito</button>
        {preferenceId ? (
          <CheckoutMP preferenceId={preferenceId} />
        ) : (
          <button onClick={RealizarCompra} className="btn btn-primary">Comprar</button>
        )}
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default Carrito;
