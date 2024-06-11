import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';

const BotonLogin: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const navigate = useNavigate()

  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
  
      setShowLoginModal(false);
     
  }

  const handleRegister = () => {
    navigate("/registro")
    // setShowRegisterModal(true);
  };


  return (
    <>
      <Button variant="primary" className="me-2" onClick={handleLoginModalOpen}>
        Login
      </Button>
      <Button variant="secondary" onClick={handleRegister}>
        Registro
      </Button>
      
      {/* Modal de Login */}
       <Modal show={showLoginModal} onHide={handleLoginModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginPage closeModal={handleLoginModalClose}/>
        </Modal.Body>
      </Modal> 

    </>
  );
};

export default BotonLogin;
