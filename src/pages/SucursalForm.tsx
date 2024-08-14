import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Sucursal } from "../entities/DTO/Sucursal/Sucursal";
import { Empresa } from "../entities/DTO/Empresa/Empresa";
import FormularioDomicilio from "./Domicilio/FormDomicilio";
import SucursalService from "../services/SucursalService";
import ImagenCarousel from "../components/carousel/ImagenCarousel";
import { Imagen } from "../entities/DTO/Imagen";

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
  const [domicilio, setDomicilio] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    if (domicilio !== null) {
      handleSubmitStep2(); // Llama a la función sin pasar un evento
    }
  }, [domicilio]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSucursal((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmitStep1 = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sucursal.horarioApertura && sucursal.horarioCierre) {
      setCurrentStep(2);
      setError(null);
    } else {
      setError("Debe seleccionar un horario de apertura y cierre válidos");
    }
  };

  const handleSubmitStep2 = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
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
        setSucursal(new Sucursal());
        setError(null);
        setDomicilio(null);
        onAddSucursal();
      }
    } catch (err) {
      setError("Error al crear o actualizar la sucursal");
      setSuccess(false);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
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

  const handleDomicilioSubmit = (data: any) => {
    setDomicilio(data);
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
              <Form.Control
                type="time"
                name="horarioApertura"
                value={sucursal.horarioApertura || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="horarioCierre">
              <Form.Label>Horario Cierre</Form.Label>
              <Form.Control
                type="time"
                name="horarioCierre"
                value={sucursal.horarioCierre || ""}
                onChange={handleChange}
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
          <FormularioDomicilio
            onBack={handlePrevStep}
            onSubmit={handleDomicilioSubmit}
            initialDomicilio={sucursal.domicilio}
            showButtons={true}
          />
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
