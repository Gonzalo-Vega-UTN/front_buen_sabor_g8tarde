import { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { StateType } from "../../types/StateType";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ProductServices } from "../../services/ProductServices";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";
import { toast } from "react-toastify";
import { getIn } from "formik";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { ArticuloManufacturado } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import { ArticuloManufacturadoDetalle } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturadoDetalle";

type ProductModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  prod: ArticuloManufacturado;
  products: React.Dispatch<React.SetStateAction<ArticuloManufacturado[]>>;
};

export default function ProductModal({
  show,
  onHide,
  title,
  modalType,
  prod,
  products,
}: ProductModalProps) {
  const [ingredients, setIngredients] = useState<ArticuloInsumo[]>([]);

  useEffect(() => {
    const fetchArticuloInsumo = async () => {
      const ArticuloInsumo = await ArticuloInsumosServices.getArticuloInsumo();
      setIngredients(ArticuloInsumo);
    };
    fetchArticuloInsumo();
  }, []);

  const handleSaveUpdate = async (pro: ArticuloManufacturado) => {
    try {
      const isNew = pro.id === 0;
      if (isNew) {
        const newProduct = await ProductServices.createProduct(pro);
        let updateData = (prevProducts: any) => [...prevProducts, newProduct];
        products(updateData);
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

  const handleDelete = async () => {
    try {
      await ProductServices.deleteProduct(prod.id);
      products((prevProducts) =>
        prevProducts.filter((products) => products.id !== prod.id)
      );
      toast.success("Producto eliminado con exito", {
        position: "top-center",
      });
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };

  const validationSchema = () => {
    return Yup.object().shape({
      denominacion: Yup.string().required("El nombre es requerido"),
      descripcion: Yup.string().required("La descripcion es requerida"),
      preparacion: Yup.string().required("La preparacion es requerida"),
      // alta: Yup.number().required("El alta es requerida"),
      tiempoEstimadoMinutos: Yup.number()
        .min(0)
        .required("El tiempo de cocina es requerido"),
      //url_Imagen: Yup.string().required("La URL de la imagen es requerida"),
      precioVenta: Yup.number()
        .min(0)
        .required("El precio de Venta es requerido"),
    });
  };

  const initialValues = {
    ...prod,
    detallesArtManufacturado: prod.articuloManufacturadoDetalles || [],
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: ArticuloManufacturado) => handleSaveUpdate(obj),
  });

  const addIngredient = () => {
    formik.setFieldValue("detallesArtManufacturado", [
      ...formik.values.articuloManufacturadoDetalles as ArticuloManufacturadoDetalle[],
      { cantidad: 0, articuloInsumo: { id: "", denominacion: "" } },
    ]);
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = [...formik.values.articuloManufacturadoDetalles as ArticuloManufacturadoDetalle[]];
    updatedIngredients.splice(index, 1);
    formik.setFieldValue("detallesArtManufacturado", updatedIngredients);
  };

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <>
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {"¿Esta seguro que desea eliminar el producto?"}
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
        </>
      ) : (
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
              <Form onSubmit={formik.handleSubmit}>
                <Row className="mb-4">
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
                  <Form.Group as={Col} controlId="formReceta">
                    <Form.Label> Preparacion </Form.Label>
                    <Form.Control
                      name="preparacion"
                      type="text"
                      value={formik.values.preparacion || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.preparacion && formik.touched.preparacion
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.preparacion}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-5">
                  <Form.Group as={Col} controlId="formTiempoCocina">
                    <Form.Label> Tiempo de Cocina </Form.Label>
                    <Form.Control
                      name="tiempoEstimadoMinutos"
                      type="number"
                      value={formik.values.tiempoEstimadoMinutos || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.tiempoEstimadoMinutos &&
                        formik.touched.tiempoEstimadoMinutos
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.tiempoEstimadoMinutos}
                    </Form.Control.Feedback>
                  </Form.Group>

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

                  <Form.Group as={Col} controlId="formIngredient">
                    <Form.Label>Ingredientes</Form.Label>
                    {formik.values.articuloManufacturadoDetalles?.map((detalle, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <Form.Select
                          name={`detallesArtManufacturado[${index}].articuloInsumo.id`}
                          value={detalle.articuloInsumo?.id || ""}
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
                          value={detalle.cantidad || ""}
                          onChange={(e) => {
                            const updatedIngredients = [...formik.values.articuloManufacturadoDetalles as ArticuloManufacturadoDetalle[]];
                            updatedIngredients[index].cantidad = parseInt(e.target.value);
                            formik.setFieldValue("detallesArtManufacturado", updatedIngredients);
                          }}
                          placeholder="Cantidad"
                        />
                        <Form.Control
                          type="text"
                          value={detalle.articuloInsumo?.unidadMedida ? detalle.articuloInsumo?.unidadMedida.denominacion : ''}
                          readOnly
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
                    <Button variant="primary" onClick={() => addIngredient()}>
                      Agregar Ingrediente
                    </Button>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formEstado">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      name="alta"
                      value={formik.values.alta ? 1 : 0}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.alta &&
                        formik.touched.alta
                      )}
                    >
                      <option value={1}>Alta</option>
                      <option value={0}>Baja</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.alta}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Modal.Footer className="mt-4">
                  <Button variant="secondary" onClick={onHide}>
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!formik.isValid}
                  >
                    Guardar
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
}
