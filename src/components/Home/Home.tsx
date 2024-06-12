// Home.tsx

import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import { CategoriaService } from '../../services/CategoriaService';
import { Categoria } from '../../entities/DTO/Categoria/Categoria';
import Lista from '../../MioImport/lista';
import { useAuth } from '../../Auth/Auth';
import logo from '../../assets/images/Buen sabor logo 1.png'; // Importa el logo
import Slider from 'react-slick';
import './Home.css'; // Importa estilos personalizados
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      name: 'Platillo 1',
      description: 'Descripción del platillo 1',
      imageUrl: 'https://via.placeholder.com/300', // Cambia la URL por la de tu imagen
    },
    {
      name: 'Platillo 2',
      description: 'Descripción del platillo 2',
      imageUrl: 'https://via.placeholder.com/300', // Cambia la URL por la de tu imagen
    },
    {
      name: 'Platillo 3',
      description: 'Descripción del platillo 3',
      imageUrl: 'https://via.placeholder.com/300', // Cambia la URL por la de tu imagen
    },
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
        setError("Ocurrió un error desconocido");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const defaultImageUrl = 'https://via.placeholder.com/150';

  const handleCategoryClick = (categoryId: number | undefined) => {
    setSelectedCategoryId(categoryId);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <div className="container-fluid mt-5 home-background text-light"> {/* Cambiar a la clase home-background */}
      {/* Barra de búsqueda y encabezado */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-1">
          {!isAuthenticated && (
            <img src={logo} alt="Logo" className="logo" />
          )}
        </div>
        <div className="col-md-7">
          <input type="text" className="form-control search-bar" placeholder="Buscar comida..." />
        </div>
        <div className="col-md-4">
          <Header />
        </div>
      </div>
      
      {/* Carrusel */}
      {/* <div className="row mb-4">
        <div className="col-12">
          <Slider {...settings}>
            {featuredProducts.map((product, index) => (
              <div key={index}>
                <img src={product.imageUrl} alt={product.name} className="carousel-image" />
              </div>
            ))}
          </Slider>
        </div>
      </div> */}
      
      {/* Categorías */}
      <div className="row mb-4">
        {categorias.map(category => (
          <div
            className={`col-3 text-center category ${selectedCategoryId === category.id ? 'selected' : ''}`}
            key={category.id === undefined ? 'all' : category.id}
            onClick={() => handleCategoryClick(category.id)}
          >
            <img
              src={category.imagen || defaultImageUrl}
              className="rounded-circle category-image"
              alt={category.denominacion}
            />
            <h5 className="mt-2">{category.denominacion}</h5>
          </div>
        ))}
      </div>

      {/* Productos destacados */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="section-title mb-4">Platillos Destacados</h2>
          <br />
          <br />
          <br />
          <br />
          <Lista selectedCategoryId={selectedCategoryId} />
        </div>
      </div>
    </div>
  );
};

export default Home;
