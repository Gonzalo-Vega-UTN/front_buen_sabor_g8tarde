import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EmpresaList from './EmpresaList';
import AddEmpresaForm from './AddEmpresaForm';

const EmpresasPage: React.FC = () => {
  const [refreshEmpresas, setRefreshEmpresas] = useState(false);

  const handleAddEmpresa = () => {
    setRefreshEmpresas(!refreshEmpresas);
  };

  return (
    <Container>
      <h1>Gestión de Empresas</h1>
      <Row>
        <Col>
          <EmpresaList refresh={refreshEmpresas} />
        </Col>
      </Row>
      <Row>
        <Col>
          <AddEmpresaForm onAddEmpresa={handleAddEmpresa} />
        </Col>
      </Row>
    </Container>
  );
};

export default EmpresasPage;
