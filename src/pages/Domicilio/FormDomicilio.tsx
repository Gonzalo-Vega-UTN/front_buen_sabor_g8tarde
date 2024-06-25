import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import DomicilioService from '../../services/DomicilioService';

const FormularioDomicilio = ({ onBack, onSubmit }: { onBack: () => void; onSubmit: (domicilio: any) => void; }) => {
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [provincia, setProvincia] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [cp, setCp] = useState('');

  const fetchProvincias = async () => {
    try {
      const provincias = await DomicilioService.getProvinciasByPais();
      setProvincias(provincias)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log("Error inesperado")
      }
    }
  }
  useEffect(() => {
    fetchProvincias();
  }, []);

  const fetchLocalidades = async (idProvincia: number) => {
    try {
      const localidades = await DomicilioService.getLocalidadesByProvincia(idProvincia);
      setLocalidades(localidades)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log("Error inesperado")
      }
    }
  }

  useEffect(() => {
    if (provincia) {
      fetchLocalidades(Number(provincia));
    }
  }, [provincia]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const domicilio = {
      calle, numero, cp, localidad: {
        id: localidad,
        provincia: {
          id: provincia,
          pais: {
            id: 2
          }
        }

      }
    };
    onSubmit(domicilio);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Detalles del Domicilio</h2>
      <Form.Group controlId="calle">
        <Form.Label>Calle</Form.Label>
        <Form.Control
          type="text"
          value={calle}
          onChange={(e) => setCalle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="numero">
        <Form.Label>Número</Form.Label>
        <Form.Control
          type="number"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="cp">
        <Form.Label>Código Postal</Form.Label>
        <Form.Control
          type="number"
          value={cp}
          onChange={(e) => setCp(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="provincia">
        <Form.Label>Provincia</Form.Label>
        <Form.Control
          as="select"
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
          required
        >
          <option value="">Selecciona una provincia</option>
          {provincias.map((prov: any) => (
            <option key={prov.id} value={prov.id}>{prov.nombre}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="localidad">
        <Form.Label>Localidad</Form.Label>
        <Form.Control
          as="select"
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
          required
        >
          <option value="">Selecciona una localidad</option>
          {localidades.map((loc: any) => (
            <option key={loc.id} value={loc.id}>{loc.nombre}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <div className="d-flex justify-content-between mt-3">
        <Button variant="secondary" onClick={onBack}>
          Volver
        </Button>
        <Button variant="primary" type="submit">
          Completar Registro
        </Button>
      </div>
    </Form>
  );
};

export default FormularioDomicilio;
