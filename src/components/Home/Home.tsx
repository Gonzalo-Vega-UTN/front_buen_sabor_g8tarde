import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import { CategoriaService } from '../../services/CategoriaService';
import { Categoria } from '../../entities/DTO/Categoria/Categoria';
import Lista from '../../MioImport/lista';
import CarouselComponent from '../Carousel/Carousel';
import { useAuth } from '../../Auth/Auth';
import logo from '../../assets/images/Buen sabor logo 1.png'; // Importa el logo

const Home: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      name: 'Producto 1',
      description: 'Descripción del producto 1',
      imageUrl: '/path/to/image1.jpg'
    },
    {
      name: 'Producto 2',
      description: 'Descripción del producto 2',
      imageUrl: '/path/to/image2.jpg'
    },
    {
      name: 'Producto 3',
      description: 'Descripción del producto 3',
      imageUrl: '/path/to/image3.jpg'
    }
  ]);

  const fetchCategories = async () => {
    try {
      const data = await CategoriaService.obtenerCategorias();
      setCategorias([{
        id: undefined, denominacion: 'Todos', imagen: '',
        alta: false,
        subCategorias: []
      }, ...data]);
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
  }, []);

  const defaultImageUrl = 'https://http2.mlstatic.com/storage/sc-seller-journey-backoffice/images-assets/234940675890-Sucursales--una-herramienta-para-mejorar-la-gesti-n-de-tus-puntos-de-venta.png';

  const handleCategoryClick = (categoryId: number | undefined) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div className="container mt-5">
      {/* Search Bar and Header */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-1">
          {!isAuthenticated && (
            <img src={logo} alt="Logo" className="logo" style={{ maxHeight: '120px' }} />
          )}
        </div>
        <div className="col-md-7">
          <input type="text" className="form-control" placeholder="Buscar comida..." />
        </div>
        <div className="col-md-4">
          <Header />
        </div>
      </div>
      
      {/* Carousel and Introduction Box */}
      <div className="row mb-4">
        <div className="col-12">
          <CarouselComponent products={featuredProducts} />
        </div>
      </div>
      
      {/* Categories */}
      <div className="row mb-4">
        {categorias.map(category => (
          <div
            className={`col-3 text-center ${selectedCategoryId === category.id ? 'selected' : ''}`}
            key={category.id === undefined ? 'all' : category.id}
            onClick={() => handleCategoryClick(category.id)}
          >
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
      <Lista selectedCategoryId={selectedCategoryId} />
    </div>
  );
};

export default Home;
