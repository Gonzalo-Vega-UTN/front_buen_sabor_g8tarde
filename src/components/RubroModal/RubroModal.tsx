import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { Rubro } from "../../types/Rubro";
import { StateType } from "../../types/StateType";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RubroServices } from "../../services/RubroServices";
import { toast } from "react-toastify";
import { RubroType } from "../../types/RubroType";

type RubroModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  rub: Rubro;
  rubros: React.Dispatch<React.SetStateAction<Rubro[]>>;
};

export default function RubroModal({
  show,
  onHide,
  title,
  modalType,
  rub,
  rubros,
}: RubroModalProps) {
  //CREATE - ACTUALIZAR
  const handleSaveUpdate = async (rubro: Rubro) => {
    try {
      const isNew = rubro.id === 0;
      if (isNew) {
        const newProduct = await RubroServices.createRubro(rubro);
        let updateData = (prevRubros: any) => [...prevRubros, newProduct];
        rubros(updateData); // Agregar el nuevo producto al final del arreglo
      } else {
        await RubroServices.updateRubro(rubro.id, rubro);
        rubros((prevRubros) =>
          prevRubros.map((rubroEdit) =>
            rubroEdit.id === rubro.id ? rubro : rubroEdit
          )
        );
      }

      toast.success(isNew ? "Rubro creado" : "Rubro actualizado", {
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
      await RubroServices.deleteRubro(rub.id);
      rubros((prevRubros) => prevRubros.filter((rubro) => rubro.id !== rub.id));
      toast.success("Rubro eliminado con exito", {
        position: "top-center",
      });
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };

  //Yup, esquema de validacion
  const validationSchema = () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      denominacion: Yup.string().required("El nombre es requerido"),
    });
  };

  //Formik, crea formulario dinamico y lo bloquea en caso de haber errores
  const formik = useFormik({
    initialValues: rub,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Rubro) => handleSaveUpdate(obj),
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
              <p>¿Esta seguro que desea eliminar el rubro?</p>
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

                  {/* Estado */}
                  <Form.Group as={Col} controlId="formEstado">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      name="estadoRubro"
                      value={formik.values.estadoRubro}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.estadoRubro && formik.touched.estadoRubro
                      )}
                    >
                      <option value={StateType.Alta}>Alta</option>
                      <option value={StateType.Baja}>Baja</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.estadoRubro}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Tipo de Rubro */}
                  <Form.Group as={Col} controlId="formEstado">
                    <Form.Label>Tipo de Rubro</Form.Label>
                    <Form.Select
                      name="tipoRubro"
                      value={formik.values.tipoRubro}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(
                        formik.errors.tipoRubro && formik.touched.tipoRubro
                      )}
                    >
                      <option value={RubroType.insumo}>Insumo</option>
                      <option value={RubroType.manufacturado}>
                        Manufacturado
                      </option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.tipoRubro}
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
