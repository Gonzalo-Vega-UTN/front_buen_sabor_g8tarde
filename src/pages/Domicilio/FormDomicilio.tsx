import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import DomicilioService from '../../services/DomicilioService';

interface FormularioDomicilioProps {
  onBack: () => void;
  onSubmit: (domicilio: any) => void;
}

const FormularioDomicilio: React.FC<FormularioDomicilioProps> = ({ onBack, onSubmit }) => {
  const [provincias, setProvincias] = useState<any[]>([]);
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [provincia, setProvincia] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [cp, setCp] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProvincias = async () => {
    try {
      const provincias = await DomicilioService.getProvinciasByPais();
      setProvincias(provincias);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Error inesperado");
      }
    }
  };

  useEffect(() => {
    fetchProvincias();
  }, []);

  const fetchLocalidades = async (idProvincia: number) => {
    try {
      const localidades = await DomicilioService.getLocalidadesByProvincia(idProvincia);
      setLocalidades(localidades);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Error inesperado");
      }
    }
  };

  useEffect(() => {
    if (provincia) {
      fetchLocalidades(Number(provincia));
    }
  }, [provincia]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const domicilio = {
      calle,
      numero,
      cp,
      localidad: {
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
    setLoading(false);
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
          {provincias.map((prov) => (
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
          {localidades.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.nombre}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Button variant="secondary" onClick={onBack}>
        Volver
      </Button>
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Guardar"}
      </Button>
    </Form>
  );
};

export default FormularioDomicilio;
