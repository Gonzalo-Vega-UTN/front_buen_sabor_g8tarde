import React, { useState } from "react";
import { Button } from "react-bootstrap";
import ModalConfirm from "../../modals/ModalConfirm";
import { useNavigate } from "react-router-dom";
import { useAuth0Extended } from "../../../Auth/Auth0ProviderWithNavigate";

const BotonLogout: React.FC = () => {
  const { logout } = useAuth0Extended();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Botón de logout presionado");
    setShowModal(true);
    console.log("showModal should be true now:", showModal);
  };

  const handleConfirmLogout = () => {
    console.log("Confirmación de logout");
    logout();
    navigate("/");
    setShowModal(false);
  };

  const handleCancelLogout = () => {
    console.log("Cancelación de logout");
    setShowModal(false);
  };

  return (
    <>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
      <ModalConfirm
        show={showModal}
        title="Confirmar Logout"
        text="¿Estás seguro de que deseas cerrar sesión?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  );
};

export default BotonLogout;
