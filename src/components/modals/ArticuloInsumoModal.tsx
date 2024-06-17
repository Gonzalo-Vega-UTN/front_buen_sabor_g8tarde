import { useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { UnidadMedida } from "../../entities/DTO/UnidadMedida/UnidadMedida";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import ImagenCarousel from "../carousel/ImagenCarousel";

interface ArticuloInsumoModalProps {
    articulo: ArticuloInsumo | undefined;
    modalType: ModalType;
    titulo: string
    unidadesMedida: UnidadMedida[];
    categorias: Categoria[]
    onHide: () => void;
    handleSubmit: (art: ArticuloInsumo, file: File) => void;
    handleDelete: (idArt: number) => void;
};

const ArticuloInsumoModal = ({ onHide, modalType, articulo, titulo, handleSubmit, handleDelete, unidadesMedida, categorias }: ArticuloInsumoModalProps) => {

    const [articuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>(articulo ? articulo : new ArticuloInsumo());
    const [error, setError] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);


    const handleChange = (name: string, value: number | string) => {
        if (name === 'categoria') {
            const categoriaSeleccionada = categorias.find(c => c.id === parseInt(value.toString()));
            setArticuloInsumo(prev => ({
                ...prev,
                categoria: categoriaSeleccionada || null,
            }));
        } else if (name === 'unidadMedida') {
            const unidadSeleccionada = unidadesMedida.find(um => um.id === parseInt(value.toString()));
            setArticuloInsumo(prev => ({
                ...prev,
                unidadMedida: unidadSeleccionada || null,
            }));
        } else {
            setArticuloInsumo(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };
    const validarFormulario = (): boolean => {
        if (!articuloInsumo.denominacion || !articuloInsumo.denominacion.trim()) {
            setError('La denominación es obligatoria.');
            return false;
        }
        if (articuloInsumo.unidadMedida === null) {
            setError('La unidad de medida es obligatoria.');
            return false;
        }
        if (articuloInsumo.categoria === null) {
            setError('La categoría es obligatoria.');
            return false;
        }
        if (articuloInsumo.precioCompra <= 0) {
            setError('El precio de compra no puede ser 0 o negativo.');
            return false;
        }
        if (articuloInsumo.precioVenta < 0) {
            setError('El precio de venta debe ser mayor o igual que 0.');
            return false;
        }
        if (articuloInsumo.stockActual < 0) {
            setError('El stock actual no puede ser negativo.');
            return false;
        }
        if (articuloInsumo.stockMaximo < 0) {
            setError('El stock máximo no puede ser negativo.');
            return false;
        }

        setError('');
        return true;
    };

    return (
        <>
            {modalType === ModalType.DELETE ? (
                <>
                    <Modal show={true} onHide={onHide} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>{titulo}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>¿Está seguro de que desea dar de  {articuloInsumo.alta ? "baja" : "alta"} el ingrediente?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Cancelar
                            </Button>
                            {loading ? (
                                <Button variant={articuloInsumo.alta ? "danger" : "success"} disabled>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />  {articuloInsumo.alta ? "Dando de Baja..." : "Dando de Alta.."}
                                </Button>
                            ) : (
                                <Button variant={articuloInsumo.alta ? "danger" : "success"} onClick={() => {
                                    setLoading(true); // Activar indicador de carga
                                    // Agregar un pequeño retraso antes de procesar la eliminación
                                    setTimeout(async () => {
                                        await handleDelete(articuloInsumo.id);
                                        onHide(); // Ocultar el modal después de eliminar
                                    }, 1000); // 1000 milisegundos (1 segundo) de retraso
                                }}>
                                    {articuloInsumo.alta ? "Dar de Baja" : "Dar de Alta"}
                                </Button>
                            )}
                        </Modal.Footer>
                    </Modal>

                </>
            ) : (
                <>
                    <p></p>
                    <Modal
                        show={true}
                        onHide={onHide}
                        centered
                        backdrop="static"
                        className="modal-xl"
                    >
                        <Modal.Header>
                            <Modal.Title>{titulo}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form autoComplete="off" onSubmit={(e) => {
                                e.preventDefault();
                                if (articuloInsumo && validarFormulario() && file != null) {
                                    handleSubmit(articuloInsumo, file)
                                }
                            }}>
                                <Row>
                                    <Form.Group as={Col} controlId="formDenominacion">
                                        <Form.Label>denominacion</Form.Label>
                                        <Form.Control
                                            name="denominacion"
                                            type="text"
                                            value={articuloInsumo?.denominacion}
                                            onChange={({ target: { name, value } }) => handleChange(name, value)}
                                            placeholder="Harina.."
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formUnidadMedida">
                                        <Form.Label>Unidad de Medida</Form.Label>
                                        <Form.Select
                                            name="unidadMedida"
                                            value={articuloInsumo?.unidadMedida?.id}
                                            onChange={({ target: { name, value } }) => handleChange(name, value)}
                                        >
                                            <option value="0">Selecciona una unidad de Medida</option>
                                            {unidadesMedida.map((unidad) => (
                                                <option key={unidad.id} value={unidad.id}>
                                                    {unidad.denominacion}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formCategoria">
                                        <Form.Label>Categoria</Form.Label>
                                        <Form.Select
                                            name="categoria"
                                            value={articuloInsumo?.categoria?.id}
                                            onChange={({ target: { name, value } }) => handleChange(name, value)}
                                        >
                                            <option value="0">Selecciona una Categoria</option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id} value={categoria.id}>
                                                    {categoria.denominacion}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Row>

                                <Row>
                                    <Form.Group as={Col} controlId="formPrecioCompra">
                                        <Form.Label>Precio de Compra</Form.Label>
                                        <Form.Control
                                            name="precioCompra"
                                            type="number"
                                            value={articuloInsumo?.precioCompra}
                                            onChange={({ target: { name, value } }) => handleChange(name, Number(value))}
                                            min={0}

                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formPrecioVenta">
                                        <Form.Label>Precio de Venta</Form.Label>
                                        <Form.Control
                                            name="precioVenta"
                                            type="number"
                                            value={articuloInsumo?.precioVenta}
                                            onChange={({ target: { name, value } }) => handleChange(name, Number(value))}
                                            min={0}

                                        />
                                    </Form.Group>
                                </Row>


                                <Row>
                                    <Form.Group as={Col} controlId="formStockActual">
                                        <Form.Label>Stock Actual</Form.Label>
                                        <Form.Control
                                            name="stockActual"
                                            type="number"
                                            value={String(articuloInsumo?.stockActual)}
                                            onChange={({ target: { name, value } }) => handleChange(name, Number(value))}
                                            min={0}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formStockMinimo">
                                        <Form.Label>Stock Máximo</Form.Label>
                                        <Form.Control
                                            name="stockMaximo"
                                            type="number"
                                            value={String(articuloInsumo?.stockMaximo)}
                                            onChange={({ target: { name, value } }) => handleChange(name, Number(value))}
                                            min={0}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <ImagenCarousel imagenesGuardadas={articuloInsumo.imagenes}></ImagenCarousel>
                                    <Form.Group as={Col} controlId="formImagenes">
                                       
                                      
                                    </Form.Group>
                                </Row>
                                {error && <h5 className="text-danger my-2">{error}</h5>}

                                <Modal.Footer>
                                    <Button variant="secondary" onClick={onHide}>
                                        Cancelar
                                    </Button>
                                    {loading ? (
                                        <Button variant="primary" disabled>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />  Guardando...
                                        </Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => {
                                            if (articuloInsumo && validarFormulario()) {
                                                if (file != null) {

                                                    setLoading(true); // Activar indicador de carga
                                                    // Agregar un pequeño retraso antes de procesar la eliminación
                                                    setTimeout(async () => {
                                                        await handleSubmit(articuloInsumo, file);
                                                        onHide(); // Ocultar el modal después de eliminar
                                                    }, 1000); // 1000 milisegundos (1 segundo) de retraso
                                                }
                                            }
                                        }}>
                                            Guardar
                                        </Button>
                                    )}
                                </Modal.Footer>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </>
    );
}
export default ArticuloInsumoModal;