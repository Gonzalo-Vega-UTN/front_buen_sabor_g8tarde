import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import ModalConfirm from '../modals/ModalConfirm';
import { useAuth } from '../../Auth/Auth';

const BotonLogout: React.FC = () => {
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowModal(false);
  };

  const handleCancelLogout = () => {
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
