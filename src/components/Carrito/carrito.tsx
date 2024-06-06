import React, { useEffect } from 'react';
import { useCart } from './ContextCarrito';
import 'react-toastify/dist/ReactToastify.css';
import { Alert, Form } from 'react-bootstrap';
import CheckoutMP from './MP/CheckoutMP';

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
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      <p>Cantidad de ítems: {pedido.detallePedidoList.length}</p>
      {pedido.detallePedidoList.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        pedido.detallePedidoList.map((detalle, index) => (
          <div key={index} className="item-carrito d-flex align-items-center mb-3">
            <div className="d-flex align-items-center flex-grow-1">
              <img src={`img/${detalle.ArticuloManufacturado?.descripcion}`} alt={detalle.ArticuloManufacturado?.denominacion} className="img-fluid rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
              <div>
                <p>{detalle.ArticuloManufacturado?.denominacion}</p>
                <p>Precio: ${detalle.subTotal}</p>
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
              <button onClick={() => agregarAlCarrito(detalle.ArticuloManufacturado)} className="btn btn-success ms-2">+</button>
            </div>
          </div>
        ))
      )}
      <p>Total del Pedido: ${pedido.total}</p>
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
