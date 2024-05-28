import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SucursalList from './SucursalList';
import SucursalForm from './SucursalForm';
import { useParams } from 'react-router-dom';

const SucursalesPage: React.FC = () => {
  const { id } = useParams();
  const [refreshSucursales, setRefreshSucursales] = useState(false);

  const handleAddSucursal = () => {
    setRefreshSucursales(!refreshSucursales);
  };

  return (
    <Container>
      <h1>Gestión de Sucursales</h1>
      <Row>
        <Col>
          {id ? (
            <SucursalList refresh={refreshSucursales} empresaId={Number(id)} />
          ) : (
            <SucursalList refresh={refreshSucursales} />
          )}
        </Col>
      </Row>
      {id &&(
            <Row>

            
          </Row>
          ) }
      
    </Container>
  );
};

export default SucursalesPage;
