import { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { UnidadMedida } from "../../types/UnidadMedida";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";
import { UnidadMedidaServices } from "../../services/UnidadMedidaServices";

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
    const [unidad, setUnidad] = useState<UnidadMedida[]>([]);

    useEffect(() => {
        const fetchUnidadMedida = async () => {
            const unidad = await UnidadMedidaServices.getUnidadMedida();
            setUnidad(unidad);
        };
        fetchUnidadMedida();
    }, []);

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
                articulosInsumos(updateData);
            } else {
                await ArticuloInsumosServices.updateArticuloInsumo(art.id, art);
                articulosInsumos((prevArtInsumo) =>
                    prevArtInsumo.map((articuloEdit) =>
                        articuloEdit.id === art.id ? art : articuloEdit
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

    const handleDelete = async () => {
        try {
            await ArticuloInsumosServices.deleteArticuloInsumo(articulo.id);
            articulosInsumos((prevArtInsumo) =>
                prevArtInsumo.filter((insumo) => insumo.id !== articulo.id)
            );
            toast.success("Ingrediente eliminado con éxito", {
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
            id: Yup.number().integer().min(0),
            denominacion: Yup.string().required("El nombre es requerido"),
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
                .required("El stock mínimo es requerido"),
        });
    };

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
                            <p>¿Está seguro de que desea eliminar el ingrediente?</p>
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
                                <Row>
                                    <Form.Group as={Col} controlId="formNombre">
                                        <Form.Label>Nombre</Form.Label>
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
                                                formik.setFieldValue("unidadMedida", selectedUnidad);
                                            }}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(
                                                formik.errors.unidadMedida &&
                                                formik.touched.unidadMedida
                                            )}
                                        >
                                            <option value="">Selecciona una unidad de Medida</option>
                                            {unidad.map((unidad) => (
                                                <option key={unidad.id} value={unidad.id}>
                                                    {unidad.denominacion}
                                                </option>
                                            ))}
                                        </Form.Select>
                                       
                                    </Form.Group>
                                </Row>

                                <Row>
                                    <Form.Group as={Col} controlId="formPrecioCompra">
                                        <Form.Label>Precio de Compra</Form.Label>
                                        <Form.Control
                                            name="precioCompra"
                                            type="number"
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

                                    <Form.Group as={Col} controlId="formPrecioVenta">
                                        <Form.Label>Precio de Venta</Form.Label>
                                        <Form.Control
                                            name="precioVenta"
                                            type="number"
                                            value={formik.values.precioVenta || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(
                                                formik.errors.precioVenta &&
                                                formik.touched.precioVenta
                                            )}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.precioVenta}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formStockActual">
                                        <Form.Label>Stock Actual</Form.Label>
                                        <Form.Control
                                            name="stockActual"
                                            type="number"
                                            value={formik.values.stockActual || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(
                                                formik.errors.stockActual &&
                                                formik.touched.stockActual
                                            )}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.stockActual}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formStockMinimo">
                                        <Form.Label>Stock Mínimo</Form.Label>
                                        <Form.Control
                                            name="stockMinimo"
                                            type="number"
                                            value={formik.values.stockMinimo || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(
                                                formik.errors.stockMinimo &&
                                                formik.touched.stockMinimo
                                            )}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.stockMinimo}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Modal.Footer>
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
