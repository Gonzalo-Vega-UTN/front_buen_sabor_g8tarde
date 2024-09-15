// src/components/EmpresaList.tsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Empresa } from '../entities/DTO/Empresa/Empresa';
import { EmpresaService } from '../services/EmpresaService';  // Reincorporamos el servicio
import { useAuth0Extended } from '../Auth/Auth0ProviderWithNavigate';

interface EmpresaListProps {
  refresh: boolean;
  onEditEmpresa: (empresa: Empresa) => void;
}

const EmpresaList: React.FC<EmpresaListProps> = ({ refresh, onEditEmpresa }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { activeEmpresa, selectEmpresa } = useAuth0Extended();

  // Función para obtener las empresas usando EmpresaService
  const fetchEmpresas = async () => {
    try {
      const empresasData = await EmpresaService.getAll();  // Uso del servicio
      setEmpresas(empresasData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, [refresh]);

  const handleCardClick = (empresaId: number) => {
    navigate(`/sucursales/${empresaId}`);
  };

  const handleStatusChange = async (empresaId: number, alta: boolean) => {
    try {
      const empresa = empresas.find(emp => emp.id === empresaId);
      if (empresa) {
        const updatedEmpresa = await EmpresaService.update(empresaId, { ...empresa, alta });  // Uso del servicio
        setEmpresas(empresas.map(emp => emp.id === empresaId ? updatedEmpresa : emp));

        // Si la empresa se da de baja, también debemos actualizar el estado en el contexto si es la empresa activa
        if (String(empresaId) === activeEmpresa) {
          selectEmpresa(''); // Limpiar empresa activa si se da de baja
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <Container>
      <h2>Empresas</h2>
      {error && <p>{error}</p>}
      <Row>
        {empresas.map(empresa => (
          <Col key={empresa.id} sm={12} md={6} lg={4} className="mb-4">
            <Card 
              onClick={() => handleCardClick(empresa.id)}
              style={{ backgroundColor: empresa.alta ? 'white' : 'darkgrey' }}
            >
              <Card.Img variant="top" src={empresa.imagenes[0] ? empresa.imagenes[0].url : 'https://via.placeholder.com/150'} />
              <Card.Body>
                <Card.Title>{empresa.nombre}</Card.Title>
                <Card.Text>
                  <strong>ID:</strong> {empresa.id} <br />
                  <strong>Razón Social:</strong> {empresa.razonSocial} <br />
                  <strong>CUIL:</strong> {empresa.cuil}
                </Card.Text>
                <Button variant="warning" onClick={(e) => { e.stopPropagation(); onEditEmpresa(empresa); }}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={empresa.alta ? "Alta" : "Baja"} 
                  variant={empresa.alta ? "success" : "danger"} 
                  className="ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown.Item onClick={() => handleStatusChange(empresa.id, true)}>Alta</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange(empresa.id, false)}>Baja</Dropdown.Item>
                </DropdownButton>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EmpresaList;
