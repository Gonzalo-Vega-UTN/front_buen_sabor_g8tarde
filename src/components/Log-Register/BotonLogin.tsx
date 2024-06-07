import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';

const BotonLogin: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  

  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  }

  const handleRegisterModalOpen = () => {
    setShowRegisterModal(true);
  };

  const handleRegisterModalClose = () => {
    setShowRegisterModal(false);
  };

  return (
    <>
      <Button variant="primary" className="me-2" onClick={handleLoginModalOpen}>
        Login
      </Button>
      <Button variant="secondary" onClick={handleRegisterModalOpen}>
        Registro
      </Button>
      
      {/* Modal de Login */}
      <Modal show={showLoginModal} onHide={handleLoginModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login closeModal={handleLoginModalClose}/>
        </Modal.Body>
      </Modal>

      {/* Modal de Registro */}
      <Modal show={showRegisterModal} onHide={handleRegisterModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Register closeModal={handleRegisterModalClose}/>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BotonLogin;
