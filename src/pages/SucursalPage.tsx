import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SucursalList from './SucursalList';

import { useParams } from 'react-router-dom';
import { Empresa } from '../entities/DTO/Empresa/Empresa';
import { EmpresaService } from '../services/EmpresaService';

const SucursalesPage: React.FC = () => {
  const [empresa, setEmpresa] = useState<Empresa>();
  const { id } = useParams<{ id: string }>();
  const [refreshSucursales] = useState(false);

  const fetchEmpresa = async () => {
    if(id){
      try {
        const response = await EmpresaService.getOne(Number(id))
        console.log(response)
        if (!response) {
          throw new Error('Error procesando la solicitud'); //TODO: ARREGLAR
        }
        console.log(response)
        setEmpresa(response);
      } catch (error) {
        console.error('error:', error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmpresa();
    }
  }, [id, refreshSucursales]);
  
  return (
    <Container>
      <h1>Gestión de Sucursales</h1>
      <Row>
        <Col>
          {id ? (
             <SucursalList refresh={refreshSucursales} empresa={empresa} />
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
