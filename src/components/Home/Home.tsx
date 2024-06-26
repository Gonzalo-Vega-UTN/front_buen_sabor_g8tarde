import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Carousel } from 'react-bootstrap';
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
import { useCart } from '../Carrito/ContextCarrito';
import Carrito from '../Carrito/carrito';
import { useNavigate } from 'react-router-dom';
import ArticuloInsumoService from '../../services/ArticuloInsumoService';
import { Articulo } from '../../entities/DTO/Articulo/Articulo';
import { Cart, CartFill } from 'react-bootstrap-icons';
import logo from '../../assets/images/Buen sabor logo 1.png';

const Home: React.FC = () => {
  const [, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [, setShowSucursales] = useState<boolean>(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Articulo[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const { isAuthenticated, selectSucursal } = useAuth();
  const { agregarAlCarrito } = useCart();
  const [subCategoriaSelected, setSubCategoriaSelected] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    } catch (error) {
      console.error('Error fetching sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriasPadresBySucursal = async (idSucursal: number) => {
    try {
      setLoading(true);
      setSubCategoriaSelected(false);
      const data = await CategoriaService.obtenerCategoriasPadre(idSucursal.toString());
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias padre:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriaById = async (idCategoria: number) => {
    try {
      setLoading(true);
      const data = await CategoriaService.obtenerCategoriaById(idCategoria);
      if (data.subCategorias && data.subCategorias.length > 0) {
        setCategorias(data.subCategorias);
        setSubCategoriaSelected(true);
      }
    } catch (error) {
      console.error('Error fetching categorias padre:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async (idCategoria: number) => {
    if (selectedSucursal) {
      try {
        const manufacturados = await ProductServices.getAllproductsfromSucursal(String(selectedSucursal.id));
        const insumos = await ArticuloInsumoService.obtenerArticulosInsumosByCategoriaAndSubCategoria(String(selectedSucursal.id), idCategoria);
        setProductos([...manufacturados, ...insumos]);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    } else {
      setCurrentStep(2);
    }
  };

  const selectEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    fetchSucursales(empresa.id);
    setCurrentStep(2);
  };

  const seleccionarSucursal = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal);
    selectSucursal(sucursal.id)
    fetchCategoriasPadresBySucursal(sucursal.id);
    setCurrentStep(3);
  };

  const selectCategoria = (categoria: Categoria) => {
    setSelectedCategoryId(categoria.id);
    fetchProductos(categoria.id);
    fetchCategoriaById(categoria.id);
  };

  const handleAgregarAlCarrito = (producto: Articulo) => {
    agregarAlCarrito(producto);
    setIsCartOpen(true);
  };

  return (
    <div className="home-container">
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src={logo}
              height="120"
              className="d-inline-block align-top"
              alt="Logo"
            />

          </Navbar.Brand>
          <h1>Buen Sabor </h1>
          {currentStep == 1 && <h1></h1>}
          {currentStep >= 2 && (
            <Button
              className="button_change"
              variant="outline-primary"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Cambiar {currentStep === 2 ? 'Empresa' : 'Sucursal'}
            </Button>
          )}
        </Container>
      </Navbar>
      <div className="main-content">
        {currentStep === 1 && (
          <Container>
            <h1 className="section-title">Seleccionar Empresa</h1>
            <Row>
              {empresas.map((empresa) => (
                <Col key={empresa.id} sm={12} md={6} lg={4} className="mb-4">
                  <Card onClick={() => selectEmpresa(empresa)} className="empresa-card">
                    <Card.Img variant="top" src={empresa.imagenes[0] ? empresa.imagenes[0].url : "https://via.placeholder.com/150"} />
                    <Card.Body>
                      <Card.Title>{empresa.nombre}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        )}

        {currentStep === 2 && (
          <Container>
            <h2 className="section-title">Seleccionar Sucursal </h2>
            <Row>
              {sucursales.map((sucursal) => (
                <Col key={sucursal.id} sm={12} md={6} lg={4} className="mb-4">
                  <Card onClick={() => {
                    seleccionarSucursal(sucursal)
                    fetchProductos(1);

                  }} className="sucursal-card">

                    <Card.Img variant="top" src={sucursal.imagenes[0] ? sucursal.imagenes[0].url : "https://via.placeholder.com/150"} />
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
          <>
            {/* Carrusel de productos centrado */}
            <Container className="d-flex justify-content-center align-items-center mb-4">
              <Carousel style={{ maxWidth: '400px' }}>
                {productos.slice(0, 3).map((producto) => (
                  <Carousel.Item key={producto.id}>
                    <img
                      className="d-block w-100"
                      src={producto.imagenes[0] ? producto.imagenes[0].url : "https://via.placeholder.com/400x200"}
                      alt={producto.denominacion}
                    />
                    <Carousel.Caption>
                      <h5>{producto.denominacion}</h5>
                      <p>{producto instanceof ArticuloManufacturado ? producto.descripcion : ""}</p>
                      <p className="price">Precio: ${producto.precioVenta}</p>
                      {isAuthenticated ? (
                        <Button variant="primary" className="boton_add_cart" onClick={() => handleAgregarAlCarrito(producto)}>
                          Añadir al carrito
                        </Button>
                      ) : (
                        <Button variant="primary" onClick={() => navigate("/registro")}>
                          Login
                        </Button>
                      )}
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Container>

            {/* Resto del contenido */}
            <Container>
              <h1 className="section-title">Nuestras Categorias</h1>
              <Row className="mb-4 categoria-container">
                {subCategoriaSelected && (
                  <Col>
                    <Button variant='outline-secondary' className="category-button" onClick={() => fetchCategoriasPadresBySucursal(selectedSucursal?.id)}>
                      Volver
                    </Button>
                  </Col>
                )}
                <Col>
                  <div className={`category ${selectedCategoryId === null ? 'selected' : ''}`} onClick={() => selectCategoria(null)}>
                    <img src="https://via.placeholder.com/80" alt="Todos" className="category-image" />
                    <p>Todos</p>
                  </div>
                </Col>
                {categorias.map((categoria) => (
                  <Col key={categoria.id}>
                    <div className={`category ${selectedCategoryId === categoria.id ? 'selected' : ''}`} onClick={() => selectCategoria(categoria)}>
                      <img src={categoria.imagenes[0] ? categoria.imagenes[0].url : "https://via.placeholder.com/80"} alt={categoria.denominacion} className="category-image" />
                      <p>{categoria.denominacion}</p>
                    </div>
                  </Col>
                ))}
              </Row>

              <h2 className="section-title">Nuestros Productos</h2>
              <div className="products-container">
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <div key={producto.id} className="product-card">
                      <img src={producto.imagenes[0] ? producto.imagenes[0].url : "https://via.placeholder.com/100"} alt={producto.denominacion} className="product-image" />
                      <h3>{producto.denominacion}</h3>
                      <p>{producto instanceof ArticuloManufacturado ? producto.descripcion : ""}</p>
                      <p className="price">Precio: ${producto.precioVenta}</p>
                      {isAuthenticated ? (
                        <Button variant="primary" className="boton_add_cart" onClick={() => handleAgregarAlCarrito(producto)}>
                          Añadir al carrito
                        </Button>
                      ) : (
                        <Button variant="primary" onClick={() => navigate("/registro")}>
                          Login
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  selectedCategoryId && <p>Lo sentimos! No tenemos productos disponibles para esta Categoria!</p>
                )}
              </div>
            </Container>
          </>
        )}



      </div>

      {isAuthenticated && <>
        <Button onClick={() => setIsCartOpen(!isCartOpen)} className="toggle-cart-btn">
          {isCartOpen ? <CartFill size={24} /> : <Cart size={24} />}
        </Button>

        <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
          <Carrito
            actualizarLista={() => fetchProductos(selectedCategoryId!)}
            isOpen={isCartOpen}
            setIsOpen={setIsCartOpen}
          />
        </div>
        <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
          <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>×</button>
          <Carrito
            actualizarLista={() => fetchProductos(selectedCategoryId!)}
            isOpen={isCartOpen}
            setIsOpen={setIsCartOpen}
          />
        </div>
      </>}
    </div>
  );
};

export default Home;