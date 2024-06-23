import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Empresa } from '../entities/DTO/Empresa/Empresa';
import { EmpresaService } from '../services/EmpresaService';

interface EmpresaListProps {
  refresh: boolean;
  onEditEmpresa: (empresa: Empresa) => void;
}

const EmpresaList: React.FC<EmpresaListProps> = ({ refresh, onEditEmpresa }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const empresas = await EmpresaService.getAll();
        setEmpresas(empresas);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };

    fetchEmpresas();
  }, [refresh]);

  const handleCardClick = (empresaId: number) => {
    navigate(`/sucursales/${empresaId}`);
  };

  const handleStatusChange = async (empresaId: number, alta: boolean) => {
    try {
      const empresa = empresas.find(emp => emp.id === empresaId);
      if (empresa) {
        const response = await fetch(`http://localhost:8080/api/empresas/${empresaId}`, { //TODO: arreglar
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...empresa, alta }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el estado de la empresa');
        }

        setEmpresas(empresas.map(emp => emp.id === empresaId ? { ...emp, alta } : emp));
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
                  title={empresa.alta ? "Alta" : "Baja"} // Título del botón según el estado
                  variant={empresa.alta ? "success" : "danger"} // Cambiar a rojo si está de baja
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
