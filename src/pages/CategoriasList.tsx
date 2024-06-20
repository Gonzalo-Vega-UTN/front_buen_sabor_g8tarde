import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Button, Collapse, Modal, Form, ModalProps } from 'react-bootstrap';
import { Categoria } from '../entities/DTO/Categoria/Categoria';
import { CategoriaService } from '../services/CategoriaService';
import { BsFillPencilFill, BsPlusCircleFill } from 'react-icons/bs';
import GenericButton from '../components/generic/GenericButton';
import { Omit, BsPrefixProps } from 'react-bootstrap/esm/helpers';
import { JSX } from 'react/jsx-runtime';

export const CategoriasList = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [clickedCategoria, setClickedCategoria] = useState<number>(0);
    const [activeItems, setActiveItems] = useState<number[]>([]);
    const [collapsedItems, setCollapsedItems] = useState<number[]>([]);
    const [modalShow, setModalShow] = useState(false);

    const fetchCategorias = async () => {
        try {
            const categorias = await CategoriaService.obtenerCategoriasPadre();
            console.log(categorias)
            setCategorias(categorias);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleItemClick = (id: number) => {
        const index = activeItems.indexOf(id);
        if (index !== -1) {
            setActiveItems(activeItems.filter(item => item !== id));
        } else {
            setActiveItems([...activeItems, id]);
        }

        const collapsedIndex = collapsedItems.indexOf(id);
        if (collapsedIndex !== -1) {
            setCollapsedItems(collapsedItems.filter(item => item !== id));
        } else {
            setCollapsedItems([...collapsedItems, id]);
        }
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, idPadre: number) => {
        event.stopPropagation();
        setClickedCategoria(idPadre);
        setModalShow(true);
    };

    const renderCategorias = (categorias: Categoria[]) => {
        return categorias.map((categoria, index) => {
            const baja = categoria.alta ? 'text=primary text-opacity-25' : ""
            return <div key={categoria.id} className="w-100">
                <ListGroup>
                    <ListGroup.Item
                        className={'d-flex justify-content-between me-5' + baja}
                        active={activeItems.includes(categoria.id)}
                        onClick={() => handleItemClick(categoria.id)}
                        aria-controls={`subcategoria-collapse-${categoria.id}`}
                        aria-expanded={!collapsedItems.includes(categoria.id)}
                    >
                        <p>{index + 1}</p>
                        <h4>{categoria.denominacion}</h4>
                        <div className='d-flex gap-3'>
                            <GenericButton
                                color="#FBC02D"
                                size={20}
                                icon={BsFillPencilFill}
                                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => console.log("EDITAR")}
                            />
                            <GenericButton
                                color="#0080FF"
                                size={20}
                                icon={BsPlusCircleFill}
                                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleButtonClick(e, categoria.id)}
                            />
                        </div>
                    </ListGroup.Item>
                </ListGroup>
                <Collapse in={collapsedItems.includes(categoria.id)}>
                    <ListGroup>
                        {categoria.subCategorias.length > 0 &&
                            <ListGroup.Item className=''>
                                {renderCategorias(categoria.subCategorias)}
                            </ListGroup.Item>
                        }
                    </ListGroup>
                </Collapse>
            </div>

        })
    };

    return (
        <Container className="text-center">
            <h1>Lista de Categorias</h1>
            <div className="d-flex justify-content-center my-3">
                <Button onClick={(e) => handleButtonClick(e, 0)}>Crear Categoria</Button>
            </div>
            {categorias ? renderCategorias(categorias) : <p>No hay categorias</p>}
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    fetchCategorias();
                }}
                idpadre={clickedCategoria}
            />
        </Container>
    );
};

function MyVerticallyCenteredModal(props: JSX.IntrinsicAttributes & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & { ref?: ((instance: HTMLDivElement | null) => void | React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[keyof React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES]) | React.RefObject<HTMLDivElement> | null | undefined; }, BsPrefixProps<"div"> & ModalProps> & BsPrefixProps<"div"> & ModalProps & { children?: React.ReactNode | undefined; }) {
    const [error, setError] = useState<string>("");
    const [categoria, setCategoria] = useState<Categoria>(new Categoria());
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log(categoria);

            const data = await CategoriaService.agregarCategoria(props.idpadre, { ...categoria, alta: true });
            if (data) {
                props.onHide()
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
            {...props}
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
                <Button variant='secondary' onClick={props.onHide}>Close</Button>
                <Button onClick={handleSave}>Crear</Button>
            </Modal.Footer>
        </Modal>
    );
}
