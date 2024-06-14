import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../Auth/Auth';
import ModalConfirm from '../modals/ModalConfirm';

const BotonLogout: React.FC = () => {
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    console.log("Botón de logout presionado");
    setShowModal(true);
    console.log("showModal should be true now:", showModal);
  };

  const handleConfirmLogout = () => {
    console.log("Confirmación de logout");
    logout();
    setShowModal(false);
  };

  const handleCancelLogout = () => {
    console.log("Cancelación de logout");
    setShowModal(false);
  };

  return (
    <>
      <Button variant="danger" onClick={handleLogout}>Logout</Button>
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
