import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import { CategoriaService } from '../../services/CategoriaService';
import { Categoria } from '../../entities/DTO/Categoria/Categoria';
import { ArticuloManufacturado } from '../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado';
import { ProductServices } from '../../services/ProductServices';
import BotonLogin from '../Log-Register/BotonLogin';

const Home = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
    const [error, setError] = useState<string | null>(null);


    // Función para obtener categorías
    const fetchCategories = async () => {
        try {
            const data = await CategoriaService.getCategorias();
            setCategorias(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    // Función para obtener productos
    const fetchProducts = async () => {
        try {
            const data = await ProductServices.getProductsFiltered();
            setProductos(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const defaultImageUrl = 'https://http2.mlstatic.com/storage/sc-seller-journey-backoffice/images-assets/234940675890-Sucursales--una-herramienta-para-mejorar-la-gesti-n-de-tus-puntos-de-venta.png';

    return (
        <div className="container mt-5">
            {/* Search Bar and Header */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <input type="text" className="form-control" placeholder="Buscar comida..." />
                </div>
                <div className="col-md-4">
                    <Header />
                </div>
            </div>
            {/* Categories */}
            <div className="row mb-4">
                {categorias.map(category => (
                    <div className="col-3 text-center" key={category.id}>
                        <img 
                            src={category.imagen || defaultImageUrl} 
                            className="rounded-circle" 
                            alt={category.denominacion} 
                            width="100" 
                        />
                        <h5 className="mt-2">{category.denominacion}</h5>
                    </div>
                ))}
            </div>

            {/* Featured Products */}
            <div className="row">
                {productos.map(product => (
                    <div className="col-md-4" key={product.id}>
                        <div className="card mb-4 shadow-sm">
                            <img src={defaultImageUrl} className="card-img-top" alt={product.denominacion} />
                            <div className="card-body">
                                <h5 className="card-title">{product.denominacion}</h5>
                                <p className="card-text">{product.descripcion}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-primary"><strong>{product.precioVenta}</strong></span>
                                    <button className="btn btn-primary">Agregar al carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
