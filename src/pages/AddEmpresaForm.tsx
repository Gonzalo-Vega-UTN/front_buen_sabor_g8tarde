import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

interface Empresa {
  nombre: string;
  razonsocial: string;
  cuil: number;
}

interface AddEmpresaFormProps {
  onAddEmpresa: () => void;
}

const AddEmpresaForm: React.FC<AddEmpresaFormProps> = ({ onAddEmpresa }) => {
  const [empresa, setEmpresa] = useState<Empresa>({ nombre: '', razonsocial: '', cuil: 0 });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/empresas', empresa);
      setSuccess(true);
      setEmpresa({ nombre: '', razonsocial: '', cuil: 0 });
      setError(null);
      onAddEmpresa();
    } catch (err) {
      setError('Error al crear la empresa');
      setSuccess(false);
    }
  };

  return (
    <div>
      <h2>Agregar Empresa</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={empresa.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="razonsocial">
          <Form.Label>Razón Social</Form.Label>
          <Form.Control
            type="text"
            name="razonsocial"
            value={empresa.razonsocial}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="cuil">
          <Form.Label>CUIL</Form.Label>
          <Form.Control
            type="number"
            name="cuil"
            value={empresa.cuil}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Agregar
        </Button>
      </Form>
      {success && <Alert variant="success">Empresa creada con éxito</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default AddEmpresaForm;
