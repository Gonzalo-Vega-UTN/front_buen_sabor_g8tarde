// SucursalList.tsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { fetchSucursales, fetchSucursalesByEmpresaId } from '../services/SucursalService';
import SucursalForm from './SucursalForm';
import { Sucursal } from '../entities/DTO/Sucursal/Sucursal';
import { Empresa } from '../entities/DTO/Empresa/Empresa';
import { useAuth } from '../Auth/Auth';

interface SucursalListProps {
  refresh: boolean;
  empresa?: Empresa;
}

const SucursalList: React.FC<SucursalListProps> = ({ refresh, empresa }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sucursalEditando, setSucursalEditando] = useState<Sucursal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  const { selectSucursal } = useAuth();

  useEffect(() => {
    const getSucursales = async () => {
      try {
        let data;
        if (empresa) {
          data = await fetchSucursalesByEmpresaId(empresa.id);
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
  }, [refresh, empresa]);

  const handleEdit = (sucursal: Sucursal) => {
    setSucursalEditando(sucursal);
    setShowModal(true);
  };

  const handleAddSucursal = () => {
    setSucursalEditando(null);
    setShowModal(true);
  };

  const handleCloseModal = async () => {
    setShowModal(false);
    try {
      let data;
      if (empresa) {
        data = await fetchSucursalesByEmpresaId(empresa.id);
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

  const handleCardClick = (sucursalId: number) => {
    selectSucursal(sucursalId);
    const selected = sucursales.find(s => s.id === sucursalId) || null;
    setSelectedSucursal(selected);
  };

  const handleStatusChange = async (sucursalId: number, alta: boolean) => {
    try {
      const sucursal = sucursales.find(suc => suc.id === sucursalId);
      if (sucursal) {
        const response = await fetch(`http://localhost:8080/api/sucursales/${sucursalId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...sucursal, alta }),
        });
        if (response.ok) {
          setSucursales(sucursales.map(suc => suc.id === sucursalId ? { ...suc, alta } : suc));
        } else {
          throw new Error('Error updating status');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
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
            <Card 
              onClick={() => handleCardClick(sucursal.id)}
              style={{ backgroundColor: sucursal.alta ? 'white' : 'darkgrey' }}
            >
              <Card.Img variant="top" src={defaultImageUrl} />
              <Card.Body>
                <Card.Title>{sucursal.nombre}</Card.Title>
                <Card.Text>
                  <strong>ID:</strong> {sucursal.id} <br />
                  <strong>Horario Apertura:</strong> {sucursal.horarioApertura} <br />
                  <strong>Horario Cierre:</strong> {sucursal.horarioCierre}
                </Card.Text>
                <Button onClick={(e) => { e.stopPropagation(); handleEdit(sucursal); }}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={sucursal.alta ? 'Alta' : 'Baja'}
                  variant={sucursal.alta ? 'success' : 'danger'}
                  className="ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown.Item onClick={() => handleStatusChange(sucursal.id, true)}>Alta</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange(sucursal.id, false)}>Baja</Dropdown.Item>
                </DropdownButton>
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
          {empresa && <SucursalForm onAddSucursal={handleCloseModal} sucursalEditando={sucursalEditando} empresa={empresa} />}
        </Modal.Body>
      </Modal>
      {selectedSucursal && (
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Sucursal Actual</Card.Title>
            <Card.Text>
              <strong>Nombre:</strong> {selectedSucursal.nombre} <br />
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SucursalList;
