import { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { Product } from "../../types/Product";
import { StateType } from "../../types/StateType";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ProductServices } from "../../services/ProductServices";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";
import { toast } from "react-toastify";
import { getIn } from "formik";

type ProductModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  prod: Product;
  products: React.Dispatch<React.SetStateAction<Product[]>>;
};

export default function ProductModal({
  show,
  onHide,
  title,
  modalType,
  prod,
  products,
}: ProductModalProps) {
<<<<<<< Updated upstream
  // Estado que contiene los rubros recibidos de nuestra API
  // Estado que contiene los ingredientes recibidos de nuestra API
  const [ingredients, setIngredients] = useState<ArticuloInsumo[]>([]);

  // Usamos este hook para obtener los INGREDIENTES cada vez que se renderice el componente
=======
  const [ingredients, setIngredients] = useState<ArticuloInsumo[]>([]);
  
>>>>>>> Stashed changes
  useEffect(() => {
    const fetchArticuloInsumo = async () => {
      try {
        const articuloInsumo = await ArticuloInsumosServices.getArticuloInsumo();
        setIngredients(articuloInsumo);
      } catch (error) {
        console.error(error);
        // Manejo de errores
      }
    };
    fetchArticuloInsumo();
  }, []);

<<<<<<< Updated upstream
  // CREATE - ACTUALIZAR
=======
>>>>>>> Stashed changes
  const handleSaveUpdate = async (pro: Product) => {
    try {
      const isNew = pro.id === 0;
      if (isNew) {
        const newProduct = await ProductServices.createProduct(pro);
        products((prevProducts) => [...prevProducts, newProduct]);
      } else {
        await ProductServices.updateProduct(pro.id, pro);
        products((prevProducts) =>
          prevProducts.map((product) => (product.id === pro.id ? pro : product))
        );
      }
      toast.success(isNew ? "Producto creado" : "Producto actualizado", {
        position: "top-center",
      });
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };

<<<<<<< Updated upstream
  // DELETE
=======
>>>>>>> Stashed changes
  const handleDelete = async () => {
    try {
      await ProductServices.deleteProduct(prod.id);
      products((prevProducts) =>
        prevProducts.filter((product) => product.id !== prod.id)
      );
      toast.success("Producto eliminado con éxito", {
        position: "top-center",
      });
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };

<<<<<<< Updated upstream
  // Yup, esquema de validacion
=======
>>>>>>> Stashed changes
  const validationSchema = () => {
    return Yup.object().shape({
      denominacion: Yup.string().required("El nombre es requerido"),
      descripcion: Yup.string().required("La descripción es requerida"),
      receta: Yup.string().required("La receta es requerida"),
      tiempoEstimadoCocina: Yup.number()
        .min(0)
        .required("El tiempo de cocina es requerido"),
      url_Imagen: Yup.string().required("La URL de la imagen es requerida"),
      precioVenta: Yup.number()
        .min(0)
        .required("El precio de venta es requerido"),
      detallesArtManufacturado: Yup.array().of(
        Yup.object().shape({
          cantidad: Yup.number().required("La cantidad es requerida"),
          articuloInsumo: Yup.object().shape({
            id: Yup.string().required(),
            denominacion: Yup.string().required(),
            descripcion: Yup.string(),
            precioVenta: Yup.number(),
            estadoArticulo: Yup.string(),
            precioCompra: Yup.number(),
            stockActual: Yup.number(),
            stockMinimo: Yup.number(),
            unidadMedida: Yup.object(),
            url_Imagen: Yup.string(),
          }),
        })
      ),
    });
  };

<<<<<<< Updated upstream
  // Inicializar detallesArtManufacturado como un array vacío si no está definido en prod
  const initialValues = {
    ...prod,
    detallesArtManufacturado: prod.detallesArtManufacturado || [],
  };

  // Formik, crea formulario dinamico y lo bloquea en caso de haber errores
=======
>>>>>>> Stashed changes
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Product) => handleSaveUpdate(obj),
  });

  const addIngredient = () => {
    formik.setFieldValue("detallesArtManufacturado", [
      ...formik.values.detallesArtManufacturado,
      { cantidad: 0, articuloInsumo: { id: "", denominacion: "" } },
    ]);
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = [...formik.values.detallesArtManufacturado];
    updatedIngredients.splice(index, 1);
    formik.setFieldValue("detallesArtManufacturado", updatedIngredients);
  };

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Está seguro que desea eliminar el producto?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
<<<<<<< Updated upstream
        <>
          <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            className="modal-xl"
          >
            <Modal.Header>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Formulario */}
              <Form onSubmit={formik.handleSubmit}>
                <Row className="mb-4">
                  {/* Nombre */}
                  <Form.Group as={Col} controlId="formNombre">
                    <Form.Label> Nombre </Form.Label>
                    <Form.Control
                      name="denominacion"
                      type="text"
                      value={formik.values.denominacion || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.denominacion &&
                        formik.touched.denominacion
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.denominacion}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Descripcion */}
                  <Form.Group as={Col} controlId="formDescripcion">
                    <Form.Label> Descripcion </Form.Label>
                    <Form.Control
                      name="descripcion"
                      type="text"
                      value={formik.values.descripcion || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.descripcion && formik.touched.descripcion
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.descripcion}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  {/* Receta */}
                  <Form.Group as={Col} controlId="formReceta">
                    <Form.Label> Receta </Form.Label>
                    <Form.Control
                      name="receta"
                      type="text"
                      value={formik.values.receta || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.receta && formik.touched.receta
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.receta}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Imagen */}
                  <Form.Group as={Col} controlId="formImagen">
                    <Form.Label> Imagen </Form.Label>
                    <Form.Control
                      name="url_Imagen"
                      type="text"
                      value={formik.values.url_Imagen || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.url_Imagen && formik.touched.url_Imagen
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.url_Imagen}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-5">
                  {/* Tiempo de Cocina */}
                  <Form.Group as={Col} controlId="formTiempoCocina">
                    <Form.Label> Tiempo de Cocina </Form.Label>
                    <Form.Control
                      name="tiempoEstimadoCocina"
                      type="number"
                      value={formik.values.tiempoEstimadoCocina || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.tiempoEstimadoCocina &&
                        formik.touched.tiempoEstimadoCocina
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.tiempoEstimadoCocina}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Precio de Venta */}
                  <Form.Group as={Col} controlId="formPrecioVenta">
                    <Form.Label> Precio de Venta </Form.Label>
                    <Form.Control
                      name="precioVenta"
                      type="number"
                      value={formik.values.precioVenta}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.precioVenta && formik.touched.precioVenta
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.precioVenta}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Ingrediente */}
                  <Form.Group as={Col} controlId="formIngredient">
  <Form.Label>Ingredientes</Form.Label>
  {formik.values.detallesArtManufacturado.map((detalle, index) => (
    <div key={index} className="d-flex align-items-center mb-2">
      <Form.Select
        name={`detallesArtManufacturado[${index}].articuloInsumo.id`}
        value={detalle.articuloInsumo.id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={
          Boolean(
            getIn(
              formik.errors,
              `detallesArtManufacturado[${index}].articuloInsumo.id`
            ) &&
            getIn(
              formik.touched,
              `detallesArtManufacturado[${index}].articuloInsumo.id`
            )
          )
        }
      >
        <option value="">Selecciona un ingrediente</option>
        {ingredients.map((ingrediente) => (
          <option key={ingrediente.id} value={ingrediente.id}>
            {ingrediente.denominacion}
          </option>
        ))}
      </Form.Select>
      <Form.Control
        type="number"
        value={detalle.cantidad}
        onChange={(e) => {
          const updatedIngredients = [...formik.values.detallesArtManufacturado];
          updatedIngredients[index].cantidad = parseInt(e.target.value);
          formik.setFieldValue("detallesArtManufacturado", updatedIngredients);
        }}
        placeholder="Cantidad"
      />
      <Button
        variant="outline-danger"
        className="ms-2"
        onClick={() => removeIngredient(index)}
      >
        X
      </Button>
    </div>
  ))}
  <Button variant="primary" onClick={() => addIngredient()}>
    Agregar Ingrediente
  </Button>
</Form.Group>


                  {/* Estado */}
                  <Form.Group as={Col} controlId="formEstado">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      name="estadoArticulo"
                      value={formik.values.estadoArticulo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.estadoArticulo &&
                        formik.touched.estadoArticulo
                      )}
                    >
                      <option value={StateType.Alta}>Alta</option>
                      <option value={StateType.Baja}>Baja</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.estadoArticulo}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Modal.Footer className="mt-4">
                  <Button variant="secondary" onClick={onHide}>
                    {" "}
                    Cancelar{" "}
=======
        <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="mb-4">
                {/* Resto del formulario */}
              </Row>
              <Row className="mb-5">
                <Form.Group as={Col} controlId="formIngredient">
                  <Form.Label>Ingredientes</Form.Label>
                  {formik.values.detallesArtManufacturado.map((detalle, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <Form.Select
                        name={`detallesArtManufacturado[${index}].articuloInsumo.id`}
                        value={detalle.articuloInsumo.id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Selecciona un ingrediente</option>
                        {ingredients.map((ingrediente) => (
                          <option key={ingrediente.id} value={ingrediente.id}>
                            {ingrediente.denominacion}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control
                        type="number"
                        name={`detallesArtManufacturado[${index}].cantidad`}
                        value={detalle.cantidad}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Cantidad"
                        className="ms-2"
                      />
                      <Button
                        variant="outline-danger"
                        className="ms-2"
                        onClick={() => removeIngredient(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  <Button variant="primary" onClick={addIngredient}>
                    Agregar Ingrediente
>>>>>>> Stashed changes
                  </Button>
                </Form.Group>
              </Row>
              <Modal.Footer className="mt-4">
                <Button variant="secondary" onClick={onHide}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={!formik.isValid}>
                  Guardar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
