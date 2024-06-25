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
import './RoundCard.css';
import { useNavigate } from 'react-router-dom';
import ArticuloInsumoService from '../../services/ArticuloInsumoService';
import { Articulo } from '../../entities/DTO/Articulo/Articulo';


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
  const { agregarAlCarrito } = useCart(); // Usa el hook useCart para agregar al carrito
  const [subCategoriaSelected, setSubCategoriaSelected] = useState<boolean>(false)
  const navigate = useNavigate();

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
      setSubCategoriaSelected(false)
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
        setSubCategoriaSelected(true) //Controla el boton para volver
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
      } finally {
      }
    } else {
      setCurrentStep(2)
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
    fetchCategoriaById(categoria.id)
  };


  // if (loading) {
  //   return <div className="container">Cargando...</div>;
  // }

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
                    src={empresa.imagenes[0] ? empresa.imagenes[0].url : "https://via.placeholder.com/150"}
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

      {currentStep === 2 && (
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
          <Button onClick={() => {
            setCurrentStep(2)
            setProductos([])
          }}>Cambiar Sucursal</Button>
          <h1>Seleccionar Categoría</h1>
          <Row>
            {subCategoriaSelected && <Button variant='secondary' style={{ width: "100px", height: '100px', borderRadius: "50%" }} onClick={() => fetchCategoriasPadresBySucursal(selectedSucursal?.id)}>Volver</Button>}
            {categorias.map((categoria) => (
              <Col key={categoria.id} className="mb-4">
                <Card className="rounded-card" onClick={() => selectCategoria(categoria)} style={{ cursor: 'pointer' }}>
                  <Card.Img
                    variant="top"
                    src={categoria.imagenes[0] ? categoria.imagenes[0].url : "https://via.placeholder.com/150"}
                    className="rounded-img"
                  />
                  <Card.Body>
                    <Card.Title>{categoria.denominacion}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <h2>Productos</h2>
          <Row>
            {
              productos.length !== 0 ? (
                productos.map((producto) => (
                  <Col key={producto.id} sm={12} md={6} lg={4} className="mb-4">
                    <Card className="product-card">
                      <Card.Img
                        variant="top"
                        src={producto.imagenes.length > 0 ? producto.imagenes[0].url : "https://via.placeholder.com/150"}
                        className="product-image"
                      />
                      <Card.Body>
                        <Card.Title>{producto.denominacion}</Card.Title>
                        <Card.Text>{producto instanceof ArticuloManufacturado ? producto.descripcion : ""}</Card.Text>
                        <Card.Text>Precio: ${producto.precioVenta}</Card.Text>
                        {isAuthenticated ?
                          <Button variant="primary" className="add-to-cart-button" onClick={() => agregarAlCarrito(producto)}>
                            Añadir al carrito
                          </Button>
                          :
                          <Button variant="primary" className="add-to-cart-button" onClick={() => navigate("/registro")}>
                            Login
                          </Button>
                        }
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                selectedCategoryId ? (
                  <p>
                    No hay productos de Categoria{" "}
                    {categorias.filter((cat) => cat.id === selectedCategoryId)[0]?.denominacion}
                  </p>
                ) : null
              )
            }

          </Row>
        </Container>
      )}

      {selectedSucursal && isAuthenticated && ( // Condiciona el renderizado del carrito
        <Carrito actualizarLista={() => fetchProductos(selectedCategoryId!)} />
      )}
    </div>
  );
};

export default Home;
