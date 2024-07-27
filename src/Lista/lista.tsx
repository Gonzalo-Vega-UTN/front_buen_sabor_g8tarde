import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/Auth';
import { ArticuloManufacturado } from '../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado';
import { ProductServices } from '../services/ProductServices';
import Carrito from '../components/Carrito/carrito';
import ItemProducto from './itemLista';

interface ListaProps {
  selectedCategoryId: number | null;
}

const Lista: React.FC<ListaProps> = ({ selectedCategoryId }) => {
  const { isAuthenticated } = useAuth();
  const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<ArticuloManufacturado[]>([]);

  const actualizarLista = async () => {
    try {
      const datos: ArticuloManufacturado[] = await ProductServices.getAll("1");
      setProductos(datos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const datos: ArticuloManufacturado[] = await ProductServices.getAll("1");
        setProductos(datos);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      setFilteredProductos(productos.filter(producto => producto.categoria?.id === selectedCategoryId));
    } else {
      setFilteredProductos(productos);
    }
  }, [selectedCategoryId, productos]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              {filteredProductos.map((producto: ArticuloManufacturado) => (
                <div key={producto.id} className="col-md-6 mb-4">
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
                  <Carrito actualizarLista={actualizarLista} isOpen={false} setIsOpen={function (): void {
                    throw new Error('Function not implemented.');
                  } }/>
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
