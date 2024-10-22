import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import SucursalList from "./SucursalList";
import { useNavigate } from "react-router-dom";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import { SucursalFormModal } from "./SucursalFormModal";
import { Sucursal } from "../../entities/DTO/Sucursal/Sucursal";
import SucursalService from "../../services/SucursalService";

const SucursalesPage: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [currentSucursal, setCurrentSucursal] = useState<Sucursal>(
    new Sucursal()
  );
  const [showFormModal, setShowFormModal] = useState(false);
  const { activeEmpresa } = useAuth0Extended();
  const navigate = useNavigate();

  if (!activeEmpresa) {
    navigate("/empresas");
  }

  const getSucursales = async () => {
    try {
      const data = await SucursalService.fetchSucursalesByActiveEmpresa(
        Number(activeEmpresa)
      );
      setSucursales(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getSucursales();
  }, [activeEmpresa]);

  const handleSubmit = async (sucursal: Sucursal, files: File[]) => {
    try {
      //quitar blobs
      sucursal.imagenes = sucursal.imagenes.filter(
        (imagen) => !imagen.url.includes("blob")
      );
      let response: Sucursal;
      if (sucursal.id !== 0) {
        response = await SucursalService.update(sucursal.id, sucursal);
      } else {
        response = await SucursalService.create(activeEmpresa, sucursal);
      }
      if (response && files.length > 0) {
        const responseImagenes = await SucursalService.uploadFiles(
          response.id,
          files
        );
        console.log(responseImagenes);
        if (responseImagenes) {
          response.imagenes = responseImagenes;
        }
      }
      console.log(response);
      setSucursales((prev) => {
        if (prev.some((s) => s.id === response.id)) {
          return prev.map((s) => (s.id === response.id ? response : s));
        } else {
          return [...prev, response];
        }
      });
      getSucursales();
    } catch (error) {
      console.error("Error guardando la sucursal:", error);
      throw error; // Importante: para que la promesa sea rechazada si hay un error
    }
  };

  const handleClickModal = (sucursal: Sucursal) => {
    setShowFormModal(true);
    setCurrentSucursal(sucursal);
  };

  const handleStatusChange = async (sucursalId: number, activo: boolean) => {
    try {
      const sucursalIndex = sucursales.findIndex(
        (suc) => suc.id === sucursalId
      );
      if (sucursalIndex !== -1) {
        await SucursalService.bajaSucursal(
          sucursales[sucursalIndex].id,
          activo
        );
        const updatedSucursales = [...sucursales];
        updatedSucursales[sucursalIndex] = {
          ...sucursales[sucursalIndex],
          alta: activo,
        };
        setSucursales(updatedSucursales);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Container>
        <h1>Gestión de Sucursales</h1>
        <Button onClick={() => handleClickModal(new Sucursal())}>
          Agregar Sucursal
        </Button>
        <Row className="my-3">
          <Col>
            <SucursalList
              sucursales={sucursales}
              handleSubmit={handleSubmit}
              handleClickModal={handleClickModal}
              onHide={() => setShowFormModal(true)}
              handleStatusChange={handleStatusChange}
            />
          </Col>
        </Row>
      </Container>
      {showFormModal && (
        <SucursalFormModal
          sucursal={currentSucursal}
          handleSubmit={handleSubmit}
          onHide={() => setShowFormModal(false)}
        />
      )}
    </>
  );
};

export default SucursalesPage;
