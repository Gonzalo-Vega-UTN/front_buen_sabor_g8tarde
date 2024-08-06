import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import { SucursalService } from "../../services/SucursalService";
import { Imagen } from "../../entities/DTO/Imagen";
import ImagenCarousel from "../../components/carousel/ImagenCarousel";
import { Sucursal } from "../../entities/DTO/Sucursal/Sucursal";

<<<<<<< Updated upstream
interface ModalProps{
    show : boolean
    onHide : () => void;
    idpadre: string;
    activeSucursal : string
}

const CategoriaModal = ( {show, onHide, idpadre, activeSucursal} : ModalProps) =>{

        
    const [error, setError] = useState<string>("");
    const [categoria, setCategoria] = useState<Categoria>(new Categoria());
    const [files, setFiles] = useState<File[]>([]);
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await CategoriaService.agregarCategoria(Number(idpadre) ,Number(activeSucursal),{ ...categoria, alta: true });
            if (data) {
                onHide()
                setCategoria(new Categoria());
            }
            if(data.id){
                await CategoriaService.uploadFiles(data.id, files)
            }

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    
    const handleImagenesChange = (newImages: Imagen[]) => {
        setCategoria(prev => ({
            ...prev,
            imagenes: newImages
        }));
    };

    const handleFileChange = (newFiles: File[]) => {
        setFiles(newFiles);
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
                    Crear Categoria
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="denominacion">
                        <Form.Label>Denominacion</Form.Label>
                        <Form.Control type="tex" placeholder="Ingresar Denominacion" onChange={(e) => setCategoria(prev => ({
                            ...prev,
                            denominacion: e.target.value
                        }))}
                            value={categoria.denominacion} />
                    </Form.Group>
                   
                    <ImagenCarousel
                                    imagenesExistentes={categoria.imagenes}
                                    onFilesChange={handleFileChange}
                                    onImagenesChange={handleImagenesChange}
                                />
                </Form>
                {error && <p className='text-danger'>{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={onHide}>Close</Button>
                <Button onClick={handleSave}>Crear</Button>
            </Modal.Footer>
        </Modal>
    );
}
=======
interface ModalProps {
  show: boolean;
  onHide: () => void;
  idpadre: number;
  activeSucursal: string;
}

const CategoriaModal = ({ show, onHide, idpadre, activeSucursal }: ModalProps) => {
  const [error, setError] = useState<string>("");
  const [categoria, setCategoria] = useState<Categoria>(new Categoria());
  const [files, setFiles] = useState<File[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const sucursalesData = await SucursalService.fetchSucursalesByEmpresaId(activeSucursal);
        setSucursales(sucursalesData);
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
       
      }
    };

    fetchSucursales();
  }, [activeSucursal]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoriaRequest = {
        categoria: { ...categoria, alta: true },
        sucursalesIds: selectedSucursales
      };
      const data = await CategoriaService.agregarCategoria(idpadre, activeSucursal, categoriaRequest);
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
    setCategoria(prev => ({
      ...prev,
      imagenes: newImages
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSucursalChange = (id: number) => {
    setSelectedSucursales(prev =>
      prev.includes(id)
        ? prev.filter(sucursalId => sucursalId !== id)
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
          Crear Categoria
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="denominacion">
            <Form.Label>Denominacion</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar Denominacion"
              onChange={(e) => setCategoria(prev => ({
                ...prev,
                denominacion: e.target.value
              }))}
              value={categoria.denominacion}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="sucursales">
            <Form.Label>Sucursales</Form.Label>
            {sucursales.map((sucursal) => (
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
        <Button onClick={onHide}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};
>>>>>>> Stashed changes

export default CategoriaModal;