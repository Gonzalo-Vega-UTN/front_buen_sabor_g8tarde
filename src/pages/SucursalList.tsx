import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { fetchSucursales, fetchSucursalesByEmpresaId } from '../services/SucursalService';
import SucursalForm from './SucursalForm';

interface Sucursal {
  id: number;
  nombre: string;
  horarioApertura: string;
  horarioCierre: string;
}

interface SucursalListProps {
  refresh: boolean;
  empresaId?: number;
}

const SucursalList: React.FC<SucursalListProps> = ({ refresh, empresaId }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sucursalEditando, setSucursalEditando] = useState<Sucursal | null>(null);

  useEffect(() => {
    const getSucursales = async () => {
      try {
        let data;
        if (empresaId) {
          console.log("Entre por id")
          data = await fetchSucursalesByEmpresaId(empresaId);
        } else {
          data = await fetchSucursales();
        }
        setSucursales(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    getSucursales();
  }, [refresh, empresaId]);

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
        <SucursalForm onAddSucursal={handleAddSucursal} sucursalEditando={sucursalEditando} idEmpresa={empresaId} />
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
