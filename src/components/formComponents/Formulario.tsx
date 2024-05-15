import { useEffect, useState } from "react";
import { Row, Form, Button, Col, Table } from "react-bootstrap";
import { ArticuloManufacturado } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import { UnidadMedida } from "../../entities/DTO/UnidadMedida/UnidadMedida";
import { UnidadMedidaServices } from "../../services/UnidadMedidaServices";
import { BsTrashFill } from "react-icons/bs";
import CustomButton from "../generic/Button";
import { number } from "yup";
import { ArticuloManufacturadoDetalle } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturadoDetalle";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";
interface FormProps {
  onHide: () => void;
  articuloExistente: ArticuloManufacturado;
  handleSave: (newProduct: ArticuloManufacturado) => void;
}
interface Errors {
  denominacion: string;
  precioVenta: string;
  unidadMedida: string;
  //imagenes: string;
  categoria: string;
  //promocionDetalle: string;
  descripcion: string;
  tiempoEstimadoMinutos: string;
  preparacion: string;
  articuloManufacturadoDetalles: string;
}
const Formulario = ({ articuloExistente, onHide, handleSave }: FormProps) => {

  const [articulo, setArticulo] = useState<ArticuloManufacturado>(articuloExistente);
  const [selectedOption, setSelectedOption] = useState(articuloExistente ? articuloExistente.categoria?.denominacion : "");
  const [selectedOptionUnidad, setSelectedOptionUnidad] = useState(articuloExistente ? articuloExistente.unidadMedida?.denominacion : "");
  const [selectedOptionIngrediente, setSelectedOptionIngrediente] = useState<ArticuloInsumo>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [ingredientes, setIngredientes] = useState<ArticuloInsumo[]>([]);
  const [errors, setErrors] = useState<Partial<Errors>>({});


  // Actualiza el estado del artículo si cambia el artículo existente
  useEffect(() => {
    if (articuloExistente) {
      setArticulo(articuloExistente);
    }

  }, [articuloExistente]);

  useEffect(() => {
    const fetchData = async () => {
      const ingredientes = await ArticuloInsumosServices.getArticuloInsumo();
      setIngredientes(ingredientes);
    };

    fetchData();

  }, []);
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setArticulo(prevArticulo => ({
      ...prevArticulo,
      [name]: value
    }));
    if (name === "precioVenta") {
      try {
        if (Number(value) <= 0) {
          setErrors({
            ...errors,
            precioVenta: "El valor debe ser mayor a cero",
          });
        }
      } catch (error) {
        setErrors({
          ...errors,
          precioVenta: "El valor debe ser un numero",
        });
      }
    }
    if (name === "tiempoEstimadoMinutos") {
      try {
        if (Number(value) <= 0) {
          setErrors({
            ...errors,
            tiempoEstimadoMinutos: "El valor debe ser mayor a cero",
          });
        }
      } catch (error) {
        setErrors({
          ...errors,
          tiempoEstimadoMinutos: "El valor debe ser un numero",
        });
      }
    }
  };
  const handleDeleteIngrediente = (event: React.FormEvent, idDetalle: number) => {
    event.preventDefault()
    setArticulo(prevArticulo => {
      const nuevosDetalles = [...prevArticulo.articuloManufacturadoDetalles as ArticuloManufacturadoDetalle[]];
      articulo.articuloManufacturadoDetalles = nuevosDetalles.filter(detalle => detalle.id !== idDetalle);
      return { ...prevArticulo, articuloManufacturadoDetalles: nuevosDetalles };
    });

  }

  const handleChangeSelectCategoria = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    const categoriaSeleccionada = categorias.filter(cat => cat.denominacion === value)[0];
    if (categoriaSeleccionada) {
      setArticulo(prev => ({
        ...prev,
        categoria: categoriaSeleccionada
      }));
    }
    // Limpia el error del select
    setErrors({
      ...errors,
      categoria: undefined,
    });
  };

  const handleClickAgregarIngrediente = (event: React.FormEvent) => {
    event.preventDefault()
    if (selectedOptionIngrediente) {
      console.log(selectedOptionIngrediente);
      const detalleNuevo = new ArticuloManufacturadoDetalle();
      detalleNuevo.alta = true;
      detalleNuevo.articuloInsumo = selectedOptionIngrediente;
      detalleNuevo.cantidad = 0;

      console.log(detalleNuevo);

      setArticulo(prev => ({
        ...prev,
        articuloManufacturadoDetalles: [...prev.articuloManufacturadoDetalles as ArticuloManufacturadoDetalle[], detalleNuevo]
      }));
    }


  }

  const handleChangeSelectUnidadMedida = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    console.log(value);
    setSelectedOptionUnidad(value);
    const unidadMedidaSeleccionada = unidadesMedida.filter(unidad => unidad.denominacion === value)[0];
    if (unidadMedidaSeleccionada) {
      setArticulo(prev => ({
        ...prev,
        unidadMedida: unidadMedidaSeleccionada
      }));
    }
    // Limpia el error del select
    setErrors({
      ...errors,
      unidadMedida: undefined,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Realiza la validación correspondiente según tus requisitos
    // Por ejemplo, campo requerido
    if (!value.trim()) {
      setErrors({
        ...errors,
        [name]: 'Este campo es requerido',
      });
    } else {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleChangeIngredienteCantidad = (e: React.ChangeEvent<HTMLInputElement>, idDetalle: number) => {
    const cantidad = Number(e.target.value);
    console.log(cantidad);
    setArticulo(prevArticulo => {
      const nuevosDetalles = [...prevArticulo.articuloManufacturadoDetalles as ArticuloManufacturadoDetalle[]];
      nuevosDetalles.filter(detalle => detalle.id === idDetalle)[0].cantidad = cantidad
      return { ...prevArticulo, articuloManufacturadoDetalles: nuevosDetalles };
    });
  }

  const handleChangeIngrediente = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "") {
      const idIngrediente = Number(e.target.value)
      const ingredienteSeleccionadoNuevo = ingredientes.filter(ingrediente => ingrediente.id === idIngrediente)[0]
      setSelectedOptionIngrediente(ingredienteSeleccionadoNuevo)

    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    console.log(errors);

    e.preventDefault();
    // Verifica si hay errores antes de enviar el formulario
    if (!selectedOptionUnidad) {
      // If no option is selected, set an error
      setErrors({
        ...errors,
        unidadMedida: 'Debes seleccionar una unidad de medida',
      });
    }
    if (!selectedOption) {
      // If no option is selected, set an error
      setErrors({
        ...errors,
        categoria: 'Debes seleccionar una categoría',
      });
    }
    if (Object.values(errors).every(error => !error)) {
      // Envía el formulario si no hay errores
      console.log('Formulario enviado:', articulo);
      handleSave(articulo);
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Form.Group as={Col} controlId="formNombre">
            <Form.Label> Nombre </Form.Label>
            <Form.Control
              name="denominacion"
              type="text"
              value={articulo.denominacion}
              onChange={handleChange}
              onBlur={handleBlur}

            />
            {errors.denominacion && <span className="text-danger">{errors.denominacion}</span>}
          </Form.Group>

          <Form.Group as={Col} controlId="formCategoria">
            <Form.Label>Seleccionar Categoria</Form.Label>
            <Form.Select
              value={selectedOption}
              onChange={handleChangeSelectCategoria}
              aria-label="Seleccionar una opcion"
            >
              <option value="">Seleccionar...</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.denominacion}>{cat.denominacion}</option>
              ))}
            </Form.Select>
            {errors.categoria && <span className="text-danger">{errors.categoria}</span>}
          </Form.Group>

          <Form.Group as={Col} controlId="unidadMedidaForm">
            <Form.Label>Seleccionar Unidad Medida</Form.Label>
            <Form.Select
              value={selectedOptionUnidad}
              onChange={handleChangeSelectUnidadMedida}
              aria-label="Seleccionar una opcion"
            >
              <option value="">Seleccionar...</option>
              {unidadesMedida.map(unidad => (
                <option key={unidad.id} value={unidad.denominacion}>{unidad.denominacion}</option>
              ))}
            </Form.Select>
            {errors.unidadMedida && <span className="text-danger">{errors.unidadMedida}</span>}
          </Form.Group>

          <Form.Group as={Row} controlId="formDescripcion">
            <Form.Label> Descripcion </Form.Label>
            <Form.Control
              as={"textarea"}
              style={{ resize: 'none' }}
              name="descripcion"
              type="text"
              value={articulo.descripcion}
              onChange={handleChange}
              onBlur={handleBlur}

            />
            {errors.descripcion && <span className="text-danger">{errors.descripcion}</span>}
          </Form.Group>

          <Form.Group as={Row} controlId="formPreparacion">
            <Form.Label> Preparacion </Form.Label>
            <Form.Control
              as={"textarea"}
              style={{ resize: 'none' }}
              name="preparacion"
              type="text"
              value={articulo.preparacion}
              onChange={handleChange}
              onBlur={handleBlur}

            />
            {errors.preparacion && <span className="text-danger">{errors.preparacion}</span>}
          </Form.Group>

          <Form.Group as={Col} controlId="formPrecioVenta">
            <Form.Label> Precio Venta </Form.Label>
            <Form.Control
              name="precioVenta"
              type="number"
              value={articulo.precioVenta}
              onChange={handleChange}
              onBlur={handleBlur}

            />
            {errors.precioVenta && <span className="text-danger">{errors.precioVenta}</span>}
          </Form.Group>

          <Form.Group as={Col} controlId="tiempoEstimadoMinutosForm">
            <Form.Label> Tiempo de Preparacion </Form.Label>
            <Form.Control
              name="tiempoEstimadoMinutos"
              type="number"
              value={articulo.tiempoEstimadoMinutos}
              onChange={handleChange}
              onBlur={handleBlur}

            />
            {errors.tiempoEstimadoMinutos && <span className="text-danger">{errors.tiempoEstimadoMinutos}</span>}
          </Form.Group>


        </Row>

        <Row>
          <h2>Ingredientes</h2>
          <Col>
            <select name="" id="" onChange={handleChangeIngrediente}>
              <option value={""}>Selecionar</option>
              {ingredientes.filter(ingrediente => {
                // Filtrar los ingredientes que no están en el array de detalles
                return !articulo.articuloManufacturadoDetalles?.some(detalle => detalle.articuloInsumo?.id === ingrediente.id);
              }).map(ingredienteFiltrado => (
                <option key={ingredienteFiltrado.id} value={ingredienteFiltrado.id}>
                  {ingredienteFiltrado.denominacion}
                </option>
              ))}
            </select>
            <Button className="m-2" onClick={handleClickAgregarIngrediente}>Agregar</Button>
          </Col>
          <Table hover>
            <thead>
              <tr className="text-center">
                <th>ID</th>
                <th>Nombre</th>
                <th>Unidad Medida</th>
                <th>Cantidad</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            {articulo.articuloManufacturadoDetalles === null ? <tbody></tbody> :



              <tbody>
                {articulo.articuloManufacturadoDetalles.map((detalle) => (
                  <tr key={detalle.articuloInsumo?.denominacion} className="text-center">
                    <td>{detalle.articuloInsumo?.id}</td>
                    <td>{detalle.articuloInsumo?.denominacion}</td>
                    <td>{detalle.articuloInsumo?.unidadMedida?.denominacion}</td>
                    <td><input type="number" step={0.1}
                      value={(detalle.cantidad)?.toString()}
                      onChange={() => handleChangeIngredienteCantidad(event, detalle.id)}
                    /></td>
                    <td>
                      <CustomButton color="#D32F2F" size={20} icon={BsTrashFill} onClick={() => {
                        handleDeleteIngrediente(event, detalle.id)
                      }} />
                    </td>

                  </tr>
                ))}
              </tbody>}

          </Table>
        </Row>

        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button className="m-2 p-2" variant="primary" type="submit">Guardar</Button>
      </Form>

    </>
  )
}

export default Formulario