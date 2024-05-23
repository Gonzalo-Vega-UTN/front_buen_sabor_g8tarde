import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SucursalList from './SucursalList';
import SucursalForm from './SucursalForm';

const SucursalesPage: React.FC = () => {
  const [refreshSucursales, setRefreshSucursales] = useState(false);

  const handleAddSucursal = () => {
    setRefreshSucursales(!refreshSucursales);
  };

  return (
    <Container>
      <h1>Gestión de Sucursales</h1>
      <Row>
        <Col>
          <SucursalList refresh={refreshSucursales} />
        </Col>
      </Row>
      <Row>
        <Col>
          <SucursalForm onAddSucursal={handleAddSucursal} sucursalEditando={null} />
        </Col>
      </Row>
    </Container>
  );
};

export default SucursalesPage;
