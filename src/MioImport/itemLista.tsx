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
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img 
            src={ defaultImageUrl} 
            className="img-fluid rounded-start" 
            alt={producto.denominacion} 
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{producto.denominacion}</h5>
            <p className="card-text">Precio: ${producto.precioVenta}</p>
            
            {producto.categoria === null ? (
              <p className="card-text">Categoría: Sin asignar</p>
            ) : (
              <p className="card-text">Categoría: {producto.categoria.denominacion}</p>
            )}
            {isAuthenticated && (
               <button className="btn btn-primary me-2" onClick={handleAgregarAlCarrito}>Agregar al carrito</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemProducto;
