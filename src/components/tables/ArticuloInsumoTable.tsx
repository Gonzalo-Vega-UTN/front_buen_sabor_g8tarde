import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Button from "../generic/Button";
import { ModalType } from "../../types/ModalType";
import ArticuloInsumoModal from "../modals/ArticuloInsumoModal";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { FaSave } from "react-icons/fa";
import FiltroProductos from "../Filtrado/FiltroArticulo";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { UnidadMedida } from "../../types/UnidadMedida";
import { CategoriaService } from "../../services/CategoriaService";
import { UnidadMedidaServices } from "../../services/UnidadMedidaServices";

export default function ArticuloInsumoTable() {

    const [articuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>(new ArticuloInsumo());
    const [articuloInsumos, setArticuloInsumos] = useState<ArticuloInsumo[]>([]);

    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([])


    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>();
    const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState<number>();
    const [searchedDenominacion, setSearchedDenominacion] = useState<string>();
    
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
    const [title, setTitle] = useState("");

    const handleClick = (
        newTitle: string,
        art: ArticuloInsumo,
        modal: ModalType
    ) => {
        setTitle(newTitle);
        setModalType(modal);
        setArticuloInsumo(art);
        setShowModal(true);
    };


    const fetchDataArticulosInsumo = async (idCategoria?: number, idUnidadMedida?: number, denominacion?: string) => {
        const articulos = await ArticuloInsumosServices.getArticuloInsumoFiltered(idCategoria, idUnidadMedida, denominacion );
        setArticuloInsumos(articulos);
    };
    
    useEffect(() => {
       
        fetchDataArticulosInsumo();
    }, []);


    useEffect(() => {
        const fetchCategorias = async () => {
          const categorias = await CategoriaService.getCategorias();
          setCategorias(categorias);
        };
    
        fetchCategorias();
      }, []);
    
      useEffect(() => {
        const fetchUnidadadMedida = async () => {
          const unidadesMedida = await UnidadMedidaServices.getUnidadesMedida();
          setUnidadesMedida(unidadesMedida);
        };
    
        fetchUnidadadMedida();
      }, []);



    const handleChangeCategoria = (id: number) => {
        setCategoriaSeleccionada(id > 0 ? id : undefined);
      }
      
      const handleChangeUnidadMedida = (id: number) => {
        setUnidadMedidaSeleccionada(id > 0 ? id : undefined);
      }
    
      const handleChangeText = (denominacion: string) => {
        setSearchedDenominacion(denominacion ? denominacion : undefined);
      }
      useEffect(() => {
        fetchDataArticulosInsumo(categoriaSeleccionada, unidadMedidaSeleccionada, searchedDenominacion);
      }, [categoriaSeleccionada, unidadMedidaSeleccionada,searchedDenominacion]);

    return (
        <div className="container">
            <Button classes="mt-4 mb-3" color="#4CAF50" size={25} icon={CiCirclePlus} text="Nuevo Ingrediente" onClick={() =>
                handleClick(
                    "Nuevo Producto",
                    articuloInsumo,
                    ModalType.CREATE
                )}
            />
            <FiltroProductos
      categorias={categorias}
      unidadesMedida={unidadesMedida}
      handleChangeText={handleChangeText}
      handleChangeCategoria={handleChangeCategoria}
      handleChangeUnidadMedida={handleChangeUnidadMedida}
    />
            <Table hover>
                <thead>
                    <tr className="text-center">
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoria</th>
                        <th>Unidad de Medida</th>
                        <th>Stock Actual / Stock Maximo</th>
                        <th>Costo</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {articuloInsumos.map((articulo) => (
                        <tr key={articulo.id} className="text-center ">
                            <td className={articulo.alta ? "" : "bg-secondary"}>{articulo.id}</td>
                            <td className={articulo.alta ? "" : "bg-secondary"}>{articulo.denominacion}</td>
                            <td className={articulo.alta ? "" : "bg-secondary"}>{articulo.categoria?.denominacion}</td>
                            <td className={articulo.alta ? "" : "bg-secondary"}>{articulo.unidadMedida?.denominacion}</td>
                            <td className={articulo.alta ? "" : "bg-secondary"}>{`${articulo.stockActual} / ${articulo.stockMaximo}`}</td>
                            <td className={articulo.alta ? "" : "bg-secondary"}> {articulo.precioCompra}</td>
                            <td className={articulo.alta ? "" : "bg-secondary"}>
                                <Button color="#FBC02D" size={23} icon={BsFillPencilFill} onClick={() =>
                                    handleClick(
                                        "Editar Articulo",
                                        articulo,
                                        ModalType.UPDATE)
                                } />
                            </td>
                            <td className={articulo.alta ? "" : "bg-secondary"}>
                                <Button color={articulo.alta ? "#D32F2F" : "#50C878"} size={23} icon={articulo.alta ? BsTrashFill : FaSave } onClick={() =>
                                    handleClick(
                                        "Alta/Baja Articulo",
                                        articulo,
                                        ModalType.DELETE
                                    )
                                } />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {showModal && (
                <ArticuloInsumoModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    title={title}
                    modalType={modalType}
                    articulo={articuloInsumo}
                    articulosInsumos={setArticuloInsumos}
                />
            )}
        </div>
    );
}
