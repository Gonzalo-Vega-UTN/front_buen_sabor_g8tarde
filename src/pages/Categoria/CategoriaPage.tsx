import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Button, Collapse, Modal, Form, ModalProps } from 'react-bootstrap';
import { Categoria } from '../../entities/DTO/Categoria/Categoria';
import { CategoriaService } from '../../services/CategoriaService';
import {  BsPlusCircleFill, BsTrash } from 'react-icons/bs';
import GenericButton from '../../components/generic/GenericButton';
import { useAuth } from '../../Auth/Auth';
import CategoriaModal from './CategoriaModal';

export const CategoriaPage = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [clickedCategoria, setClickedCategoria] = useState<number>(0);
    const [activeItems, setActiveItems] = useState<number[]>([]);
    const [collapsedItems, setCollapsedItems] = useState<number[]>([]);
    const [modalShow, setModalShow] = useState(false);
    const{activeSucursal}=useAuth();

    const fetchCategorias = async () => {
        try {
            const categorias = await CategoriaService.obtenerCategoriasPadre(activeSucursal);
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

    const handleButtonClickDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, idPadre: number) =>{
        console.log("ASD")
    }

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
                                icon={BsTrash}
                                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleButtonClickDelete(e,categoria.id)}
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
            <CategoriaModal
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    fetchCategorias();
                }}
                idpadre={clickedCategoria}
                activeSucursal={activeSucursal}
            />
        </Container>
    );
};

