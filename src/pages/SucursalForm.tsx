import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import TimePicker from 'react-bootstrap-time-picker'; // Importamos el componente TimePicker
import { createSucursal, updateSucursal } from '../services/SucursalService';
import { Sucursal } from '../entities/DTO/Sucursal/Sucursal';
import { Empresa } from '../entities/DTO/Empresa/Empresa';

interface AddSucursalFormProps {
  onAddSucursal: () => void;
  sucursalEditando: Sucursal | null;
  empresa: Empresa;
}

const SucursalForm: React.FC<AddSucursalFormProps> = ({ onAddSucursal, sucursalEditando, empresa }) => {
  const [sucursal, setSucursal] = useState<Sucursal>(() => {
    if (sucursalEditando) {
      return sucursalEditando;
    }
    let s = new Sucursal();
    s.empresa = empresa;
    return s;
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSucursal(prevState => ({ ...prevState, [name]: value }));
  };

  // Función para manejar el cambio en el selector de hora de apertura
  const handleAperturaChange = (time: number) => {
    setSucursal(prevState => ({
      ...prevState,
      horarioApertura: convertirHoraATexto(time), // Convertimos el valor de tiempo seleccionado a texto
    }));
  };

  // Función para manejar el cambio en el selector de hora de cierre
  const handleCierreChange = (time: number) => {
    setSucursal(prevState => ({
      ...prevState,
      horarioCierre: convertirHoraATexto(time), // Convertimos el valor de tiempo seleccionado a texto
    }));
  };

  // Función para convertir el tiempo seleccionado en formato de texto (HH:mm)
  const convertirHoraATexto = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (sucursalEditando) {
        await updateSucursal(sucursalEditando.id, sucursal);
      } else {
        await createSucursal(sucursal);
      }
      setSuccess(true);
      let newSucursal = new Sucursal();
      newSucursal.empresa = empresa;
      setSucursal(newSucursal);
      setError(null);
      onAddSucursal(); // Llama a la función para actualizar la lista en SucursalList
    } catch (err) {
      setError('Error al crear o actualizar la sucursal');
      setSuccess(false);
    }
  };

  return (
    <div>
      <h2>{sucursalEditando ? 'Editar Sucursal' : 'Agregar Sucursal'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={sucursal.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="horarioApertura">
          <Form.Label>Horario Apertura</Form.Label>
          <TimePicker
            start="00:00" // Hora de inicio del selector (opcional)
            end="23:59" // Hora de fin del selector (opcional)
            step={15} // Intervalo de tiempo en minutos para las opciones (opcional)
            value={sucursal.horarioApertura ? parseInt(sucursal.horarioApertura.split(':')[0], 10) * 3600 + parseInt(sucursal.horarioApertura.split(':')[1], 10) * 60 : 0} // Valor inicial del selector de tiempo
            onChange={handleAperturaChange} // Función para manejar cambios en el selector de tiempo
            required
          />
        </Form.Group>
        <Form.Group controlId="horarioCierre">
          <Form.Label>Horario Cierre</Form.Label>
          <TimePicker
            start="00:00" // Hora de inicio del selector (opcional)
            end="23:59" // Hora de fin del selector (opcional)
            step={15} // Intervalo de tiempo en minutos para las opciones (opcional)
            value={sucursal.horarioCierre ? parseInt(sucursal.horarioCierre.split(':')[0], 10) * 3600 + parseInt(sucursal.horarioCierre.split(':')[1], 10) * 60 : 0} // Valor inicial del selector de tiempo
            onChange={handleCierreChange} // Función para manejar cambios en el selector de tiempo
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {sucursalEditando ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
      {success && <Alert variant="success">{sucursalEditando ? 'Sucursal actualizada con éxito' : 'Sucursal creada con éxito'}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default SucursalForm;
