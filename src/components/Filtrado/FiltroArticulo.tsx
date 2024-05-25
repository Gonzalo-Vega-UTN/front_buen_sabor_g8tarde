import { Row, Col, Form } from "react-bootstrap";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { UnidadMedida } from "../../types/UnidadMedida";

type FiltroProductosProps = {
    categorias: Categoria[];
    unidadesMedida: UnidadMedida[];
    handleChangeText: (denominacion: string) => void;
    handleChangeCategoria: (id: number) => void;
    handleChangeUnidadMedida: (id: number) => void;
};

const FiltroProductos: React.FC<FiltroProductosProps> = ({ categorias, unidadesMedida, handleChangeText, handleChangeCategoria, handleChangeUnidadMedida }) => {
    return (
        <Row>
            <Col>
                <Form.Control type="text" placeholder="Buscar por denominación..." onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e.target.value)} />
            </Col>
            <Col>
                <select name="filtro_categoria" id="filtro_categoria" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeCategoria(Number(e.target.value))}>
                    <option value="-1">Todos</option>
                    {categorias.map(cat => (<option key={cat.id} value={cat.id}>{cat.denominacion}</option>))}
                </select>
            </Col>

            <Col>
                <select name="filtro_unidad-medida" id="filtro_unidad-medida" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeUnidadMedida(Number(e.target.value))}>
                    <option value="-1">Todos</option>
                    {unidadesMedida.map(unidad => (<option key={unidad.id} value={unidad.id}>{unidad.denominacion}</option>))}
                </select>
            </Col>


        </Row>
    )
};

export default FiltroProductos;