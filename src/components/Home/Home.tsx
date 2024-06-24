import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Home.css';
import { Empresa } from '../../entities/DTO/Empresa/Empresa';
import { EmpresaService } from '../../services/EmpresaService';
import { Sucursal } from '../../entities/DTO/Sucursal/Sucursal';
import SucursalService from '../../services/SucursalService';
import { Categoria } from '../../entities/DTO/Categoria/Categoria';
import { CategoriaService } from '../../services/CategoriaService';
import { ProductServices } from '../../services/ProductServices';
import { ArticuloManufacturado } from '../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado';
import { useAuth } from '../../Auth/Auth';
import logo from '../../assets/images/Buen sabor logo 1.png';
import { useCart } from '../Carrito/ContextCarrito';
import Carrito from '../Carrito/carrito';

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [showSucursales, setShowSucursales] = useState<boolean>(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const { isAuthenticated } = useAuth();
  const { agregarAlCarrito } = useCart(); // Usa el hook useCart para agregar al carrito

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
      setLoading(true);
      const data = await SucursalService.fetchSucursalesByEmpresaId(idEmpresa);
      setSucursales(data);
      setShowSucursales(true);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error fetching sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async (idSucursal: number) => {
    try {
      setLoading(true);
      const data = await CategoriaService.obtenerCategoriasPadre(idSucursal.toString());
      setCategorias(data);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error fetching categorias padre:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async (idCategoria: number) => {
    try {
      setLoading(true);
      const data = await ProductServices.getAllFiltered(String(selectedSucursal.id) , idCategoria);
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
    setSelectedSucursal(sucursal);
    fetchCategorias(sucursal.id);
  };

  const selectCategoria = (categoria: Categoria) => {
    setSelectedCategoryId(categoria.id);
    fetchProductos(categoria.id);
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
                <Card className="product-card">
                <Card.Img
                    variant="top"
                    src={producto.imagenes.length > 0 ? producto.imagenes[0].url : defaultImageUrl}
                    className="product-image"
                  />
                  <Card.Body>
                    <Card.Title>{producto.denominacion}</Card.Title>
                    <Card.Text>
                      {producto.descripcion}
                    </Card.Text>
                    <Card.Text>
                      Precio: ${producto.precioVenta}
                    </Card.Text>
                    <Button variant="primary" className="add-to-cart-button" onClick={() => agregarAlCarrito(producto)}>Añadir al carrito</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {selectedSucursal && ( // Condiciona el renderizado del carrito
        <Carrito actualizarLista={() => fetchProductos(selectedCategoryId!)} />
      )}
    </div>
  );
};

export default Home;
