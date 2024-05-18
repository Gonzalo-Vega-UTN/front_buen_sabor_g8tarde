import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Button from "../generic/Button";
import { ModalType } from "../../types/ModalType";
import { StateType } from "../../types/StateType";
import ArticuloInsumoModal from "../modals/ArticuloInsumoModal";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { FaSave } from "react-icons/fa";

export default function ArticuloInsumoTable() {

    const [articuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>(new ArticuloInsumo());
    const [articuloInsumos, setArticuloInsumos] = useState<ArticuloInsumo[]>([]);


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


    useEffect(() => {
        const fetchArticuloInsumos = async () => {
            const articulos = await ArticuloInsumosServices.getArticuloInsumo();
            setArticuloInsumos(articulos);
        };

        fetchArticuloInsumos();
    }, []);

    return (
        <div className="container">
            <Button classes="mt-4 mb-3" color="#4CAF50" size={25} icon={CiCirclePlus} text="Nuevo Ingrediente" onClick={() =>
                handleClick(
                    "Nuevo Producto",
                    articuloInsumo,
                    ModalType.CREATE
                )}
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
