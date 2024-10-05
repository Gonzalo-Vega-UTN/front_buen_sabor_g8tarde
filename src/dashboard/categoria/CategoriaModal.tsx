import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import { Imagen } from "../../entities/DTO/Imagen";
import ImagenCarousel from "../../components/generic/carousel/ImagenCarousel";
import { Sucursal } from "../../entities/DTO/Sucursal/Sucursal";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";

interface ModalProps {
  show: boolean;
  onHide: () => void;
  idpadre: string;
  editMode: boolean;
  selectedCategoria: Categoria;
  sucursales: Sucursal[];
}

const CategoriaModal = ({
  show,
  onHide,
  idpadre,
  editMode,
  selectedCategoria,
  sucursales,
}: ModalProps) => {
  const [error, setError] = useState<string>("");
  const [categoria, setCategoria] = useState<Categoria>(() => {
    return selectedCategoria;
  });
  const [files, setFiles] = useState<File[]>([]);

  const [selectedSucursales, setSelectedSucursales] = useState<number[]>(
    selectedCategoria.sucursales.map((sucursal: Sucursal) => sucursal.id)
  );
  const { activeSucursal } = useAuth0Extended();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoriaRequest = {
        categoria: { ...categoria, alta: true },
        sucursalesIds: selectedSucursales,
      };

      let data;
      if (editMode) {
        data = await CategoriaService.actualizarCategoria(
          categoria.id,
          categoriaRequest
        );
      } else {
        const idPadreAsNumber = Number(idpadre);
        data = await CategoriaService.agregarCategoria(
          idPadreAsNumber,
          activeSucursal,
          categoriaRequest
        );
      }

      if (data) {
        onHide();
        setCategoria(new Categoria());
        if (data.id) {
          await CategoriaService.uploadFiles(data.id, files);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setCategoria((prev) => ({
      ...prev,
      imagenes: newImages,
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSucursalChange = (id: number) => {
    setSelectedSucursales((prev) =>
      prev.includes(id)
        ? prev.filter((sucursalId) => sucursalId !== id)
        : [...prev, id]
    );
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {editMode ? "Editar Categoria" : "Crear Categoria"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="denominacion">
            <Form.Label>Denominacion</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar Denominacion"
              onChange={(e) =>
                setCategoria((prev) => ({
                  ...prev,
                  denominacion: e.target.value,
                }))
              }
              value={categoria.denominacion}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="sucursales">
            <Form.Label>Sucursales</Form.Label>
            {sucursales.map((sucursal: Sucursal) => (
              <Form.Check
                key={sucursal.id}
                type="checkbox"
                label={sucursal.nombre}
                checked={selectedSucursales.includes(sucursal.id)}
                onChange={() => handleSucursalChange(sucursal.id)}
              />
            ))}
          </Form.Group>

          <ImagenCarousel
            imagenesExistentes={categoria.imagenes}
            onFilesChange={handleFileChange}
            onImagenesChange={handleImagenesChange}
          />

          {error && <p className="text-danger">{error}</p>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          {editMode ? "Actualizar" : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoriaModal;
