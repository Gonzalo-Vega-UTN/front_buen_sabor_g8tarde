import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Usuario from '../../entities/DTO/Usuario/Usuario';
import {Cliente} from '../../entities/DTO/Cliente/Cliente';
import UsuarioService from '../../services/UsuarioService';
import ClienteService from '../../services/ClienteService';

interface RegistroUsuarioClienteProps {
  closeModal: () => void;
}

const RegistroUsuarioCliente: React.FC<RegistroUsuarioClienteProps> = ({ closeModal }) => {
  const [step, setStep] = useState(1);
  const [usuarioData, setUsuarioData] = useState<Usuario>(new Usuario());
  const [clienteData, setClienteData] = useState<Cliente>(new Cliente());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChangeUsuario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuarioData({ ...usuarioData, [name]: value });
  };

  const handleChangeCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClienteData({ ...clienteData, [name]: value });
  };

  const handleSubmitUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usuarioData.auth0Id.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      console.log("Validando Usuario");
      const data = await UsuarioService.validarExistenciaUsuario(usuarioData.username);
      if (!data) {
        setError("");
        setTimeout(() => {
          setStep(2);
        }, 1500);
      } else {
        setError("Nombre de usuario ya ocupado");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleSubmitCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    const clienteCompleto = {
      ...clienteData,
      usuario: usuarioData,
    };
    console.log(clienteCompleto);
    try {
      const cliente = await ClienteService.agregarcliente(clienteCompleto);
      if (cliente) {
        setSuccess("Registro Exitoso");
        setTimeout(() => {
          navigate("/");
          closeModal(); // Cerrar el modal después de registrar
        }, 1500);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleBack = () => {
    setStep(1);
    navigate("/"); // Redirigir al usuario a la página principal al volver
  };

  return (
    <Modal show onHide={closeModal}>
      <Modal.Body>
        {step === 1 && (
          <Form onSubmit={handleSubmitUsuario}>
            <Form.Group controlId="formUsername">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={usuarioData.username}
                onChange={handleChangeUsuario}
                placeholder="Ingrese su nombre de usuario"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                name="auth0Id"
                value={usuarioData.auth0Id}
                onChange={handleChangeUsuario}
                placeholder="Ingrese su contraseña"
                required
              />
              <Form.Text className="text-muted">
                La contraseña debe tener al menos 8 caracteres.
              </Form.Text>
              <Button
                variant="outline-secondary"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "Ocultar" : "Mostrar"}
              </Button>
            </Form.Group>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={handleBack}>Volver</Button>
              <Button variant="primary" type="submit">Siguiente</Button>
            </div>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form>
        )}

        {step === 2 && (
          <Form onSubmit={handleSubmitCliente}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={clienteData.nombre}
                onChange={handleChangeCliente}
                placeholder="Ingrese su nombre"
                required
              />
            </Form.Group>
            <Form.Group controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={clienteData.apellido}
                onChange={handleChangeCliente}
                placeholder="Ingrese su apellido"
                required
              />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={clienteData.telefono}
                onChange={handleChangeCliente}
                placeholder="Ingrese su teléfono"
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={clienteData.email}
                onChange={handleChangeCliente}
                placeholder="Ingrese su email"
                required
              />
            </Form.Group>
            <Form.Group controlId="formFechaNacimiento">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={clienteData.fechaNacimiento}
                onChange={handleChangeCliente}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImagen">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                name="imagen"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setClienteData({
                      ...clienteData,
                      imagen: e.target.files[0],
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={() => setStep(1)}>Volver</Button>
              <Button variant="primary" type="submit">Registrar</Button>
            </div>
            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RegistroUsuarioCliente;
