import React, { useEffect, useState } from "react";
import { Row, Form, Button, Col, Table } from "react-bootstrap";
import { ArticuloManufacturado } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import { UnidadMedida } from "../../entities/DTO/UnidadMedida/UnidadMedida";
import { UnidadMedidaServices } from "../../services/UnidadMedidaServices";
import { BsTrashFill } from "react-icons/bs";
import CustomButton from "../generic/Button";
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
  categoria: string;
  descripcion: string;
  tiempoEstimadoMinutos: string;
  preparacion: string;
  articuloManufacturadoDetalles: string;
}

const Formulario = ({ articuloExistente, onHide, handleSave }: FormProps) => {
  const [articulo, setArticulo] = useState<ArticuloManufacturado>(articuloExistente);
  const [selectedOption, setSelectedOption] = useState(articuloExistente?.categoria?.denominacion || "");
  const [selectedOptionUnidad, setSelectedOptionUnidad] = useState(articuloExistente?.unidadMedida?.denominacion || "");
  const [selectedOptionIngrediente, setSelectedOptionIngrediente] = useState<ArticuloInsumo>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [ingredientes, setIngredientes] = useState<ArticuloInsumo[]>([]);
  const [errors, setErrors] = useState<Partial<Errors>>({});

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
    if (name === "precioVenta" || name === "tiempoEstimadoMinutos") {
      try {
        if (Number(value) <= 0) {
          setErrors({
            ...errors,
            [name]: "El valor debe ser mayor a cero",
          });
        }
      } catch (error) {
        setErrors({
          ...errors,
          [name]: "El valor debe ser un número",
        });
      }
    }
  };

  const handleDeleteIngrediente = (event: React.MouseEvent<HTMLButtonElement>, idDetalle: number) => {
    event.preventDefault();
    setArticulo(prevArticulo => {
      const nuevosDetalles = [...(prevArticulo.articuloManufacturadoDetalles || [])];
      const updatedDetalles = nuevosDetalles.filter(detalle => detalle.id !== idDetalle);
      return { ...prevArticulo, articuloManufacturadoDetalles: updatedDetalles };
    });
  };

  const handleChangeSelectCategoria = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    const categoriaSeleccionada = categorias.find(cat => cat.denominacion === value);
    if (categoriaSeleccionada) {
      setArticulo(prev => ({
        ...prev,
        categoria: categoriaSeleccionada
      }));
    }
    setErrors({
      ...errors,
      categoria: undefined,
    });
  };

  const handleClickAgregarIngrediente = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedOptionIngrediente) {
      const detalleNuevo = new ArticuloManufacturadoDetalle();
      detalleNuevo.alta = true;
      detalleNuevo.articuloInsumo = selectedOptionIngrediente;
      detalleNuevo.cantidad = 0;

      setArticulo(prev => ({
        ...prev,
        articuloManufacturadoDetalles: [...(prev.articuloManufacturadoDetalles || []), detalleNuevo]
      }));
    }
  };

  const handleChangeSelectUnidadMedida = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOptionUnidad(value);
    const unidadMedidaSeleccionada = unidadesMedida.find(unidad => unidad.denominacion === value);
    if (unidadMedidaSeleccionada) {
      setArticulo(prev => ({
        ...prev,
        unidadMedida: unidadMedidaSeleccionada
      }));
    }
    setErrors({
      ...errors,
      unidadMedida: undefined,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    setArticulo(prevArticulo => {
      const nuevosDetalles = [...(prevArticulo.articuloManufacturadoDetalles || [])];
      const detalleToUpdate = nuevosDetalles.find(detalle => detalle.id === idDetalle);
      if (detalleToUpdate) {
        detalleToUpdate.cantidad = cantidad;
      }
      return { ...prevArticulo, articuloManufacturadoDetalles: nuevosDetalles };
    });
  };

  const handleChangeIngrediente = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "") {
      const idIngrediente = Number(e.target.value);
      const ingredienteSeleccionadoNuevo = ingredientes.find(ingrediente => ingrediente.id === idIngrediente);
      setSelectedOptionIngrediente(ingredienteSeleccionadoNuevo || undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOptionUnidad) {
      setErrors({
        ...errors,
        unidadMedida: 'Debes seleccionar una unidad de medida',
      });
    }
    if (!selectedOption) {
      setErrors({
        ...errors,
        categoria: 'Debes seleccionar una categoría',
      });
    }
    if (Object.values(errors).every(error => !error)) {
      handleSave(articulo);
      onHide();
    }
  };

  return (
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
          <Form.Select onChange={handleChangeIngrediente}>
            <option value={""}>Seleccionar...</option>
            {ingredientes.filter(ingrediente => {
              return !articulo.articuloManufacturadoDetalles?.some(detalle => detalle.articuloInsumo?.id === ingrediente.id);
            }).map(ingredienteFiltrado => (
              <option key={ingredienteFiltrado.id} value={ingredienteFiltrado.id}>
                {ingredienteFiltrado.denominacion}
              </option>
            ))}
          </Form.Select>
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
          <tbody>
            {articulo.articuloManufacturadoDetalles?.map((detalle) => (
              <tr key={detalle.articuloInsumo?.denominacion} className="text-center">
                <td>{detalle.articuloInsumo?.id}</td>
                <td>{detalle.articuloInsumo?.denominacion}</td>
                <td>{detalle.articuloInsumo?.unidadMedida?.denominacion}</td>
                <td>
                  <input
                    type="number"
                    step={0.1}
                    value={(detalle.cantidad)?.toString()}
                    onChange={(e) => handleChangeIngredienteCantidad(e, detalle.id)}
                  />
                </td>
                <td>
                  <CustomButton color="#D32F2F" size={20} icon={BsTrashFill} onClick={(e) => handleDeleteIngrediente(e, detalle.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>

      <Button variant="secondary" onClick={onHide}>
        Cancelar
      </Button>
      <Button className="m-2 p-2" variant="primary" type="submit" >Guardar</Button>
    </Form>
  );
};

export default Formulario;
