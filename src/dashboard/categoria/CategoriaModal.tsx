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
import Alert from "react-bootstrap/Alert";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categoria, setCategoria] = useState<Categoria>(() => {
    return selectedCategoria;
  });
  const [files, setFiles] = useState<File[]>([]);
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>(
    selectedCategoria.sucursales
      ? selectedCategoria.sucursales.map((sucursal: Sucursal) => sucursal.id)
      : []
  );
  const { activeSucursal } = useAuth0Extended();

  const resetForm = () => {
    setCategoria(new Categoria());
    setFiles([]);
    setSelectedSucursales([]);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (!categoria.denominacion?.trim()) {
        throw new Error("La denominación es requerida");
        
      }

      if (selectedSucursales.length === 0) {
        throw new Error("Debe seleccionar al menos una sucursal");
      }

      const categoriaRequest = {
        categoria: { ...categoria, alta: true ,sucursales:selectedCategoria.sucursales},
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
        if (data.id && files.length > 0) {
          await CategoriaService.uploadFiles(data.id, files);
        }
        resetForm();
        onHide();
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error inesperado al guardar la categoría");
      }
      console.error("Error detallado:", error);
    } finally {
      setIsLoading(false);
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
      onHide={() => {
        resetForm();
        onHide();
      }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {editMode ? "Editar Categoría" : "Crear Categoría"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="denominacion">
            <Form.Label>Denominación</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar Denominación"
              onChange={(e) =>
                setCategoria((prev) => ({
                  ...prev,
                  denominacion: e.target.value,
                }))
              }
              value={categoria.denominacion || ""}
              disabled={isLoading}
              required
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
                disabled={isLoading}
              />
            ))}
          </Form.Group>

          <ImagenCarousel
            imagenesExistentes={categoria.imagenes}
            onFilesChange={handleFileChange}
            onImagenesChange={handleImagenesChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => {
            resetForm();
            onHide();
          }}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : (editMode ? "Actualizar" : "Guardar")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoriaModal;