import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DomicilioService from '../../services/DomicilioService';
import ClienteService from '../../services/ClienteService'; // Importa tu servicio de cliente
import { Domicilio } from '../../entities/DTO/Domicilio/Domicilio'; // Asegúrate de importar la entidad Domicilio correcta

const ModalDomicilios = ({ show, onHide, onSelectDomicilio }) => {
  const [domicilios, setDomicilios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [cp, setCp] = useState('');
  const [provincia, setProvincia] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState(null); // Estado para almacenar el cliente activo

  useEffect(() => {
    if (show) {
      fetchClienteActivo(); // Al mostrar el modal, cargar el cliente activo
      fetchDomicilios(); // También cargar los domicilios del cliente activo
    }
  }, [show]);

  const fetchClienteActivo = async () => {
    try {
      // Lógica para obtener el cliente activo desde tu servicio o contexto de autenticación
      // Aquí estoy asumiendo que tienes una función para obtener el cliente activo
      const clienteActivo = await ClienteService.obtenerClienteActivo(); // Implementa esta función en ClienteService
      setCliente(clienteActivo);
    } catch (error) {
      console.error('Error fetching active client:', error);
    }
  };

  const fetchDomicilios = async () => {
    try {
      if (cliente) {
        const data = await DomicilioService.getDomicilioById(cliente.id); // Obtener domicilios por el id del cliente
        setDomicilios(data);
      }
    } catch (error) {
      console.error('Error fetching domicilios:', error);
    }
  };

  const handleSubmitNuevoDomicilio = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nuevoDomicilio = {
        calle,
        numero,
        cp,
        provincia,
        localidad,
        clienteId: cliente.id, // Incluir el id del cliente activo en el nuevo domicilio
      };
      await DomicilioService.saveDomicilio(nuevoDomicilio); // Método para guardar domicilio del cliente
      await fetchDomicilios();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating domicilio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDomicilio = (domicilioId) => {
    onSelectDomicilio(domicilioId);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Domicilio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Domicilios Registrados:</h5>
        {domicilios.map((domicilio) => (
          <div key={domicilio.id}>
            <p>{domicilio.calle} {domicilio.numero}, {domicilio.cp}, {domicilio.localidad.nombre}, {domicilio.provincia.nombre}</p>
            <Button variant="primary" onClick={() => handleSelectDomicilio(domicilio.id)}>Seleccionar</Button>
          </div>
        ))}
        <hr />
        <Button variant="secondary" onClick={() => setShowForm(!showForm)}>Agregar Nuevo Domicilio</Button>
        {showForm && (
          <Form onSubmit={handleSubmitNuevoDomicilio}>
            <Form.Group controlId="calle">
              <Form.Label>Calle</Form.Label>
              <Form.Control type="text" value={calle} onChange={(e) => setCalle(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="numero">
              <Form.Label>Número</Form.Label>
              <Form.Control type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="cp">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control type="text" value={cp} onChange={(e) => setCp(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="provincia">
              <Form.Label>Provincia</Form.Label>
              <Form.Control type="text" value={provincia} onChange={(e) => setProvincia(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="localidad">
              <Form.Label>Localidad</Form.Label>
              <Form.Control type="text" value={localidad} onChange={(e) => setLocalidad(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Nuevo Domicilio'}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalDomicilios;
