import { useState } from "react";
import { Table } from "react-bootstrap";
import Button from "../generic/GenericButton";
import { ModalType } from "../../types/ModalType";
import ArticuloInsumoModal from "../modals/ArticuloInsumoModal";
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { FaSave } from "react-icons/fa";
import FiltroProductos from "../Filtrado/FiltroArticulo";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { UnidadMedida } from "../../entities/DTO/UnidadMedida/UnidadMedida";

interface TableProps {
    categorias: Categoria[];
    unidadesMedida: UnidadMedida[];
    articulosInsumo: ArticuloInsumo[];
    handleSubmit: (art: ArticuloInsumo, file : File) => void;
    handleDelete: (idArt: number) => void;
}

const ArticuloInsumoTable = ({ categorias, unidadesMedida, articulosInsumo, handleSubmit, handleDelete }: TableProps) => {
    //Entidades de la Tabla
    const [articuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>();

    //Estados de Selección
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>();
    const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState<number>();
    const [searchedDenominacion, setSearchedDenominacion] = useState<string>();

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
    const [titulo, setTitulo] = useState("");

    const handleClick = (titulo: string, art: ArticuloInsumo, modal: ModalType) => {
        setTitulo(titulo);
        setModalType(modal);
        setArticuloInsumo(art);
        setShowModal(true);
    };

    const handleChangeCategoria = (id: number) => {
        setCategoriaSeleccionada(id > 0 ? id : undefined);
    }

    const handleChangeUnidadMedida = (id: number) => {
        setUnidadMedidaSeleccionada(id > 0 ? id : undefined);
    }

    const handleChangeText = (denominacion: string) => {
        setSearchedDenominacion(denominacion ? denominacion : undefined);
    }

    return (
        <div className="container">
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
                    {articulosInsumo.map((articulo) => (
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
                                <Button color={articulo.alta ? "#D32F2F" : "#50C878"} size={23} icon={articulo.alta ? BsTrashFill : FaSave} onClick={() =>
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
                    onHide={() => setShowModal(false)}
                    articulo={articuloInsumo}
                    modalType={modalType}
                    titulo={titulo}
                    handleSubmit={handleSubmit}
                    unidadesMedida={unidadesMedida}
                    categorias={categorias}
                    handleDelete={handleDelete}
                />
            )}
        </div>
    );
}


export default ArticuloInsumoTable;