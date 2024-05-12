import { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { UnidadMedida } from "../../types/UnidadMedida";
import { StateType } from "../../types/StateType";
import { Rubro } from "../../types/Rubro";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";
import { UnidadMedidaServices } from "../../services/UnidadMedidaServices";
import { RubroServices } from "../../services/RubroServices";
import { toast } from "react-toastify";

type ArticuloInsumoModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  articulo: ArticuloInsumo;
  articulosInsumos: React.Dispatch<React.SetStateAction<ArticuloInsumo[]>>;
};

export default function ArticuloInsumoModal({
  show,
  onHide,
  title,
  modalType,
  articulo,
  articulosInsumos,
}: ArticuloInsumoModalProps) {
  //Estado que contiene las unidades de medida recibidos de nuestra API
  const [unidad, setUnidad] = useState<UnidadMedida[]>([]);

  //Estado que contiene los rubros recibidos de nuestra API
  const [rubros, setRubros] = useState<Rubro[]>([]);

  //Usamos este hook para obtener los rubros cada vez que se renderice el componente
  useEffect(() => {
    const fetchRubros = async () => {
      const rubros = await RubroServices.getRubros();
      setRubros(rubros);
    };
    fetchRubros();
  }, []);

  //Usamos este hook para obtener las unidades de medida cada vez que se renderice el componente
  useEffect(() => {
    const fetchUnidadMedida = async () => {
      const unidad = await UnidadMedidaServices.getUnidadMedida();
      setUnidad(unidad);
    };
    fetchUnidadMedida();
  }, []);

  //CREATE - ACTUALIZAR
  const handleSaveUpdate = async (art: ArticuloInsumo) => {
    try {
      const isNew = art.id === 0;
      if (isNew) {
        const newArticuloInsumo =
          await ArticuloInsumosServices.createArticuloInsumo(art);
        let updateData = (prevArtInsumo: any) => [
          ...prevArtInsumo,
          newArticuloInsumo,
        ];
        articulosInsumos(updateData); // Agregar el nuevo producto al final del arreglo
      } else {
        await ArticuloInsumosServices.updateArticuloInsumo(art.id, art);
        articulosInsumos((prevArtInsumo) =>
          prevArtInsumo.map((rubroEdit) =>
            rubroEdit.id === art.id ? art : rubroEdit
          )
        );
      }

      toast.success(isNew ? "Ingrediente creado" : "Ingrediente actualizado", {
        position: "top-center",
      });

      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };

  //DELETE
  const handleDelete = async () => {
    try {
      await ArticuloInsumosServices.deleteArticuloInsumo(articulo.id);
      articulosInsumos((prevArtInsumo) =>
        prevArtInsumo.filter((insumo) => insumo.id !== articulo.id)
      );
      toast.success("Ingrediente eliminado con exito", {
        position: "top-center",
      });
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };

  // Yup, esquema de validación
  const validationSchema = () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      denominacion: Yup.string().required("El nombre es requerido"),
      rubro: Yup.object().shape({
        id: Yup.number().integer().min(0),
        denominacion: Yup.string().required("El rubro es requerido"),
      }),
      unidadMedida: Yup.object().shape({
        id: Yup.number().integer().min(0),
        denominacion: Yup.string().required("La unidad de medida es requerida"),
      }),
      precioCompra: Yup.number()
        .integer()
        .min(0)
        .required("El precio de compra es requerido"),
      precioVenta: Yup.number()
        .integer()
        .min(0)
        .required("El precio de venta es requerido"),
      stockActual: Yup.number()
        .integer()
        .min(0)
        .required("El stock actual es requerido"),
      stockMinimo: Yup.number()
        .integer()
        .min(0)
        .required("El stock minimo es requerido"),
    });
  };

  //Formik, crea formulario dinamico y lo bloquea en caso de haber errores
  const formik = useFormik({
    initialValues: articulo,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: ArticuloInsumo) => handleSaveUpdate(obj),
  });

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <>
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>¿Esta seguro que desea eliminar el ingrediente?</p>
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
              {/* Formulario */}
              <Form onSubmit={formik.handleSubmit}>
                <Row>
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

                  {/* Unidad de Medida */}
                  <Form.Group as={Col} controlId="formUnidadMedida">
                    <Form.Label>Unidad de Medida</Form.Label>

                    <Form.Select
                      name="unidadMedida"
                      value={
                        formik.values.unidadMedida
                          ? formik.values.unidadMedida.id
                          : ""
                      }
                      onChange={(e) => {
                        const selectedUnidadId = e.target.value;
                        const selectedUnidad = unidad.find(
                          (unidad) => unidad.id === parseInt(selectedUnidadId)
                        );

                        // Setea el objeto completo de unidad de medida
                        formik.setFieldValue("unidadMedida", selectedUnidad);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.unidadMedida?.denominacion &&
                          formik.touched.unidadMedida?.denominacion
                      )}
                    >
                      <option value="">Selecciona una unidad de Medida</option>
                      {unidad.map((unidad) => (
                        <option key={unidad.id} value={unidad.id}>
                          {unidad.denominacion}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.unidadMedida?.denominacion}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Tipo Rubro */}
                  <Form.Group as={Col} controlId="formTipoRubro">
                    <Form.Label>Tipo Rubro</Form.Label>
                    <Form.Select
                      name="rubro"
                      value={
                        formik.values.rubro?.denominacion
                          ? formik.values.rubro?.denominacion
                          : ""
                      }
                      onChange={(e) => {
                        const selectedRubroId = e.target.value;
                        const selectedRubro = rubros.find(
                          (rub) => rub.id === parseInt(selectedRubroId)
                        );

                        // Setea el objeto completo de unidad de medida
                        formik.setFieldValue("rubro", selectedRubro);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.rubro?.denominacion &&
                          formik.touched.rubro?.denominacion
                      )}
                    >
                      <option value="">Selecciona un rubro</option>
                      {rubros.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.denominacion}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.unidadMedida?.denominacion}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Estado Articulo Insumo */}
                  <Form.Group as={Col} controlId="formNombre">
                    <Form.Label> Estado </Form.Label>
                    <Form.Select
                      name="estadoArticulo"
                      value={formik.values.estadoArticulo || ""}
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

                <Row>
                  {/* Precio de Costo */}
                  <Form.Group as={Col} controlId="formNombre">
                    <Form.Label> Precio Costo </Form.Label>
                    <Form.Control
                      name="precioCompra"
                      type="text"
                      value={formik.values.precioCompra || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.precioCompra &&
                          formik.touched.precioCompra
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.precioCompra}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Precio venta */}
                  <Form.Group as={Col} controlId="formNombre">
                    <Form.Label> Precio Venta </Form.Label>
                    <Form.Control
                      name="precioVenta"
                      type="text"
                      value={formik.values.precioVenta || ""}
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

                  {/* Stock Actual */}
                  <Form.Group as={Col} controlId="formNombre">
                    <Form.Label> Stock Actual</Form.Label>
                    <Form.Control
                      name="stockActual"
                      type="number"
                      value={formik.values.stockActual || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.stockActual && formik.touched.stockActual
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.stockActual}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Stock Minimo */}
                  <Form.Group as={Col} controlId="formNombre">
                    <Form.Label> Stock Minimo</Form.Label>
                    <Form.Control
                      name="stockMinimo"
                      type="number"
                      value={formik.values.stockMinimo || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.stockMinimo && formik.touched.stockMinimo
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.stockMinimo}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Modal.Footer className="mt-4">
                  <Button variant="secondary" onClick={onHide}>
                    {" "}
                    Cancelar{" "}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!formik.isValid}
                  >
                    {" "}
                    Guardar{" "}
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
