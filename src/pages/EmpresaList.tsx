import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AddEmpresaForm from './AddEmpresaForm';
import { useNavigate } from 'react-router-dom';

interface Empresa {
  id: number;
  nombre: string;
  razonSocial: string;
  cuil: string;
}

const EmpresaList: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [empresaEditando, setEmpresaEditando] = useState<Empresa | null>(null);
  const navigate = useNavigate(); // Usa useNavigate

  const fetchEmpresas = () => {
    axios.get('http://localhost:8080/api/empresas')
      .then(response => {
        if (Array.isArray(response.data)) {
          setEmpresas(response.data);
        } else {
          console.error('Response is not an array:', response.data);
          setError('Error fetching empresas: Response is not an array');
        }
      })
      .catch(error => {
        console.error('Error fetching empresas:', error);
        setError('Error fetching empresas');
      });
  };

  useEffect(() => {
    fetchEmpresas();
  }, [refresh]);

  const handleEdit = (empresa: Empresa) => {
    setEmpresaEditando(empresa);
  };

  const handleAddEmpresa = () => {
    setEmpresaEditando(null);
    fetchEmpresas();
  };
  const handleCardClick = (empresaId: number) => {
    navigate(`/sucursales/${empresaId}`); // Redirige a la página de sucursales
  };

  return (
    <Container>
      <h2>Empresas</h2>
      {error && <p>{error}</p>}
      {empresaEditando ? (
        <AddEmpresaForm onAddEmpresa={handleAddEmpresa} empresaEditando={empresaEditando} />
      ) : (
        <Row>
          {empresas.map(empresa => (
            <Col key={empresa.id} sm={12} md={6} lg={4} className="mb-4">
              <Card onClick={() => handleCardClick(empresa.id)}>
                <Card.Body>
                  <Card.Title>{empresa.nombre}</Card.Title>
                  <Card.Text>
                    <strong>ID:</strong> {empresa.id} <br />
                    <strong>Razón Social:</strong> {empresa.razonSocial} <br />
                    <strong>CUIL:</strong> {empresa.cuil}
                  </Card.Text>
                  <Button onClick={() => handleEdit(empresa)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default EmpresaList;
