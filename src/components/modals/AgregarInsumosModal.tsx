import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import { ArticuloInsumo } from '../../entities/DTO/Articulo/Insumo/ArticuloInsumo';
import { UnidadMedidaServices } from '../../services/UnidadMedidaServices';
import { ArticuloInsumosServices } from '../../services/ArticuloInsumoServices';
import { BsTrashFill } from 'react-icons/bs';
import CustomButton from '../generic/Button';
import { FaSave } from 'react-icons/fa';
interface AgregarInsumosProps {
    show: boolean;
    onHide: () => void;
    title: string;
}
export const AgregarInsumosModal = ({ show, onHide, title }: AgregarInsumosProps) => {

    const [articulosInsumo, setArticuloInsumos] = useState<ArticuloInsumo[]>([])
    const [searchedText, setSearchedText] = useState<string>('')

    const [articulosAgregados, setArticulosAgregados] = useState<ArticuloInsumo[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const articulos = await ArticuloInsumosServices.getArticuloInsumo();
            setArticuloInsumos(articulos);
        };
        fetchData();
    }, []);


    const handleClick = (articulo: ArticuloInsumo) => {
        if (articulosAgregados.find(selected => selected.id === articulo.id)) {
            setArticulosAgregados(articulosAgregados.filter(art => art.id !== articulo.id))
        } else {
            setArticulosAgregados([...articulosAgregados, articulo])
        }
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedText(event.target.value)
        setArticuloInsumos(articulosInsumo.filter(art => art.denominacion.includes(event.target.value)))
    }
    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2></h2>
                <input value={searchedText} onChange={handleSearch} />
                <p>{searchedText}</p>
                <Table hover>
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Unidad de Medida</th>
                            <th>Stock Actual</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articulosInsumo.map((articulo) => (
                            <tr key={articulo.id} className="text-center">
                                <td>{articulo.id}</td>
                                <td>{articulo.denominacion}</td>
                                <td>{articulo.unidadMedida?.denominacion}</td>
                                <td>{articulo.stockActual}</td>
                                <td>cantidad
                                </td>
                                <td><CustomButton color={articulosAgregados.find(selected => selected.id === articulo.id) ? "#D32F2F" : "#50C878"} size={20} icon={articulosAgregados.find(selected => selected.id === articulo.id) ? BsTrashFill : FaSave} onClick={() => handleClick(articulo)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
