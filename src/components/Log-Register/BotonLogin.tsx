import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from './LoginPage';

const BotonLogin: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleRegister = () => {
    navigate("/registro");
  };

  // Mostrar el botón solo en la página principal
  const showButton = location.pathname === "/";

  return (
    <>
      {showButton && (
        <>
          <Button variant="primary" className="me-2" onClick={handleLoginModalOpen}>
            Login
          </Button>
          <Button variant="secondary" onClick={handleRegister}>
            Registro
          </Button>
        </>
      )}

      {/* Modal de Login */}
      <Modal show={showLoginModal} onHide={handleLoginModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login closeModal={handleLoginModalClose} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BotonLogin;
