import React, { useEffect, useState } from "react";
import { useAuth0, Auth0ContextInterface, User } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import { ArticuloManufacturado } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import { UnidadMedida } from "../../entities/DTO/UnidadMedida/UnidadMedida";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { ArticuloManufacturadoDetalle } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturadoDetalle";
import { ValidationResult } from "../../utils/ValidationUtil";
import { ProductServices } from "../../services/ProductServices";
import { CategoriaService } from "../../services/CategoriaService";
import UnidadMedidaService from "../../services/UnidadMedidaServices";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { MyFormGroupInput } from "../../components/formComponents/FormGroupInput";
import { FormGroupSelect } from "../../components/formComponents/FormGroupSelect";
import { ArticuloManufacturadoDetalleTable } from "../../components/tables/ArtManufacturadoDetalleTable";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { ValidationEnum } from "../../utils/ValidationEnum";
import { AgregarInsumosModal } from "./AgregarInsumosModal";
import ImagenCarousel from "../../components/carousel/ImagenCarousel";
import { Imagen } from "../../entities/DTO/Imagen";

interface Auth0ContextInterfaceExtended<UserType extends User> extends Auth0ContextInterface<UserType> {
  activeSucursal: string ;
}


export const FormularioArtManuf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articuloManufacturado, setArticuloManufacturado] =
    useState<ArticuloManufacturado | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [, setFiles] = useState<File[]>([]);
  const [, setSelectedCategoria] = useState<Categoria | null | undefined>(
    articuloManufacturado?.categoria
  );
  const [, setSelectedUnidadMedida] = useState<
    UnidadMedida | null | undefined
  >(articuloManufacturado?.unidadMedida);

  const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, Record<string, ValidationResult>>
  >({});

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  const { activeSucursal } = useAuth0() as Auth0ContextInterfaceExtended<User>;

  useEffect(() => {
    if (!id || id === "0") {
      const artNuevo = new ArticuloManufacturado();
      artNuevo.articuloManufacturadoDetalles = [];
      setArticuloManufacturado(artNuevo);
      return;
    }
    const fetchData = async () => {
      try {
        const articuloManufacturado = await ProductServices.getOne(Number(id));
        setArticuloManufacturado(articuloManufacturado);
        setDetalles(
          articuloManufacturado.articuloManufacturadoDetalles
            ? articuloManufacturado.articuloManufacturadoDetalles.filter(
              (detalle) => detalle.alta
            )
            : []
        );
      } catch (error: any) {
        setError(error.message);
        setTimeout(() => {
          navigate("/productos");
        }, 1500); // 1.5 segundos de delay
      }
    };
    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const categorias = await CategoriaService.obtenerCategorias(
        activeSucursal
      );
      setCategorias(categorias);
    };
    fetchData();
  }, [activeSucursal]);

  useEffect(() => {
    const fetchData = async () => {
      const unidadesMedida = await UnidadMedidaService.getAll();
      setUnidadesMedida(unidadesMedida);
    };
    fetchData();
  }, []);

  const update = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (articuloManufacturado === null) return;
    const { name, value } = event.target;
    setArticuloManufacturado((prevObject) => ({
      ...prevObject!,
      [name]: value,
    }));
  };

  const onChange = (option: any | null, name: string) => {
    setArticuloManufacturado((prevObject) => ({
      ...prevObject!,
      [name]: option,
    }));
  };

  const handleSetFieldErrors = (
    name: string,
    errors: Record<string, ValidationResult>
  ) => {
    setFieldErrors((prev) => ({
      ...prev,
      [name]: errors,
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    if (articuloManufacturado != null && articuloManufacturado !== undefined) {
      setArticuloManufacturado((prev) => ({
        ...prev,
        imagenes: newImages,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!articuloManufacturado) {
      setSubmitError("El artículo manufacturado no está definido");
      return;
    }

    const { unidadMedida, categoria } = articuloManufacturado;
    articuloManufacturado.articuloManufacturadoDetalles = detalles;

    if (!unidadMedida || !categoria) {
      setSubmitError("Completa todos los campos");
      return;
    }

    const hasErrors = Object.values(fieldErrors).some((errors) =>
      Object.values(errors).some((error) => !error.isValid)
    );

    if (hasErrors) {
      setSubmitError("Completa todos los campos");
      return;
    }

    const detallesConCero =
      articuloManufacturado.articuloManufacturadoDetalles?.filter(
        (detalle) => detalle.cantidad === 0
      );

    if (detallesConCero && detallesConCero.length > 0) {
      setSubmitError("Agrega cantidad a los insumos agregados");
      return;
    }

    if (
      !articuloManufacturado.articuloManufacturadoDetalles ||
      articuloManufacturado.articuloManufacturadoDetalles.length === 0
    ) {
      setSubmitError("Agrega insumos");
      return;
    }

    try {

      //quitar blobs
      articuloManufacturado.imagenes = articuloManufacturado.imagenes.filter(imagen => !imagen.url.includes("blob"))
      let response: ArticuloManufacturado;
      if (articuloManufacturado.id === 0) {
        response = await ProductServices.create(articuloManufacturado, activeSucursal);
      } else {
        response = await ProductServices.update(articuloManufacturado.id, articuloManufacturado);
      }

      if (response) {
        if (response.id) {
          setExito("ENTIDAD CREADA CON ÉXITO");
          setTimeout(() => {
            navigate("/productos");
          }, 1500); // 1.5 segundos de delay
        }
      }

    } catch (error) {
      console.log("Algo salió mal UPDATE", error);
      setError("Hubo un error")
    }


  };

  const handleCantidadChange = (index: number, newCantidad: number) => {
    setDetalles((prevDetalles) => {
      const updatedDetalles = [...prevDetalles];
      updatedDetalles[index] = {
        ...updatedDetalles[index],
        cantidad: newCantidad,
      };
      return updatedDetalles;
    });
  };

  const handleOpenModal = (newTitle: string) => {
    setTitle(newTitle);
    setShowModal(true);
  };

  function handleSeleccionInsumos(articulosInsumo: ArticuloInsumo[]): void {
    // Crear un mapa para un acceso rápido a los insumos nuevos
    const nuevosInsumosMap = new Map<number, ArticuloInsumo>();
    articulosInsumo.forEach((articulo) => {
      if (articulo.id !== undefined) {
        // Asegúrate de que id no es undefined
        nuevosInsumosMap.set(articulo.id, articulo);
      }
    });

    // Filtrar y actualizar los detalles viejos que están en la nueva lista de insumos
    const detallesActualizados = detalles
      .filter((detalle) => {
        return (
          detalle.articuloInsumo?.id !== undefined &&
          nuevosInsumosMap.has(detalle.articuloInsumo.id)
        );
      })
      .map((detalle) => {
        // Actualiza el insumo del detalle con el nuevo insumo si es necesario
        if (detalle.articuloInsumo?.id !== undefined) {
          detalle.articuloInsumo =
            nuevosInsumosMap.get(detalle.articuloInsumo.id) ||
            detalle.articuloInsumo;
        }
        return detalle;
      });

    // Agregar nuevos detalles para los insumos que no estaban en los detalles viejos
    articulosInsumo.forEach((articulo) => {
      const exists = detallesActualizados.some(
        (detalle) => detalle.articuloInsumo?.id === articulo.id
      );
      if (!exists) {
        const nuevoDetalle = new ArticuloManufacturadoDetalle();
        nuevoDetalle.articuloInsumo = articulo;
        detallesActualizados.push(nuevoDetalle);
      }
    });

    // Actualizar el estado con los nuevos detalles
    setDetalles(detallesActualizados);

    setShowModal(false);
  }

  return (
    <>
      {error && (
        <Alert variant="danger" className="text-center mt-5">
          <Alert.Heading>¡Oops!</Alert.Heading>
          <p>{error}</p>
          <span>Redirigiendo...</span>
        </Alert>
      )}

      {exito && (
        <Alert variant="success" className="text-center mt-5">
          <Alert.Heading>¡OK!</Alert.Heading>
          <p>{exito}</p>
          <span>Redirigiendo...</span>
        </Alert>
      )}

      {/* Mostrar formulario en caso de que no hay errores  */}
      {!error && articuloManufacturado && (
        <>
          <h2>Formulario de Articulo Manufacturado</h2>
          <Form onSubmit={handleSubmit}>
            <Row className="m-4">
              <Col>
                <MyFormGroupInput
                  onChange={update}
                  name={"denominacion"}
                  label={"Denominación"}
                  orientation={Col}
                  type={"text"}
                  attribute={articuloManufacturado.denominacion}
                  validationRules={[
                    {
                      rule: ValidationEnum.Empty,
                      errorMessage: "El campo no puede estar vacío",
                    },
                    {
                      rule: ValidationEnum.MinLength,
                      errorMessage: `El campo debe tener al menos ${5} caracteres`,
                      min: 5,
                    },
                  ]}
                  setFieldErrors={handleSetFieldErrors}
                />
              </Col>
              <Col>
                <MyFormGroupInput
                  onChange={update}
                  name={"descripcion"}
                  label={"Descripción"}
                  orientation={Col}
                  type={"text"}
                  attribute={articuloManufacturado.descripcion}
                  validationRules={[
                    {
                      rule: ValidationEnum.Empty,
                      errorMessage: "El campo no puede estar vacío",
                    },
                    {
                      rule: ValidationEnum.MinLength,
                      errorMessage: `El campo debe tener al menos ${25} caracteres`,
                      min: 25,
                    },
                  ]}
                  setFieldErrors={handleSetFieldErrors}
                />
              </Col>
              <Col>
                <MyFormGroupInput
                  onChange={update}
                  name={"preparacion"}
                  label={"Preparación"}
                  orientation={Col}
                  type={"text"}
                  attribute={articuloManufacturado.preparacion}
                  validationRules={[
                    {
                      rule: ValidationEnum.Empty,
                      errorMessage: "El campo no puede estar vacío",
                    },
                    {
                      rule: ValidationEnum.MinLength,
                      errorMessage: `El campo debe tener al menos ${30} caracteres`,
                      min: 30,
                    },
                  ]}
                  setFieldErrors={handleSetFieldErrors}
                />
              </Col>
            </Row>

            <Row className="m-4">
              <Col>
                <MyFormGroupInput
                  onChange={update}
                  name={"tiempoEstimadoMinutos"}
                  label={"Tiempo de Preparación (minutos)"}
                  orientation={Col}
                  type={"number"}
                  attribute={articuloManufacturado.tiempoEstimadoMinutos.toString()}
                  validationRules={[
                    {
                      rule: ValidationEnum.Empty,
                      errorMessage: "El campo no puede estar vacío",
                    },
                    {
                      rule: ValidationEnum.Positive,
                      errorMessage: "El campo debe ser un número positivo",
                    },
                  ]}
                  setFieldErrors={handleSetFieldErrors}
                />
              </Col>
              <Col>
                <MyFormGroupInput
                  onChange={update}
                  name={"precioVenta"}
                  label={"Precio Venta"}
                  orientation={Col}
                  type={"number"}
                  attribute={articuloManufacturado.precioVenta.toString()}
                  validationRules={[
                    {
                      rule: ValidationEnum.Empty,
                      errorMessage: "El campo no puede estar vacío",
                    },
                    {
                      rule: ValidationEnum.Positive,
                      errorMessage: "El campo debe ser un número positivo",
                    },
                  ]}
                  setFieldErrors={handleSetFieldErrors}
                />
              </Col>
              <Col>
                <FormGroupSelect<Categoria>
                  orientation={Col}
                  options={categorias}
                  getOptionLabel={(cat) => cat.denominacion}
                  getOptionValue={(cat) => String(cat.id)}
                  onChange={(option: any | null) => {
                    onChange(option, "categoria");
                    setSelectedCategoria(option);
                  }}
                  selectedOption={articuloManufacturado.categoria}
                  label={"Seleccionar una Categoría"}
                  name="categoria"
                />
              </Col>
              <Col>
                <FormGroupSelect<UnidadMedida>
                  orientation={Col}
                  options={unidadesMedida}
                  getOptionLabel={(unidad) => unidad.denominacion}
                  getOptionValue={(unidad) => String(unidad.id)}
                  onChange={(option: any | null) => {
                    onChange(option, "unidadMedida");
                    setSelectedUnidadMedida(option);
                  }}
                  selectedOption={articuloManufacturado.unidadMedida}
                  label={"Seleccionar una Medida"}
                  name="unidadMedida"
                />
              </Col>
            </Row>

            <Row className="justify-content-end">
              <Col xs={13} md={13} lg={13}>
                <ImagenCarousel
                  imagenesExistentes={articuloManufacturado.imagenes}
                  onFilesChange={handleFileChange}
                  onImagenesChange={handleImagenesChange}
                />
              </Col>
            </Row>

            {showModal && (
              <Row>
                <AgregarInsumosModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  title={title}
                  articulosExistentes={
                    detalles
                      ? detalles
                        .filter((detalle) => detalle.articuloInsumo !== null)
                        .map(
                          (detalle) =>
                            detalle.articuloInsumo as ArticuloInsumo
                        )
                      : []
                  }
                  handleSave={handleSeleccionInsumos}
                />
              </Row>
            )}

            <Row className="p-5">
              <Button
                className="mb-2"
                variant="primary"
                onClick={() => handleOpenModal("Agregar Insumos")}
              >
                Editar Insumos
              </Button>
              {articuloManufacturado.articuloManufacturadoDetalles && (
                <ArticuloManufacturadoDetalleTable
                  detalles={detalles}
                  onCantidadChange={handleCantidadChange}
                />
              )}
            </Row>

            <Button className="m-2 p-2" variant="primary" type="submit">
              Guardar
            </Button>

            <Row>
              {submitError && <h4 className="text-danger">{submitError}</h4>}
            </Row>
          </Form>
        </>
      )}
    </>
  );
};
