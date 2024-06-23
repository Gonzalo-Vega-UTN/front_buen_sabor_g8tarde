import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Home.css'; // Importa estilos personalizados
import { Empresa } from '../../entities/DTO/Empresa/Empresa';
import { EmpresaService } from '../../services/EmpresaService';
import SucursalList from '../../pages/SucursalList';

// Importa el componente Sucursal

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [showSucursales, setShowSucursales] = useState<boolean>(false);

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

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const selectEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowSucursales(true);
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
                    src={empresa.imagenUrl || 'https://via.placeholder.com/150'}
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

      {showSucursales && selectedEmpresa && (
        <SucursalList empresa={selectedEmpresa} refresh={false} />
      )}
    </>
  );
};

export default Home;
