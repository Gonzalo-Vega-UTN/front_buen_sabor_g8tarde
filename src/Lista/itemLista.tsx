import React from 'react';
import { useCart } from '../components/Carrito/ContextCarrito';
import { useAuth } from '../Auth/Auth';
import { ArticuloManufacturado } from '../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado';

interface ItemLista {
  producto: ArticuloManufacturado;
}

const ItemProducto: React.FC<ItemLista> = ({ producto }) => {
  const { agregarAlCarrito } = useCart();
  const { isAuthenticated } = useAuth(); // Obtener el estado de autenticación del contexto

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto);
  };

  // URL de imagen por defecto
  const defaultImageUrl = 'https://cdn-icons-png.flaticon.com/512/1996/1996068.png';

  return (
    <div className="card mb-5 text-center position-relative" style={{ paddingTop: '75px', background: 'linear-gradient(to bottom, #ff8c00, #ffc966)' }}>
      <div 
        className="position-absolute top-0 start-50 translate-middle" 
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <img 
          src={ defaultImageUrl } 
          className="img-fluid rounded-circle" 
          alt={producto.denominacion} 
          style={{ width: '150px', height: '150px', objectFit: 'cover', border: '5px solid white' }}
        />
      </div>
      <div className="card-body mt-5">
        <p className="badge bg-secondary mb-2">{producto.categoria ? producto.categoria.denominacion : 'Sin asignar'}</p>
        <h5 className="card-title mt-3">{producto.denominacion}</h5>
        <p className="card-text mb-2">{producto.descripcion}</p>
        <p className="card-text">Precio: ${producto.precioVenta}</p>
        {isAuthenticated && (
          <button className="btn btn-primary" onClick={handleAgregarAlCarrito}>Agregar al carrito</button>
        )}
      </div>
    </div>
  );
};

export default ItemProducto;
