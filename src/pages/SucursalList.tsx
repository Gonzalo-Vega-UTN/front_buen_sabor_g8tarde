import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Sucursal } from '../entities/DTO/Sucursal/Sucursal';
import { Empresa } from '../entities/DTO/Empresa/Empresa';
import { useAuth0Extended } from '../Auth/Auth0ProviderWithNavigate';
import SucursalService from '../services/SucursalService';
import SucursalForm from './SucursalForm'; // Asegúrate de importar el formulario de edición
import './styles.css';

interface SucursalListProps {
  refresh: boolean;
  empresa?: Empresa;
  onAddSucursal: () => void;
}

const SucursalList: React.FC<SucursalListProps> = ({ refresh, empresa, onAddSucursal }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { selectSucursal, activeSucursal } = useAuth0Extended();
  const [sucursalEditando, setSucursalEditando] = useState<Sucursal | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const getSucursales = async () => {
      try {
        let data;
        if (empresa) {
          data = await SucursalService.fetchSucursalesByActiveEmpresa(empresa.id);
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
    setSucursalEditando(sucursal); // Almacena la sucursal que se va a editar
    setShowEditModal(true); // Muestra el modal de edición
  };

  const handleCardClick = (sucursalId: number) => {
    selectSucursal(sucursalId);
  };

  const handleStatusChange = async (sucursalId: number, activo: boolean) => {
    try {
      const sucursalIndex = sucursales.findIndex(suc => suc.id === sucursalId);
      if (sucursalIndex !== -1) {
        await SucursalService.bajaSucursal(sucursales[sucursalIndex].id, activo);
        const updatedSucursales = [...sucursales];
        updatedSucursales[sucursalIndex] = {
          ...sucursales[sucursalIndex],
          alta: activo,
        };
        setSucursales(updatedSucursales);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <Button onClick={onAddSucursal}>Agregar Sucursal</Button>
      {error && <p>{error}</p>}
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

      {/* Modal para editar la sucursal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Sucursal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SucursalForm
            onAddSucursal={onAddSucursal}
            sucursalEditando={sucursalEditando}
            empresa={empresa!} // Asegúrate de pasar la empresa activa
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SucursalList;
