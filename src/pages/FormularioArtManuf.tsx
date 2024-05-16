import React, { useEffect, useState } from 'react'
import { ArticuloManufacturado } from '../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado'
import { useNavigate, useParams } from 'react-router-dom'
import { MyFormGroupInput } from '../components/formComponents/FormGroupInput'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { ValidationEnum } from '../utils/ValidationEnum'
import { ProductServices } from '../services/ProductServices'
import { Categoria } from '../entities/DTO/Categoria/Categoria'
import { FormGroupSelect } from '../components/formComponents/FormGroupSelect'
import { CategoriaService } from '../services/CategoriaService'
import { UnidadMedida } from '../entities/DTO/UnidadMedida/UnidadMedida'
import { UnidadMedidaServices } from '../services/UnidadMedidaServices'
import { AgregarInsumosModal } from '../components/modals/AgregarInsumosModal'


export const FormularioArtManuf = () => {
    const { id } = useParams();
    const [articuloManufacturado, setArticuloManufacturado] = useState<ArticuloManufacturado | null>(null)

    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([])

    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null | undefined>(articuloManufacturado?.categoria)
    const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<UnidadMedida | null | undefined>(articuloManufacturado?.unidadMedida)

    const [error, setError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<boolean>(false);

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!id || id == '0') {
            setArticuloManufacturado(new ArticuloManufacturado());
            return;
        }
        const fetchData = async () => {
            try {
                const articuloManufacturado = await ProductServices.getProduct(Number(id));
                setArticuloManufacturado(articuloManufacturado);

            } catch (error: any) {
                setError(error.message);
                setTimeout(() => {
                    navigate('/productos');
                }, 1500); // 2 segundos de delay
            }
        };
        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const categorias = await CategoriaService.getCategorias();
            setCategorias(categorias);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const unidadesMedida = await UnidadMedidaServices.getUnidadesMedida();
            setUnidadesMedida(unidadesMedida);
        };
        fetchData();
    }, []);

    const update = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (articuloManufacturado === null) return;
        const { name, value } = event.target;
        setArticuloManufacturado(
            prevObject => ({
                ...prevObject!,
                [name]: value,
            })

        );

    }

    const onChange = (option: any | null, name: string) => {
        setArticuloManufacturado(
            prevObject => ({
                ...prevObject!,
                [name]: option,
            })
        );
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!articuloManufacturado?.unidadMedida || !articuloManufacturado?.categoria || !articuloManufacturado.denominacion) {
            setSubmitError(true)
        }

    }


    const handleOpenModal = (
        newTitle: string,
    ) => {
        console.log("clicked");

        setTitle(newTitle);
        setShowModal(true);
    };
    return (
        <>
            {error && (
                <Alert variant="danger" className="text-center mt-5">
                    <Alert.Heading>Oops!</Alert.Heading>
                    <p>{error}</p>
                    <span>Redirigiendo...</span>
                </Alert>
            )}

            {/* Mostrar formulario en caso de que no hay errores  */}
            {!error && articuloManufacturado && (
                <>
                    <p></p>
                    <h2>Formulario de Articulo Manufacturado</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row className="m-4">
                            <MyFormGroupInput
                                update={update}
                                name={"denominacion"}
                                label={'Denominacion'}
                                orientation={Col}
                                type={'text'}
                                attribute={articuloManufacturado.denominacion}
                                validationRules={[
                                    { rule: ValidationEnum.Empty, errorMessage: 'El campo no puede estar vacío' },
                                    { rule: ValidationEnum.MinLength, errorMessage: `El campo debe tener al menos ${5} caracteres`, min: 5 },
                                ]}
                            />
                            <MyFormGroupInput
                                update={update}
                                name={"descripcion"}
                                label={'Descripcion'}
                                orientation={Row}
                                type={'text'}
                                attribute={articuloManufacturado.descripcion}
                                validationRules={[
                                    { rule: ValidationEnum.Empty, errorMessage: 'El campo no puede estar vacío' },
                                    { rule: ValidationEnum.MinLength, errorMessage: `El campo debe tener al menos ${25} caracteres`, min: 25 },
                                ]}
                            />
                            <MyFormGroupInput
                                update={update}
                                name={"preparacion"}
                                label={'Preparacion'}
                                orientation={Row}
                                type={'text'}
                                attribute={articuloManufacturado.preparacion}
                                validationRules={[
                                    { rule: ValidationEnum.Empty, errorMessage: 'El campo no puede estar vacío' },
                                    { rule: ValidationEnum.MinLength, errorMessage: `El campo debe tener al menos ${30} caracteres`, min: 30 },
                                ]}
                            />

                            <MyFormGroupInput
                                update={update}
                                name={"tiempoEstimadoMinutos"}
                                label={'Tiempo de Preparacion (minutos)'}
                                orientation={Col}
                                type={'number'}
                                attribute={articuloManufacturado.tiempoEstimadoMinutos.toString()}
                                validationRules={[
                                    { rule: ValidationEnum.Empty, errorMessage: 'El campo no puede estar vacío' },
                                    { rule: ValidationEnum.Positive, errorMessage: "El campo debe ser un numero positivo" },
                                ]}
                            />
                            <MyFormGroupInput
                                update={update}
                                name={"precioVenta"}
                                label={'Precio Venta'}
                                orientation={Col}
                                type={'number'}
                                attribute={articuloManufacturado.precioVenta.toString()}
                                validationRules={[
                                    { rule: ValidationEnum.Empty, errorMessage: 'El campo no puede estar vacío' },
                                    { rule: ValidationEnum.Positive, errorMessage: "El campo debe ser un numero positivo" },
                                ]}
                            />
                            <FormGroupSelect<Categoria>
                                orientation={Col}
                                options={categorias}
                                getOptionLabel={(cat) => cat.denominacion}
                                getOptionValue={(cat) => String(cat.id)}
                                onChange={(option: any | null, name: string) => {
                                    onChange(option, name)
                                    setSelectedCategoria(option)
                                }}
                                selectedOption={articuloManufacturado.categoria}
                                label={"Seleccionar una Categoria"}
                                name='categoria'
                            />
                            <FormGroupSelect<UnidadMedida>
                                orientation={Col}
                                options={unidadesMedida}
                                getOptionLabel={(unidad) => unidad.denominacion}
                                getOptionValue={(unidad) => String(unidad.id)}
                                onChange={(option: any | null, name: string) => {
                                    onChange(option, name)
                                    console.log(selectedUnidadMedida);

                                    setSelectedUnidadMedida(option)
                                    console.log(selectedUnidadMedida);
                                }}
                                selectedOption={articuloManufacturado.unidadMedida}
                                label={"Seleccionar una Medida"}
                                name='unidadMedida'
                            />
                        </Row>
                        <Button variant='primary' onClick={() => handleOpenModal("Agregar Insumos")}>Agregar Insumos</Button>
                        <Row>
                            {showModal && (
                                <AgregarInsumosModal
                                    show={showModal}
                                    onHide={() => setShowModal(false)}
                                    title={title}
                                />
                            )}
                        </Row>
                        <Button className="m-2 p-2" variant="primary" type="submit">Guardar</Button>
                        <Row>
                            {submitError && <h4 className='text-danger'>Completa todos los campos</h4>}
                        </Row>
                    </Form>
                </>
            )}
        </>
    )
}

