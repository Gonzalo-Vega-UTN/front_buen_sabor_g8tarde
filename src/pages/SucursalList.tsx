import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getSucursales = async () => {
      try {
        let data;
        if (empresaId) {
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
    setShowModal(true);
  };

  const handleAddSucursal = () => {
    setSucursalEditando(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchSucursales();
  };

  const defaultImageUrl = 'https://http2.mlstatic.com/storage/sc-seller-journey-backoffice/images-assets/234940675890-Sucursales--una-herramienta-para-mejorar-la-gesti-n-de-tus-puntos-de-venta.png';

  return (
    <Container>
      <h2>Sucursales</h2>
      {error && <p>{error}</p>}
      <Button onClick={handleAddSucursal}>Agregar Sucursal</Button>
      <Row>
        {sucursales.map(sucursal => (
          <Col key={sucursal.id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={defaultImageUrl} />
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{sucursalEditando ? 'Editar Sucursal' : 'Agregar Sucursal'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SucursalForm onAddSucursal={handleCloseModal} sucursalEditando={sucursalEditando} idEmpresa={empresaId} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SucursalList;
