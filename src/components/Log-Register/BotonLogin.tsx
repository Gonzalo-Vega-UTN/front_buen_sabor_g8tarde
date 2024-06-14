import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Login from './LoginPage';

const BotonLogin: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const navigate = useNavigate()

  const handleLoginModalOpen = () => {
    console.log("Hola Open")
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
  
    console.log("Hola Close")
      setShowLoginModal(false);
     
  }

  const handleRegister = () => {
    navigate("/registro")
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
          <Login closeModal={handleLoginModalClose}/>
        </Modal.Body>
      </Modal> 

    </>
  );
};

export default BotonLogin;
