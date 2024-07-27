import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Sucursal } from "../entities/DTO/Sucursal/Sucursal";
import { Empresa } from "../entities/DTO/Empresa/Empresa";
import FormularioDomicilio from "./Domicilio/FormDomicilio";
import SucursalService from "../services/SucursalService";
import ImagenCarousel from "../components/carousel/ImagenCarousel";
import { Imagen } from "../entities/DTO/Imagen";
import { useAuth } from "../Auth/Auth";
import { useNavigate } from "react-router-dom";
import TimePicker from 'react-time-picker';

interface AddSucursalFormProps {
  onAddSucursal: () => void;
  sucursalEditando: Sucursal | null;
  empresa: Empresa;
}

const SucursalForm: React.FC<AddSucursalFormProps> = ({
  onAddSucursal,
  sucursalEditando,
  empresa,
}) => {
  const [sucursal, setSucursal] = useState<Sucursal>(() => {
    if (sucursalEditando) {
      return sucursalEditando;
    }
    let s = new Sucursal();
    s.empresa = empresa;
    return s;
  });
  const [domicilio, setDomicilio] = useState<any>(null); // Estado para el domicilio
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1); // Estado para controlar el paso del formulario
  const [aperturaValida, setAperturaValida] = useState<boolean>(false); // Estado para validar horario de apertura
  const [cierreValido, setCierreValido] = useState<boolean>(false); // Estado para validar horario de cierre

  const { activeSucursal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeSucursal || activeSucursal === "0") {
      navigate("/empresas");
    }
  }, [activeSucursal, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSucursal((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAperturaChange = (time: string | null) => {
    if (time) {
      setSucursal((prevState) => ({
        ...prevState,
        horarioApertura: time,
      }));
      setAperturaValida(true); // Marcar como válida la selección de horario de apertura
    }
  };

  const handleCierreChange = (time: string | null) => {
    if (time) {
      setSucursal((prevState) => ({
        ...prevState,
        horarioCierre: time,
      }));
      setCierreValido(true); // Marcar como válido la selección de horario de cierre
    }
  };

  const handleSubmitStep1 = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (aperturaValida && cierreValido) {
      setCurrentStep(2); // Avanzar al siguiente paso si los horarios son válidos
      setError(null); // Limpiar el mensaje de error
    } else {
      setError("Debe seleccionar un horario de apertura y cierre válidos");
    }
  };

  const handleSubmitStep2 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let response: Sucursal;
      if (sucursalEditando) {
        response = await SucursalService.updateSucursal(sucursalEditando.id, {
          ...sucursal,
          domicilio,
        });
      } else {
        response = await SucursalService.createSucursal({
          ...sucursal,
          domicilio,
        });
      }
      if (response) {
        setSuccess(true);
        setSucursal(new Sucursal()); // Limpiar el formulario después del envío exitoso
        setError(null);
        setDomicilio(null); // Limpiar el domicilio después del envío exitoso
        onAddSucursal();
      }

      if (response.id) {
        onAddSucursal();
      }
    } catch (err) {
      setError("Error al crear o actualizar la sucursal");
      setSuccess(false);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1); // Retroceder al paso anterior
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setSucursal((prev) => ({
      ...prev,
      imagenes: newImages,
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  return (
    <div>
      {currentStep === 1 && (
        <div>
          <h2>{sucursalEditando ? "Editar Sucursal" : "Agregar Sucursal"}</h2>
          <Form onSubmit={handleSubmitStep1}>
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
                clockIcon={null}
                hourPlaceholder="HH"
                minutePlaceholder="MM"
                format="HH:mm"
                value={sucursal.horarioApertura || '00:00'}
                onChange={handleAperturaChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="horarioCierre">
              <Form.Label>Horario Cierre</Form.Label>
              <TimePicker
                clockIcon={null}
                hourPlaceholder="HH"
                minutePlaceholder="MM"
                format="HH:mm"
                value={sucursal.horarioCierre || '00:00'}
                onChange={handleCierreChange}
                required
              />
            </Form.Group>
            <br />
            <ImagenCarousel
              imagenesExistentes={sucursal.imagenes}
              onFilesChange={handleFileChange}
              onImagenesChange={handleImagenesChange}
            />
            <Button variant="primary" type="submit">
              Siguiente
            </Button>
          </Form>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <Form onSubmit={handleSubmitStep2}>
            <FormularioDomicilio
              onBack={handlePrevStep}
              onSubmit={(data) => setDomicilio(data)}
            />
            <Button variant="primary" type="submit">
              Enviar
            </Button>
            <Button variant="secondary" onClick={handlePrevStep}>
              Volver
            </Button>
          </Form>
        </div>
      )}

      {success && (
        <Alert variant="success">
          {sucursalEditando
            ? "Sucursal actualizada con éxito"
            : "Sucursal creada con éxito"}
        </Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default SucursalForm;
