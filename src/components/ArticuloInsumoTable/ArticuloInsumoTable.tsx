import  { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { StateType } from "../../types/StateType";
import DeleteButton from "../DeleteButton/DeleteButton";
import EditButton from "../EditButton/EditButton";
import ArticuloInsumoModal from "../ArticuloInsumoModal/ArticuloInsumoModal";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";

export default function ArticuloInsumoTable() {
    const initializableNewArticuloInsumo = (): ArticuloInsumo => {
        return {
            id: 0,
            denominacion: "",
            descripcion: "",
            precioVenta: 0,
            estadoArticulo: StateType.Alta,
            precioCompra: 0,
            stockActual: 0,
            stockMinimo: 0,
            unidadMedida: {
                id: 0,
                denominacion: "",
                abreviatura: "",
            },
            url_Imagen: "",
        };
    };

    const [articuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>(
        initializableNewArticuloInsumo()
    );

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

    const [articuloInsumos, setArticuloInsumos] = useState<ArticuloInsumo[]>([]);

    useEffect(() => {
        const fetchArticuloInsumos = async () => {
            const articulos = await ArticuloInsumosServices.getArticuloInsumo();
            setArticuloInsumos(articulos);
        };

        fetchArticuloInsumos();
    }, []);

    return (
        <div className="container">
            <Button
                className="mt-4 mb-3"
                onClick={() =>
                    handleClick(
                        "Nuevo Ingrediente",
                        initializableNewArticuloInsumo(),
                        ModalType.CREATE
                    )
                }
            >
                Nuevo Ingrediente
            </Button>
            <Table hover>
                <thead>
                    <tr className="text-center">
                        <th>Nombre</th>
                        <th>Unidad de Medida</th>
                        <th>Stock Minimo</th>
                        <th>Stock Actual</th>
                        <th>Diferencia Stock</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {articuloInsumos.map((articulo) => (
                        <tr key={articulo.id} className="text-center">
                            <td>{articulo.denominacion}</td>
                            <td>{articulo.unidadMedida.denominacion}</td>
                            <td>{articulo.stockMinimo}</td>
                            <td>{articulo.stockActual}</td>
                            <td>{articulo.stockActual - articulo.stockMinimo}</td>
                            <td>
                                <EditButton
                                    onClick={() =>
                                        handleClick(
                                            "Editar Ingrediente",
                                            articulo,
                                            ModalType.UPDATE
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <DeleteButton
                                    onClick={() =>
                                        handleClick(
                                            "Eliminar Ingrediente",
                                            articulo,
                                            ModalType.DELETE
                                        )
                                    }
                                />
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
