import React, { useEffect } from 'react';
import { useCart } from './ContextCarrito';
import { Alert, Button, Form } from 'react-bootstrap';
import CheckoutMP from './MP/CheckoutMP';
import './Carrito.css';

const Carrito: React.FC<{ actualizarLista: () => void }> = ({ actualizarLista }) => {
  const { pedido, quitarDelCarrito, agregarAlCarrito, vaciarCarrito, handleCompra, handleCantidadChange, error, preferenceId } = useCart();

  useEffect(() => {
    if (preferenceId) {
      console.log(preferenceId);
    }
  }, [preferenceId]);

  const RealizarCompra = async () => {
    await handleCompra();
    await actualizarLista();
  };

  return (
    <div className="carrito-container">
      <h2 className="carrito-title">Carrito de Compras</h2>
      <p className="carrito-info">Cantidad de ítems: {pedido.detallePedidos.length}</p>
      {pedido.detallePedidos.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        pedido.detallePedidos.map((detalle, index) => (
          <div key={index} className="item-carrito">
            <div className="d-flex align-items-center">
              <img
               //src={require(`./src/assets/images/pizza.jpg`)}
                alt={detalle.articulo?.denominacion}
                className="img-fluid rounded-circle carrito-img"
              />
              <div className="carrito-info">
                <p className="carrito-producto">{detalle.articulo?.denominacion}</p>
                <p className="carrito-subtotal">Precio: ${detalle.subTotal}</p>
              </div>
            </div>
            <div className="botones-carrito">
              <Button variant="danger" onClick={() => quitarDelCarrito(index)}>-</Button>
              <Form.Control
                type="number"
                min={1}
                value={detalle.cantidad}
                onChange={(e) => handleCantidadChange(index, parseInt(e.target.value))}
                className="cantidad"
              />
              <Button variant="success" onClick={() => agregarAlCarrito(detalle.articulo)}>+</Button>
            </div>
          </div>
        ))
      )}
      <p className="carrito-total">Total del Pedido: ${pedido.total}</p>
      <div className="botones"> 
        <Button variant="warning" onClick={vaciarCarrito}>Vaciar Carrito</Button>
        {preferenceId ? (
          <CheckoutMP preferenceId={preferenceId} />
        ) : (
          <Button variant="primary" onClick={RealizarCompra}>Comprar</Button>
        )}
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default Carrito;
