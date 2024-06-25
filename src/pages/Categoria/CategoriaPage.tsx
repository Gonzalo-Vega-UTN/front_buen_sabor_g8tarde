import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Button, Collapse, Modal, Form } from 'react-bootstrap';
import { Categoria } from '../../entities/DTO/Categoria/Categoria';
import { CategoriaService } from '../../services/CategoriaService';
import { BsPlusCircleFill, BsTrash, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import GenericButton from '../../components/generic/GenericButton';
import { useAuth } from '../../Auth/Auth';
import CategoriaModal from './CategoriaModal';

export const CategoriaPage = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [clickedCategoria, setClickedCategoria] = useState<number>(0);
    const [activeItems, setActiveItems] = useState<number[]>([]);
    const [collapsedItems, setCollapsedItems] = useState<number[]>([]);
    const [modalShow, setModalShow] = useState(false);
    const { activeSucursal } = useAuth();

    const fetchCategorias = async () => {
        try {
            const categorias = await CategoriaService.obtenerCategoriasPadre(activeSucursal);
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

    const handleButtonClickDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        event.stopPropagation();
        await CategoriaService.eliminarCategoriaById(activeSucursal, id);
        fetchCategorias();
    }

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, idPadre: number) => {
        event.stopPropagation();
        setClickedCategoria(idPadre);
        setModalShow(true);
    };

    const renderCategorias = (categorias: Categoria[]) => {
        return categorias.map((categoria) => {
            const isCollapsed = collapsedItems.includes(categoria.id);
            return (
                <div key={categoria.id} className="w-100 mb-2">
                    <ListGroup>
                        <ListGroup.Item
                            className={'d-flex justify-content-between align-items-center' + (categoria.alta ? ' text-primary' : ' text-secondary text-opacity-50')}
                            onClick={() => handleItemClick(categoria.id)}
                            aria-controls={`subcategoria-collapse-${categoria.id}`}
                            aria-expanded={!isCollapsed}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="d-flex align-items-center">
                                <span className="me-3">{categoria.denominacion}</span>
                                {categoria.subCategorias.length > 0 && (
                                    isCollapsed ? <BsChevronDown /> : <BsChevronUp />
                                )}
                            </div>
                            <div className='d-flex gap-2'>
                                <GenericButton
                                    color="#FBC02D"
                                    size={20}
                                    icon={BsTrash}
                                    onClick={(e) => handleButtonClickDelete(e, categoria.id)}
                                />
                                <GenericButton
                                    color="#0080FF"
                                    size={20}
                                    icon={BsPlusCircleFill}
                                    onClick={(e) => handleButtonClick(e, categoria.id)}
                                />
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                    <Collapse in={!isCollapsed}>
                        <ListGroup>
                            {categoria.subCategorias.length > 0 && (
                                <ListGroup.Item className='border-0 ps-4'>
                                    {renderCategorias(categoria.subCategorias)}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Collapse>
                </div>
            );
        });
    };

    return (
        <Container className="text-center">
            <h1>Lista de Categorias</h1>
            <div className="d-flex justify-content-center my-3">
                <Button onClick={(e) => handleButtonClick(e, 0)}>Crear Categoria</Button>
            </div>
            {categorias.length > 0 ? renderCategorias(categorias) : <p>No hay categorías</p>}
            <CategoriaModal
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    fetchCategorias();
                }}
                idpadre={String(clickedCategoria)}
                activeSucursal={activeSucursal}
            />
        </Container>
    );
};
