import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

interface Empresa {
  id?: number; // ID opcional porque no se necesita al crear una nueva empresa
  nombre: string;
  razonSocial: string;
  cuil: string;
}

interface AddEmpresaFormProps {
  onAddEmpresa: () => void;
  empresaEditando: Empresa | null;
}

const AddEmpresaForm: React.FC<AddEmpresaFormProps> = ({ onAddEmpresa, empresaEditando }) => {
  const [empresa, setEmpresa] = useState<Empresa>({ nombre: '', razonSocial: '', cuil: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (empresaEditando) {
      setEmpresa(empresaEditando);
    }
  }, [empresaEditando]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (empresaEditando) {
        await axios.put(`http://localhost:8080/api/empresas/${empresaEditando.id}`, empresa);
      } else {
        await axios.post('http://localhost:8080/api/empresas', empresa);
      }
      setSuccess(true);
      setEmpresa({ nombre: '', razonSocial: '', cuil: '' });
      setError(null);
      onAddEmpresa();
    } catch (err) {
      setError('Error al crear o actualizar la empresa');
      setSuccess(false);
    }
  };

  return (
    <div>
      <h2>{empresaEditando ? 'Editar Empresa' : 'Agregar Empresa'}</h2>
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
        <Form.Group controlId="razonSocial">
          <Form.Label>Razón Social</Form.Label>
          <Form.Control
            type="text"
            name="razonSocial"
            value={empresa.razonSocial}
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
          {empresaEditando ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
      {success && <Alert variant="success">{empresaEditando ? 'Empresa actualizada con éxito' : 'Empresa creada con éxito'}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default AddEmpresaForm;
