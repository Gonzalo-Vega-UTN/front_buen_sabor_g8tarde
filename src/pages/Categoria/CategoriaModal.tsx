import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import { useState } from "react";
import { Imagen } from "../../entities/DTO/Imagen";
import ImagenCarousel from "../../components/carousel/ImagenCarousel";

interface ModalProps {
    show: boolean;
    onHide: () => void;
    idpadre: number; // Cambia idpadre a number
    activeSucursal: string; // Mantén activeSucursal como string
}

const CategoriaModal = ({ show, onHide, idpadre, activeSucursal }: ModalProps) => {
    const [error, setError] = useState<string>("");
    const [categoria, setCategoria] = useState<Categoria>(new Categoria());
    const [files, setFiles] = useState<File[]>([]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Usa idpadre como número, no es necesario convertirlo
            const data = await CategoriaService.agregarCategoria(idpadre, activeSucursal, { ...categoria, alta: true });
            if (data) {
                onHide();
                setCategoria(new Categoria());
            }
            if (data.id) {
                await CategoriaService.uploadFiles(data.id, files);
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
                            type="text" // Corrige "tex" a "text"
                            placeholder="Ingresar Denominacion"
                            onChange={(e) => setCategoria(prev => ({
                                ...prev,
                                denominacion: e.target.value
                            }))}
                            value={categoria.denominacion}
                        />
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
};

export default CategoriaModal;
