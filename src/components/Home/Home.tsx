import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Home.css'; // Importa estilos personalizados
import { Empresa } from '../../entities/DTO/Empresa/Empresa';
import { EmpresaService } from '../../services/EmpresaService';
import SucursalList from '../../pages/SucursalList';
import { Sucursal } from '../../entities/DTO/Sucursal/Sucursal';
import SucursalService from '../../services/SucursalService';

// Importa el componente Sucursal

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [showSucursales, setShowSucursales] = useState<boolean>(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);



  const fetchEmpresas = async () => {
    try {
      const data = await EmpresaService.getAll();
      setEmpresas(data);
    } catch (error) {
      console.error('Error fetching empresas:', error);
    } finally {
      setLoading(false);
    }
  }

  const fetchSucursales = async (idEmpresa: number) => {
    try {
      const data = await SucursalService.fetchSucursalesByEmpresaId(idEmpresa);
      setSucursales(data);
    } catch (error) {
      console.error('Error fetching sucursales:', error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchEmpresas();
  }, []);


  useEffect(() => {
    if (selectedEmpresa) {
      fetchSucursales(selectedEmpresa.id);
    }
  }, [selectedEmpresa]);

  const selectEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowSucursales(true);
    setCurrentStep(2);
  };

  if (loading) {
    return <div className="container">Cargando...</div>;
  }

  return (
    <>
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
                    src={empresa.imagenes[0] ? empresa.imagenes[0].url : 'https://via.placeholder.com/150'}
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
      {
        currentStep === 2 && (
          <Container>
            <Button onClick={() => setCurrentStep(1)}>Cambiar Empresa</Button>

            <Row>
              {sucursales.map(sucursal => (
                <Col key={sucursal.id} sm={12} md={6} lg={4} className="mb-4">
                  <Card onClick={() => setCurrentStep(3)}
                  >
                    <Card.Img variant="top" src={sucursal.imagenes[0] ? sucursal.imagenes[0].url : 'https://via.placeholder.com/150'} />
                    <Card.Body>
                      <Card.Title>{sucursal.nombre}</Card.Title>
                      <Card.Text>
                        <strong>Horario Apertura:</strong> {sucursal.horarioApertura} <br />
                        <strong>Horario Cierre:</strong> {sucursal.horarioCierre}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

          </Container>
        )
      }

      {currentStep === 3 && (
        
        <Container>
          <Button onClick={() => setCurrentStep(2)}>Cambiar Sucursal</Button>
          <h1>Seleccionar Tus Productos</h1>
            
        </Container>
      )}
    </>
  );
};

export default Home;
