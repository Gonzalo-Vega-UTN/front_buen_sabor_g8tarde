import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/Auth';
import { ArticuloManufacturado } from '../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado';
import { ProductServices } from '../services/ProductServices';
import Carrito from '../components/Carrito/carrito';
import ItemProducto from './itemLista';

const Lista: React.FC = () => {
  const { isAuthenticated, activeUser } = useAuth();
  const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);

  const actualizarLista = async () => {
    try {
      const datos: ArticuloManufacturado[] = await ProductServices.getProducts();
      setProductos(datos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const datos: ArticuloManufacturado[] = await ProductServices.getProducts();
        setProductos(datos);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              {productos.map((producto: ArticuloManufacturado) => (
                <div key={producto.id} className="col-md-6 mb-4">
                  {/* Reemplaza el uso de ItemInstrumento por ItemProducto */}
                  <ItemProducto producto={producto} />
                </div>
              ))}
            </div>
          </div>
          {isAuthenticated && (
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Carrito</h5>
                  <Carrito actualizarLista={actualizarLista}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Lista;
