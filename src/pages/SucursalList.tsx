import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { fetchSucursales } from '../services/SucursalService';
import SucursalForm from './SucursalForm';

interface Sucursal {
  id: number;
  nombre: string;
  horarioApertura: string;
  horarioCierre: string;
  // Añade otras propiedades de Sucursal si es necesario
}

const SucursalList: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sucursalEditando, setSucursalEditando] = useState<Sucursal | null>(null);

  useEffect(() => {
    const getSucursales = async () => {
      try {
        const data = await fetchSucursales();
        setSucursales(data);
      } catch (error) { // Elimina la anotación de tipo aquí
        if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unknown error occurred");
          }
      }
    };

    getSucursales();
  }, [refresh]);

  const handleEdit = (sucursal: Sucursal) => {
    setSucursalEditando(sucursal);
  };

  const handleAddSucursal = () => {
    setSucursalEditando(null);
    fetchSucursales();
  };

  return (
    <Container>
      <h2>Sucursales</h2>
      {error && <p>{error}</p>}
      {sucursalEditando ? (
        <SucursalForm onAddSucursal={handleAddSucursal} sucursalEditando={sucursalEditando} />
      ) : (
        <Row>
          {sucursales.map(sucursal => (
            <Col key={sucursal.id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{sucursal.nombre}</Card.Title>
                  <Card.Text>
                    <strong>ID:</strong> {sucursal.id} <br />
                    <strong>Horario Apertura:</strong> {sucursal.horarioApertura} <br />
                    <strong>Horario Cierre:</strong> {sucursal.horarioCierre}
                  </Card.Text>
                  <Button onClick={() => handleEdit(sucursal)}>
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

export default SucursalList;
