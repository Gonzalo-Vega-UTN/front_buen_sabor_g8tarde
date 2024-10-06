import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import SucursalList from "./SucursalList";
import SucursalForm from "./SucursalForm";
import { useParams } from "react-router-dom";
import { Empresa } from "../../entities/DTO/Empresa/Empresa";
import { EmpresaService } from "../../services/EmpresaService";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";

const SucursalesPage: React.FC = () => {
  const [empresa, setEmpresa] = useState<Empresa | undefined>();
  const { id } = useParams<{ id: string }>();
  const [refreshSucursales, setRefreshSucursales] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { activeEmpresa } = useAuth0Extended();

  const fetchEmpresa = useCallback(async () => {
    if (id) {
      try {
        const response = await EmpresaService.getOne(Number(id));
        if (!response) {
          throw new Error("Error procesando la solicitud");
        }
        setEmpresa(response);
        localStorage.setItem("currentEmpresa", JSON.stringify(response));
      } catch (error) {
        console.error("error:", error);
      }
    } else if (activeEmpresa) {
      if (typeof activeEmpresa === "string") {
        // Si activeEmpresa es un string (ID), obtener la empresa completa
        try {
          const response = await EmpresaService.getOne(Number(activeEmpresa));
          if (response) {
            setEmpresa(response);
            localStorage.setItem("currentEmpresa", JSON.stringify(response));
          }
        } catch (error) {
          console.error("Error al obtener la empresa activa:", error);
        }
      } else {
        setEmpresa(activeEmpresa);
        localStorage.setItem("currentEmpresa", JSON.stringify(activeEmpresa));
      }
    }
  }, [id, activeEmpresa]);

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
