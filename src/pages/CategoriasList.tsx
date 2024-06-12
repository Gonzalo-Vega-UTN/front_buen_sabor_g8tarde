import React, { useEffect, useState } from 'react';
import { ListGroup, Button, Collapse, Modal, Form } from 'react-bootstrap';
import { Categoria } from '../entities/DTO/Categoria/Categoria';
import { CategoriaService } from '../services/CategoriaService';

export const CategoriasList = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [clickedCategoria, setClickedCategoria] = useState<number>(0);
    const [activeItems, setActiveItems] = useState<number[]>([]);
    const [collapsedItems, setCollapsedItems] = useState<number[]>([]);
    const [modalShow, setModalShow] = useState(false);

    const fetchCategorias = async () => {
        try {
            const categorias = await CategoriaService.obtenerCategoriasPadre();
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
        return categorias.map((categoria, index) => (
            <div key={categoria.id}>
                <ListGroup>
                    <ListGroup.Item
                        className='d-flex justify-content-between me-5'
                        active={activeItems.includes(categoria.id)}
                        onClick={() => handleItemClick(categoria.id)}
                        aria-controls={`subcategoria-collapse-${categoria.id}`}
                        aria-expanded={!collapsedItems.includes(categoria.id)}
                    >
                        <p>{index + 1}</p>
                        <h4>{categoria.denominacion}</h4>
                        <Button onClick={(event) => handleButtonClick(event, categoria.id)}>+</Button>
                    </ListGroup.Item>
                </ListGroup>
                <Collapse in={collapsedItems.includes(categoria.id)}>
                    <ListGroup >
                        {categoria.subCategorias.length > 0 &&
                            <ListGroup.Item className='d-flex flex-direction gap-3'>
                                {renderCategorias(categoria.subCategorias)}
                            </ListGroup.Item>
                        }
                    </ListGroup>
                </Collapse>
            </div>
        ));
    };

    return (
        <>
            <h1>Lista de Categorias</h1>
            <Button className='my-3' onClick={(e) => handleButtonClick(e, 0)}>Crear Categoria</Button>
            {categorias ? renderCategorias(categorias) : <p>No hay categorias</p>}
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    fetchCategorias();
                }}
                idpadre={clickedCategoria}
            />
        </>
    );
};

function MyVerticallyCenteredModal(props) {
    const [error, setError] = useState<string>("");
    const [categoria, setCategoria] = useState<Categoria>(new Categoria());
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log(categoria);

            const data = await CategoriaService.agregarCategoria(props.idpadre, { ...categoria, alta: true });
            props.onHide()
            setCategoria(new Categoria());
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