import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import EmpresaList from './EmpresaList';
import AddEmpresaForm from './AddEmpresaForm';

interface Empresa {
  id: number;
  nombre: string;
  razonSocial: string;
  cuil: string;
}

const EmpresasPage: React.FC = () => {
  const [refreshEmpresas, setRefreshEmpresas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState<Empresa | null>(null);

  const handleAddEmpresa = () => {
    setRefreshEmpresas(!refreshEmpresas);
    setShowModal(false); // Ocultar el modal después de agregar o editar una empresa
    setEmpresaEditando(null); // Limpiar el estado de edición
  };

  const handleShowModal = (empresa: Empresa | null) => {
    setEmpresaEditando(empresa);
    setShowModal(true); // Mostrar el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Ocultar el modal
    setEmpresaEditando(null); // Limpiar el estado de edición al cerrar el modal
  };

  return (
    <Container>
      <h1>Gestión de Empresas</h1>
      <Row className="mb-3">
        <Col>
          <Button onClick={() => handleShowModal(null)}>
            Agregar Empresa
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <EmpresaList refresh={refreshEmpresas} onEditEmpresa={handleShowModal} />
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{empresaEditando ? 'Editar Empresa' : 'Agregar Empresa'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddEmpresaForm onAddEmpresa={handleAddEmpresa} empresaEditando={empresaEditando} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmpresasPage;
