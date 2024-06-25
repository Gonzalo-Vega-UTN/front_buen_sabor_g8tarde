import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import SucursalForm from './SucursalForm';
import { Sucursal } from '../entities/DTO/Sucursal/Sucursal';
import { Empresa } from '../entities/DTO/Empresa/Empresa';
import { useAuth } from '../Auth/Auth';
import './styles.css'; // Importar tu archivo de estilos
import SucursalService from '../services/SucursalService';
import { useNavigate } from 'react-router-dom';

interface SucursalListProps {
  refresh: boolean;
  empresa?: Empresa;
}

const SucursalList: React.FC<SucursalListProps> = ({ refresh, empresa }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sucursalEditando, setSucursalEditando] = useState<Sucursal | null>(null);
  const [showModal, setShowModal] = useState(false);
 
  const { selectSucursal ,activeSucursal} = useAuth();

  
 
  useEffect(() => {
    const getSucursales = async () => {
      try {
        let data;
        if (empresa) {
          data = await SucursalService.fetchSucursalesByEmpresaId(empresa.id);
        } else {
          data = await SucursalService.fetchSucursales();
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
        data = await SucursalService.fetchSucursalesByEmpresaId(empresa.id);
      } else {
        data = await SucursalService.fetchSucursales();
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
  };

  const handleStatusChange = async (sucursalId: number, alta: boolean) => { //TODO: arreglar baja de una sucursal para que de de baja todo
    try {
      const sucursal = sucursales.find(suc => suc.id === sucursalId);
      if (sucursal) {
        SucursalService.BajaSucursal(sucursal.id);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };


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
              className={activeSucursal === String(sucursal.id) ? "selected-card" : ""}
              style={{ backgroundColor: sucursal.alta ? 'white' : 'darkgrey' }}
            >
              <Card.Img variant="top" src={sucursal.imagenes[0] ? sucursal.imagenes[0].url : 'https://via.placeholder.com/150'} />
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
    </Container>
  );
};

export default SucursalList;
