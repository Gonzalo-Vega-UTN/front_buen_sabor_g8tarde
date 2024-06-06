import React from 'react';
import BotonDetalle from '../../Botones/BotonDetalle';
import Instrumento from '../../../entidades/instrumentos';
import { useCart } from '../../Carrito/ContextCarrito';
import { useAuth } from '../../../Context/Auth'; // Importar el contexto de autenticación

interface ItemInstrumentoProps {
  instrumento: Instrumento;
}

const ItemInstrumento: React.FC<ItemInstrumentoProps> = ({ instrumento }) => {
  const { agregarAlCarrito } = useCart();
  const { isAuthenticated } = useAuth(); // Obtener el estado de autenticación del contexto

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(instrumento);
  };

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={`/img/${instrumento.imagen}`} className="img-fluid rounded-start" alt={instrumento.instrumento} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{instrumento.instrumento}</h5>
            <p className="card-text">Precio: ${instrumento.precio}</p>
            {instrumento.costoEnvio !== 'G' ? (
              <p className="card-text text-orange"> {/* Cambiar a naranja si no es envío gratis */}
                <img src="img/camion.png" alt="Envío pago" />
                <span className="ms-2">Costo de envío: ${instrumento.costoEnvio}</span>
              </p>
            ) : (
              <p className="card-text text-green"> {/* Cambiar a verde si es envío gratis */}
                <img src="img/camion.png" alt="Envío gratis" />
                <span className="ms-2">Envío gratis a todo el país</span>
              </p>
            )}
            {instrumento.categoria === null ? (
              <p className="card-text">Categoría: Sin asignar</p>
            ) : (
              <p className="card-text">Categoría: {instrumento.categoria.denominacion}</p>
            )}
            <p className="card-text">Cantidad Vendida: {instrumento.cantidadVendida}</p>
            {isAuthenticated && (
               <button className="btn btn-primary me-2" onClick={handleAgregarAlCarrito}>Agregar al carrito</button>
            )}
            <BotonDetalle id={instrumento.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemInstrumento;
