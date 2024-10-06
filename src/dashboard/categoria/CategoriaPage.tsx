import React, { useEffect, useState } from "react";
import { Container, ListGroup, Button, Collapse } from "react-bootstrap";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import {
  BsPlusCircleFill,
  BsTrash,
  BsChevronDown,
  BsChevronUp,
  BsPencil,
} from "react-icons/bs";
import GenericButton from "../../components/generic/buttons/GenericButton";
import CategoriaModal from "./CategoriaModal";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import { Sucursal } from "../../entities/DTO/Sucursal/Sucursal";
import SucursalService from "../../services/SucursalService";

export const CategoriaPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [clickedCategoria, setClickedCategoria] = useState<number>(0);
  const [activeItems, setActiveItems] = useState<number[]>([]);
  const [collapsedItems, setCollapsedItems] = useState<number[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria>(
    new Categoria()
  );
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const { activeSucursal, activeEmpresa } = useAuth0Extended();

  const fetchCategorias = async () => {
    if (activeSucursal) {
      try {
        const categorias = await CategoriaService.obtenerCategoriasPadre(
          activeSucursal
        );
        setCategorias(categorias);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const fetchSucursales = async (empresaId: number) => {
    try {
      const sucursalesData = await SucursalService.fetchSucursalesByActiveEmpresa(empresaId);
      setSucursales(sucursalesData);
      
    } catch (error) {
      console.error("Error al obtener las sucursales:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchSucursales(Number(activeEmpresa));
  }, [activeSucursal]);

  const handleItemClick = (id: number) => {
    const index = activeItems.indexOf(id);
    if (index !== -1) {
      setActiveItems(activeItems.filter((item) => item !== id));
    } else {
      setActiveItems([...activeItems, id]);
    }

    const collapsedIndex = collapsedItems.indexOf(id);
    if (collapsedIndex !== -1) {
      setCollapsedItems(collapsedItems.filter((item) => item !== id));
    } else {
      setCollapsedItems([...collapsedItems, id]);
    }
  };

  const handleButtonClickDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    event.stopPropagation();
    if (activeSucursal) {
      await CategoriaService.eliminarCategoriaById(activeSucursal, id);
      fetchCategorias();
    }
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    idPadre: number = 0
  ) => {
    event.stopPropagation();
    setSelectedCategoria(new Categoria());
    setClickedCategoria(idPadre);
    setEditMode(false);
    setModalShow(true);
  };

  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    categoria: Categoria
  ) => {
    event.stopPropagation();
    setSelectedCategoria(categoria);
    setEditMode(true);
    setModalShow(true);
  };

  return (
    <Container className="text-center">
      <h1>Lista de Categorias</h1>
      <div className="d-flex justify-content-center my-3">
        <Button onClick={(e) => handleButtonClick(e)}>Crear Categoria</Button>
      </div>
      {categorias.length > 0 ? (
        categorias.map((categoria) => {
          const isCollapsed = collapsedItems.includes(categoria.id);
          return (
            <div key={categoria.id} className="w-100 mb-2">
              <ListGroup>
                <ListGroup.Item
                  className={
                    "d-flex justify-content-between align-items-center" +
                    (categoria.alta
                      ? " text-primary"
                      : " text-secondary text-opacity-50")
                  }
                  onClick={() => handleItemClick(categoria.id)}
                  aria-controls={`subcategoria-collapse-${categoria.id}`}
                  aria-expanded={!isCollapsed}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <span className="me-3">{categoria.denominacion}</span>
                    {categoria.subCategorias.length > 0 &&
                      (isCollapsed ? <BsChevronDown /> : <BsChevronUp />)}
                  </div>
                  <div className="d-flex gap-2">
                    <GenericButton
                      color="#4CAF50"
                      size={20}
                      icon={BsPencil}
                      onClick={(e) => handleEditClick(e, categoria)}
                    />
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
                  {categoria.subCategorias
                    .filter((subcategoria) => subcategoria.alta)
                    .map((subCategoria) => (
                      <ListGroup.Item
                        key={subCategoria.id}
                        className={
                          "d-flex justify-content-between align-items-center" +
                          (subCategoria.alta
                            ? " text-primary"
                            : " text-secondary text-opacity-50")
                        }
                      >
                        <span>{subCategoria.denominacion}</span>
                        <div className="d-flex gap-2">
                          <GenericButton
                            color="#4CAF50"
                            size={20}
                            icon={BsPencil}
                            onClick={(e) => handleEditClick(e, subCategoria)}
                          />
                          <GenericButton
                            color="#FBC02D"
                            size={20}
                            icon={BsTrash}
                            onClick={(e) =>
                              handleButtonClickDelete(e, subCategoria.id)
                            }
                          />
                        </div>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </Collapse>
            </div>
          );
        })
      ) : (
        <p>No hay categorías</p>
      )}
      {modalShow && (
        <CategoriaModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            fetchCategorias();
          }}
          idpadre={clickedCategoria.toString()}
          editMode={editMode}
          selectedCategoria={selectedCategoria}
          sucursales={sucursales}
        />
      )}
    </Container>
  );
};
