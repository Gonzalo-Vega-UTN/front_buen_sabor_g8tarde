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
import { ArticuloInsumo } from '../entities/DTO/Articulo/Insumo/ArticuloInsumo'
import { ArticuloManufacturadoDetalleTable } from '../components/tables/ArtManufacturadoDetalleTable'
import { ArticuloManufacturadoDetalle } from '../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturadoDetalle'


export const FormularioArtManuf = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [articuloManufacturado, setArticuloManufacturado] = useState<ArticuloManufacturado | null>(null)

    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([])

    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null | undefined>(articuloManufacturado?.categoria)
    const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<UnidadMedida | null | undefined>(articuloManufacturado?.unidadMedida)

    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([])

    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string>("")
    const [submitError, setSubmitError] = useState<string>("");

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");


    useEffect(() => {
        if (!id || id == '0') {
            const artNuevo = new ArticuloManufacturado();
            artNuevo.articuloManufacturadoDetalles = []
            setArticuloManufacturado(artNuevo);
            return;
        }
        const fetchData = async () => {
            try {
                const articuloManufacturado = await ProductServices.getProduct(Number(id));
                setArticuloManufacturado(articuloManufacturado);
                setDetalles(articuloManufacturado.articuloManufacturadoDetalles ? articuloManufacturado.articuloManufacturadoDetalles.filter(detalle => detalle.alta) : [])
            } catch (error: any) {
                setError(error.message);
                setTimeout(() => {
                    navigate('/productos');
                }, 1500); // 1.5 segundos de delay
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
        
        if (!articuloManufacturado) {
            setSubmitError("El artículo manufacturado no está definido");
            return;
        }
    
        const { unidadMedida, categoria, denominacion, descripcion, precioVenta } = articuloManufacturado;
        articuloManufacturado.articuloManufacturadoDetalles = detalles;

    
        if (!unidadMedida || !categoria || !denominacion || !descripcion || precioVenta === 0) {
            setSubmitError("Completa todos los campos");
            return;
        }
        const detallesConCero = articuloManufacturado.articuloManufacturadoDetalles?.filter(detalle => detalle.cantidad === 0);
        
        if (detallesConCero && detallesConCero.length > 0) {
            setSubmitError("Agrega cantidad a los insumos agregados");
            return;
        }
    
        if (!articuloManufacturado.articuloManufacturadoDetalles || articuloManufacturado.articuloManufacturadoDetalles.length === 0) {
            setSubmitError("Agrega insumos");
            return;
        }
    
       

        console.log(articuloManufacturado);

        if (articuloManufacturado.id == 0) {
            ProductServices.createProduct(articuloManufacturado).then((data) => {
                setExito("ENTIDAD CREADA CON EXITO")
                setTimeout(() => {
                    navigate('/productos');
                }, 1500); // 1.5 segundos de delay
            }
            ).catch(error => {
                console.log("Algo salio mal CREATE", error);

            })
        } else {
            ProductServices.updateProduct(articuloManufacturado.id, articuloManufacturado).then((data) => {
                setExito("ENTIDAD ACTUALIZADA CON EXITO")
                setTimeout(() => {
                   navigate('/productos');
                }, 1500); // 1.5 segundos de delay
            }
            ).catch(error => {
                console.log("Algo salio mal UPDATE", error);

            })

        }

    }
    const handleCantidadChange = (index: number, newCantidad: number) => {
        setDetalles(prevDetalles => {
            const updatedDetalles = [...prevDetalles];
            updatedDetalles[index] = { ...updatedDetalles[index], cantidad: newCantidad };
            return updatedDetalles;
        });
    };


    const handleOpenModal = (
        newTitle: string,
    ) => {
        console.log("clicked");

        setTitle(newTitle);
        setShowModal(true);
    };
    function handleSeleccionInsumos(articulosInsumo: ArticuloInsumo[]): void {
        // Crear un mapa para un acceso rápido a los insumos nuevos
        const nuevosInsumosMap = new Map<number, ArticuloInsumo>();
        articulosInsumo.forEach(articulo => {
            if (articulo.id !== undefined) { // Asegúrate de que id no es undefined
                nuevosInsumosMap.set(articulo.id, articulo);
            }
        });

        // Filtrar y actualizar los detalles viejos que están en la nueva lista de insumos
        const detallesActualizados = detalles.filter(detalle => {
            return detalle.articuloInsumo?.id !== undefined && nuevosInsumosMap.has(detalle.articuloInsumo.id);
        }).map(detalle => {
            // Actualiza el insumo del detalle con el nuevo insumo si es necesario
            if (detalle.articuloInsumo?.id !== undefined) {
                detalle.articuloInsumo = nuevosInsumosMap.get(detalle.articuloInsumo.id) || detalle.articuloInsumo;
            }
            return detalle;
        });

        // Agregar nuevos detalles para los insumos que no estaban en los detalles viejos
        articulosInsumo.forEach(articulo => {
            const exists = detallesActualizados.some(detalle => detalle.articuloInsumo?.id === articulo.id);
            if (!exists) {
                const nuevoDetalle = new ArticuloManufacturadoDetalle();
                nuevoDetalle.articuloInsumo = articulo;
                detallesActualizados.push(nuevoDetalle);
            }
        });

        console.log("detalles actualizados", detallesActualizados);

        // Actualizar el estado con los nuevos detalles
        setDetalles(detallesActualizados);
        
        setShowModal(false)
    }

    return (
        <>
            {error && (
                <Alert variant="danger" className="text-center mt-5">
                    <Alert.Heading>Oops!</Alert.Heading>
                    <p>{error}</p>
                    <span>Redirigiendo...</span>
                </Alert>
            )}

            {exito && (
                <Alert variant="success" className="text-center mt-5">
                    <Alert.Heading>OK!</Alert.Heading>
                    <p>{exito}</p>
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
                                    { rule: ValidationEnum.MinLength, errorMessage: `El campo debe tener al menos ${10} caracteres`, min: 25 },
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
                                    { rule: ValidationEnum.MinLength, errorMessage: `El campo debe tener al menos ${10} caracteres`, min: 30 },
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

                        {showModal && (
                            <Row>
                                <AgregarInsumosModal
                                    show={showModal}
                                    onHide={() => setShowModal(false)}
                                    title={title}
                                    articulosExistentes={detalles?.map(detalle => detalle.articuloInsumo)}
                                    handleSave={handleSeleccionInsumos}
                                />

                            </Row>
                        )}

                        <Row className='p-5'>
                            <Button className='mb-2' variant='primary' onClick={() => handleOpenModal("Agregar Insumos")}>Editar Insumos</Button>
                            {articuloManufacturado.articuloManufacturadoDetalles &&
                                <ArticuloManufacturadoDetalleTable
                                    detalles={detalles}
                                    onCantidadChange={handleCantidadChange}
                                />
                            }
                        </Row>



                        <Button className="m-2 p-2" variant="primary" type="submit">Guardar</Button>
                        <Row>
                            {submitError && <h4 className='text-danger'>{submitError}</h4>}
                        </Row>
                    </Form>
                </>
            )}
        </>
    )
}

