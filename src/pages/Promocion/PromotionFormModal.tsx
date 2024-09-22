import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, InputGroup, ListGroup } from 'react-bootstrap';
import { Promocion } from '../../entities/DTO/Promocion/Promocion';
import { Articulo } from '../../entities/DTO/Articulo/Articulo';
import { TipoPromocion } from '../../entities/enums/TipoPromocion';
import { ProductServices } from '../../services/ProductServices';
import PromocionService from '../../services/PromocionService';
import { useAuth0Extended } from '../../Auth/Auth0ProviderWithNavigate';

interface PromotionFormModalProps {
  show: boolean;
  onHide: () => void;
  onSave: () => void;
  promocionId?: number;
}

const PromotionFormModal: React.FC<PromotionFormModalProps> = ({ show, onHide, onSave, promocionId }) => {
  const [promocion, setPromocion] = useState<Promocion>(new Promocion());
  const [availableArticulos, setAvailableArticulos] = useState<Articulo[]>([]);
  const [submitError, setSubmitError] = useState<string>("");
  const { activeSucursal } = useAuth0Extended();

  useEffect(() => {
    const fetchData = async () => {
      if (promocionId) {
        try {
          const fetchedPromocion = await PromocionService.getOne(promocionId);
          setPromocion(fetchedPromocion);
        } catch (error) {
          console.error("Error obteniendo Promocion:", error);
        }
      } else {
        setPromocion(new Promocion());
      }

      try {
        const manufacturados = await ProductServices.getAllFiltered(activeSucursal);
        setAvailableArticulos(manufacturados);
      } catch (error) {
        console.error("Error al obtener los articulos manufacturados", error);
      }
    };

    if (show) {
      fetchData();
    }
  }, [show, promocionId, activeSucursal]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPromocion({ ...promocion, [name]: value });
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = event.target.value === "HappyHour" ? TipoPromocion.HappyHour : TipoPromocion.Promocion;
    setPromocion({ ...promocion, tipoPromocion: tipo });
  };

  const handleArticuloSelect = (articulo: Articulo) => {
    if (!promocion.detallesPromocion.find(d => d.articulo.id === articulo.id)) {
      setPromocion({
        ...promocion,
        detallesPromocion: [
          ...promocion.detallesPromocion,
          { cantidad: 1, articulo: articulo, id: 0, alta: true }
        ]
      });
    }
  };

  const handleArticuloRemove = (articuloId: number) => {
    setPromocion({
      ...promocion,
      detallesPromocion: promocion.detallesPromocion.filter(d => d.articulo.id !== articuloId)
    });
  };

  const handleCantidadChange = (articuloId: number, cantidad: number) => {
    setPromocion({
      ...promocion,
      detallesPromocion: promocion.detallesPromocion.map(d => 
        d.articulo.id === articuloId ? { ...d, cantidad } : d
      )
    });
  };

  const validateInputs = () => {
    if (!promocion.denominacion || promocion.denominacion.trim().length === 0) {
      setSubmitError("Agrega una denominacion");
      return false;
    }
    if (!promocion.fechaDesde || !promocion.fechaHasta) {
      setSubmitError("Agrega fechas válidas");
      return false;
    }
    if (!promocion.horaDesde || !promocion.horaHasta) {
      setSubmitError("Agrega horarios válidos");
      return false;
    }
    if (!promocion.descripcionDescuento || promocion.descripcionDescuento.trim().length === 0) {
      setSubmitError("Agrega una descripcion del descuento");
      return false;
    }
    if (!promocion.precioPromocional || promocion.precioPromocional < 0) {
      setSubmitError("Agrega un precio promocional valido");
      return false;
    }
    if (!promocion.tipoPromocion) {
      setSubmitError("Agrega un tipo de promocion");
      return false;
    }
    if (promocion.detallesPromocion.length === 0) {
      setSubmitError("Agrega al menos un detalle de promocion");
      return false;
    }
    setSubmitError("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateInputs()) {
      try {
        if (promocion.id !== 0) {
          await PromocionService.update(promocion.id, promocion);
        } else {
          await PromocionService.create(activeSucursal, promocion);
        }
        onSave();
        onHide();
      } catch (error) {
        console.error("Error saving promotion:", error);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{promocion.id ? 'Editar Promoción' : 'Nueva Promoción'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="denominacion">
              <Form.Label>Denominación</Form.Label>
              <Form.Control
                type="text"
                name="denominacion"
                value={promocion.denominacion}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="fechaDesde">
              <Form.Label>Fecha Desde</Form.Label>
              <Form.Control
                type="date"
                name="fechaDesde"
                value={promocion.fechaDesde ? new Date(promocion.fechaDesde).toISOString().split('T')[0] : ''}
                onChange={(e) => setPromocion({...promocion, fechaDesde: new Date(e.target.value)})}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="fechaHasta">
              <Form.Label>Fecha Hasta</Form.Label>
              <Form.Control
                type="date"
                name="fechaHasta"
                value={promocion.fechaHasta ? new Date(promocion.fechaHasta).toISOString().split('T')[0] : ''}
                onChange={(e) => setPromocion({...promocion, fechaHasta: new Date(e.target.value)})}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="horaDesde">
              <Form.Label>Hora Desde</Form.Label>
              <Form.Control
                type="time"
                name="horaDesde"
                value={promocion.horaDesde}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="horaHasta">
              <Form.Label>Hora Hasta</Form.Label>
              <Form.Control
                type="time"
                name="horaHasta"
                value={promocion.horaHasta}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="descripcionDescuento">
            <Form.Label>Descripción del Descuento</Form.Label>
            <Form.Control
              type="text"
              name="descripcionDescuento"
              value={promocion.descripcionDescuento}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="precioPromocional">
            <Form.Label>Precio Promocional</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                name="precioPromocional"
                value={promocion.precioPromocional}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="tipoPromocion">
            <Form.Label>Tipo de Promoción</Form.Label>
            <Form.Select
                value={promocion.tipoPromocion}
                onChange={handleChangeSelect}
            >
                <option value="">Seleccionar Tipo</option>
                <option value="HappyHour">Happy Hour</option>
                <option value="Promocion">Promoción</option>
            </Form.Select>
            </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Productos Manufacturados Disponibles</Form.Label>
            <ListGroup>
              {availableArticulos.filter(a => !promocion.detallesPromocion.find(d => d.articulo.id === a.id)).map(articulo => (
                <ListGroup.Item key={articulo.id} action onClick={() => handleArticuloSelect(articulo)}>
                  {articulo.denominacion}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Productos Seleccionados</Form.Label>
            <ListGroup>
              {promocion.detallesPromocion.map(detalle => (
                <ListGroup.Item key={detalle.articulo.id}>
                  <Row>
                    <Col>{detalle.articulo.denominacion}</Col>
                    <Col xs={3}>
                      <Form.Control
                        type="number"
                        min="1"
                        value={detalle.cantidad}
                        onChange={(e) => handleCantidadChange(detalle.articulo.id, parseInt(e.target.value))}
                      />
                    </Col>
                    <Col xs={2}>
                      <Button variant="danger" size="sm" onClick={() => handleArticuloRemove(detalle.articulo.id)}>
                        Eliminar
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>

          {submitError && <p className="text-danger">{submitError}</p>}

          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PromotionFormModal;