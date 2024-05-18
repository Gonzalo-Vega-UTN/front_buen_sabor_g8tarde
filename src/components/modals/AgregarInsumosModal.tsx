import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import { ArticuloInsumo } from '../../entities/DTO/Articulo/Insumo/ArticuloInsumo';
import { ArticuloInsumosServices } from '../../services/ArticuloInsumoServices';
import { BsTrashFill } from 'react-icons/bs';
import CustomButton from '../generic/Button';
import { FaSave } from 'react-icons/fa';
interface AgregarInsumosProps {
    show: boolean;
    onHide: () => void;
    title: string;
    handleSave: (articulosInsumo: ArticuloInsumo[]) => void;
    articulosExistentes : ArticuloInsumo[];
}
export const AgregarInsumosModal = ({ show, onHide, title, handleSave, articulosExistentes  }: AgregarInsumosProps) => {

    const [listaArticulos, setListaArticulos] = useState<ArticuloInsumo[]>([]);
    const [listaFiltrada, setListaFiltrada] = useState<ArticuloInsumo[]>([]);

    const [searchedText, setSearchedText] = useState<string>('')

    const [articulosAgregados, setArticulosAgregados] = useState<ArticuloInsumo[]>(articulosExistentes? articulosExistentes : [] )

    useEffect(() => {
        const fetchData = async () => {
            const articulos = await ArticuloInsumosServices.getArticuloInsumo();
            setListaArticulos(articulos);
            setListaFiltrada(articulos);
            setArticulosAgregados([...articulosAgregados])
        };
        fetchData();
    }, []);


    useEffect(() => {
        // Filtrar la lista basada en el término de búsqueda
        const filtered = listaArticulos.filter(articulo =>
            articulo.denominacion.toLowerCase().includes(searchedText.toLowerCase())
        );
        setListaFiltrada(filtered);
    }, [searchedText, listaArticulos]);

    const handleClick = (articulo: ArticuloInsumo) => {
        if (articulosAgregados.find(selected => selected.id === articulo.id)) {
            setArticulosAgregados(articulosAgregados.filter(art => art.id !== articulo.id))
        } else {
            setArticulosAgregados([...articulosAgregados, articulo])
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2></h2>
                <input value={searchedText} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchedText(event.target.value)} />
                <Table hover>
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Unidad de Medida</th>
                            <th>Categoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaFiltrada.map((articulo) => (
                            <tr key={articulo.id} className="text-center">
                                <td>{articulo.id}</td>
                                <td>{articulo.denominacion}</td>
                                <td>{articulo.unidadMedida?.denominacion}</td>
                                <td>{articulo.categoria?.denominacion}</td>
                                <td><CustomButton color={articulosAgregados.find(selected => selected.id === articulo.id) ? "#D32F2F" : "#50C878"} size={20} icon={articulosAgregados.find(selected => selected.id === articulo.id) ? BsTrashFill : FaSave} onClick={() => handleClick(articulo)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => handleSave(articulosAgregados)}>
                    Guardar
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
