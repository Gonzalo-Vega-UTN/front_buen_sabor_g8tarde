import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { EmpresaService } from "../../services/EmpresaService";
import { Empresa } from "../../entities/DTO/Empresa/Empresa";
import ImagenCarousel from "../../components/generic/carousel/ImagenCarousel";
import { Imagen } from "../../entities/DTO/Imagen";

interface AddEmpresaFormProps {
  onAddEmpresa: () => void;
  empresaEditando: Empresa | null;
}

const AddEmpresaForm: React.FC<AddEmpresaFormProps> = ({
  onAddEmpresa,
  empresaEditando,
}) => {
  const [empresa, setEmpresa] = useState<Empresa>(
    !empresaEditando || empresaEditando == null
      ? new Empresa()
      : empresaEditando
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "cuil") {
      // Validamos que el valor sea mayor o igual a cero antes de actualizar
      const newValue = parseInt(value, 10);
      if (!isNaN(newValue) && newValue >= 0) {
        setEmpresa({ ...empresa, [name]: newValue.toString() });
      }
    } else {
      setEmpresa({ ...empresa, [name]: value });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let response: Empresa;
    //quitar blobs
    empresa.imagenes = empresa.imagenes.filter(
      (imagen) => !imagen.url.includes("blob")
    );
    try {
      if (empresaEditando && empresaEditando.id) {
        response = await EmpresaService.update(empresaEditando.id, empresa);
      } else {
        response = await EmpresaService.create(empresa);
      }
      if (response) {
        if (files.length > 0) {
          await EmpresaService.uploadFiles(response.id, files);
        }
        setSuccess(true);
        setEmpresa(new Empresa());
        setError(null);
        onAddEmpresa();
      }

      // Si el artículo se creó o actualizó correctamente, proceder a subir los archivos
      if (response.id) {
        onAddEmpresa();
      }
    } catch (err) {
      setError("Error al crear o actualizar la empresa");
      setSuccess(false);
    }
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setEmpresa((prev) => ({
      ...prev,
      imagenes: newImages,
    }));
  };

  return (
    <div>
      <h2>{empresaEditando ? "Editar Empresa" : "Agregar Empresa"}</h2>
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
            min="0" // Establecemos el mínimo a cero
            required
          />
        </Form.Group>
        <br></br>
        <ImagenCarousel
          imagenesExistentes={empresa.imagenes}
          onFilesChange={handleFileChange}
          onImagenesChange={handleImagenesChange}
        />
        <Button variant="primary" type="submit">
          {empresaEditando ? "Actualizar" : "Agregar"}
        </Button>
      </Form>
      {success && (
        <Alert variant="success">
          {empresaEditando
            ? "Empresa actualizada con éxito"
            : "Empresa creada con éxito"}
        </Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default AddEmpresaForm;
