import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import { useState } from "react";

interface ModalProps{
    show : boolean
    onHide : () => void;
    idpadre: string;
    activeSucursal : number
}

const CategoriaModal = ( {show, onHide, idpadre, activeSucursal} : ModalProps) =>{

        
    const [error, setError] = useState<string>("");
    const [categoria, setCategoria] = useState<Categoria>(new Categoria());
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log(categoria);

            const data = await CategoriaService.agregarCategoria(Number(idpadre) ,activeSucursal,{ ...categoria, alta: true });
            if (data) {
                onHide()
                setCategoria(new Categoria());
            }

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
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
                    <Form.Group className="mb-3" controlId="imagen">
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control type="tex" placeholder="Ingresar url imagen"
                            onChange={(e) => setCategoria(prev => ({
                                ...prev,
                                imagen: e.target.value
                            }))}
                            value={categoria.imagen} />
                    </Form.Group>
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

export default CategoriaModal;