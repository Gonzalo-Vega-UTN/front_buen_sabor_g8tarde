import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import SucursalList from "./SucursalList";
import SucursalForm from "./SucursalForm";
import { useNavigate } from "react-router-dom";
import { Empresa } from "../../entities/DTO/Empresa/Empresa";
import { EmpresaService } from "../../services/EmpresaService";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";

const SucursalesPage: React.FC = () => {
  const [empresa, setEmpresa] = useState<Empresa | undefined>();
  const [refreshSucursales, setRefreshSucursales] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { activeEmpresa } = useAuth0Extended();
  const navigate = useNavigate();
  const fetchEmpresa = useCallback(async () => {
    console.log(activeEmpresa)
    if (activeEmpresa) {
      try {
        const response = await EmpresaService.getOne(Number(activeEmpresa));
        if (response) {
          setEmpresa(response);
        }
      } catch (error) {
        console.error("Error al obtener la empresa activa:", error);
      }
    } else {
      navigate("/empresas");
    }
  }, [activeEmpresa]);

  useEffect(() => {
    fetchEmpresa();
  }, [fetchEmpresa]);

  useEffect(() => {
    const storedEmpresa = localStorage.getItem("currentEmpresa");
    if (storedEmpresa) {
      setEmpresa(JSON.parse(storedEmpresa));
    }
  }, []);

  const handleAddSucursal = () => {
    if (empresa) {
      setShowModal(true);
    } else {
      console.error(
        "No se puede agregar una sucursal sin una empresa seleccionada"
      );
      // Aquí podrías mostrar un mensaje al usuario
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRefreshSucursales((prev) => !prev);
  };

  return (
    <Container>
      <h1>Gestión de Sucursales</h1>
      <Row>
        <Col>
          <SucursalList
            refresh={refreshSucursales}
            empresa={empresa}
            onAddSucursal={handleAddSucursal}
          />
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Sucursal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {empresa ? (
            <SucursalForm
              onAddSucursal={handleCloseModal}
              sucursalEditando={null}
              empresa={empresa}
            />
          ) : (
            <p>Cargando información de la empresa...</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SucursalesPage;
