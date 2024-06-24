import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Home.css'; // Importa estilos personalizados
import { Empresa } from '../../entities/DTO/Empresa/Empresa';
import { EmpresaService } from '../../services/EmpresaService';
import { Sucursal } from '../../entities/DTO/Sucursal/Sucursal';
import SucursalService from '../../services/SucursalService';
import { Categoria } from '../../entities/DTO/Categoria/Categoria';
import { CategoriaService } from '../../services/CategoriaService';
import { ProductServices } from '../../services/ProductServices';
import { ArticuloManufacturado } from '../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado';
import { useAuth } from '../../Auth/Auth';
import logo from '../../assets/images/Buen sabor logo 1.png'; // Importa el logo
import Slider from 'react-slick';


const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [showSucursales, setShowSucursales] = useState<boolean>(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const { isAuthenticated } = useAuth();

  const [featuredProducts, setFeaturedProducts] = useState([
    
  ]);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const data = await EmpresaService.getAll();
      setEmpresas(data);
    } catch (error) {
      console.error('Error fetching empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSucursales = async (idEmpresa: number) => {
    try {
      const data = await SucursalService.fetchSucursalesByEmpresaId(idEmpresa);
      setSucursales(data);
      setShowSucursales(true); // Mostrar sucursales después de cargarlas
      setCurrentStep(2); // Avanzar al paso 2 después de cargar las sucursales
    } catch (error) {
      console.error('Error fetching sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async (idSucursal: number) => {
    try {
      const data = await CategoriaService.obtenerCategorias(idSucursal.toString());
      setCategorias(data);
      setCurrentStep(3); // Avanzar al paso 3 después de cargar las categorías
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const fetchProductos = async (idCategoria: number) => {
    try {
      const data = await ProductServices.getAllFiltered(idCategoria.toString());
      setProductos(data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    fetchSucursales(empresa.id);
  };

  const selectSucursal = (sucursal: Sucursal) => {
    fetchCategorias(sucursal.id); // Debes usar el ID de la sucursal aquí, asegúrate de que sea correcto
  };

  const selectCategoria = (categoria: Categoria) => {
    fetchProductos(categoria.id); // Debes usar el ID de la categoría aquí, asegúrate de que sea correcto
    setSelectedCategoryId(categoria.id);
  };

  const defaultImageUrl = 'https://via.placeholder.com/150';

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

  if (loading) {
    return <div className="container">Cargando...</div>;
  }

  return (
    <div className="container-fluid mt-5 home-background text-light">
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
      </div>

      {/* Contenido basado en los pasos */}
      {currentStep === 1 && (
        <Container>
          <h1>Seleccionar Empresa</h1>
          <Row>
            {empresas.map((empresa) => (
              <Col key={empresa.id} sm={12} md={6} lg={4} className="mb-4">
                <Card
                  onClick={() => selectEmpresa(empresa)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Img
                    variant="top"
                    src={empresa.imagenes[0] ? empresa.imagenes[0].url : defaultImageUrl}
                  />
                  <Card.Body>
                    <Card.Title>{empresa.nombre}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {showSucursales && currentStep === 2 && (
        <Container>
          <Button onClick={() => setCurrentStep(1)}>Cambiar Empresa</Button>
          <h2>Seleccionar Sucursal de {selectedEmpresa?.nombre}</h2>
          <Row>
            {sucursales.map((sucursal) => (
              <Col key={sucursal.id} sm={12} md={6} lg={4} className="mb-4">
                <Card
                  onClick={() => selectSucursal(sucursal)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <Card.Title>{sucursal.nombre}</Card.Title>
                    <Card.Text>
                      {/* Agrega aquí cualquier otra información relevante de la sucursal */}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {currentStep === 3 && (
        <Container>
          <Button onClick={() => setCurrentStep(2)}>Cambiar Sucursal</Button>
          <h1>Seleccionar Categoría</h1>
          <Row>
            {categorias.map((categoria) => (
              <Col key={categoria.id} sm={12} md={6} lg={4} className="mb-4">
                <Card onClick={() => selectCategoria(categoria)}>
                  <Card.Body>
                    <Card.Title>{categoria.denominacion}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <h2>Productos Manufacturados</h2>
          <Row>
            {productos.map((producto) => (
              <Col key={producto.id} sm={12} md={6} lg={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{producto.denominacion}</Card.Title>
                    <Card.Text>
                      Descripción: {producto.descripcion}
                    </Card.Text>
                    <Card.Text>
                      Precio: ${producto.precioVenta}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* Carrusel */}
      {showSucursales && currentStep >= 2 && (
        <div className="row mb-4 justify-content-center">
          <div className="col-10">
            <Slider {...settings}>
              {featuredProducts.map((product, index) => (
                <div key={index}>
              
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home
