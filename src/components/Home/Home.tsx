import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Form } from 'react-bootstrap';
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

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [showSucursales, setShowSucursales] = useState<boolean>(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Articulo[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const { isAuthenticated } = useAuth();
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
        const manufacturados = await ProductServices.getAllCategoriaAndSubCategoria(String(selectedSucursal.id), idCategoria);
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

  const selectSucursal = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal);
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
          <Navbar.Brand href="#home">
           
          </Navbar.Brand>
          <Form className="d-flex flex-grow-1 mx-4">
            <Form.Control
              type="search"
              placeholder="Buscar comida..."
              className="me-2 search-bar"
              aria-label="Search"
            />
          </Form>
          {currentStep >= 2 && (
            <Button variant="outline-primary" onClick={() => setCurrentStep(currentStep - 1)}>
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
                  <Card onClick={() => selectSucursal(sucursal)} className="sucursal-card">
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
          <Container>
            <h1 className="section-title">Seleccionar Categoría</h1>
            <Row className="mb-4 categoria-container">
              {subCategoriaSelected && (
                <Col>
                  <Button variant='outline-secondary' className="category-button" onClick={() => fetchCategoriasPadresBySucursal(selectedSucursal?.id)}>
                    Volver
                  </Button>
                </Col>
              )}
              {categorias.map((categoria) => (
                <Col key={categoria.id}>
                  <div className={`category ${selectedCategoryId === categoria.id ? 'selected' : ''}`} onClick={() => selectCategoria(categoria)}>
                    <img src={categoria.imagenes[0] ? categoria.imagenes[0].url : "https://via.placeholder.com/80"} alt={categoria.denominacion} className="category-image" />
                    <p>{categoria.denominacion}</p>
                  </div>
                </Col>
              ))}
            </Row>
            <h2 className="section-title">Productos</h2>
            <div className="products-container">
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <div key={producto.id} className="product-card">
                    <img src={producto.imagenes[0] ? producto.imagenes[0].url : "https://via.placeholder.com/100"} alt={producto.denominacion} className="product-image" />
                    <h3>{producto.denominacion}</h3>
                    <p>{producto instanceof ArticuloManufacturado ? producto.descripcion : ""}</p>
                    <p className="price">Precio: ${producto.precioVenta}</p>
                    {isAuthenticated ? (
                      <Button variant="primary" onClick={() => handleAgregarAlCarrito(producto)}>
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
        )}
      </div>

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
    </div>
  );
};

export default Home;