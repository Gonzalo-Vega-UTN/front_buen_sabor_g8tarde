import React, { useState, useEffect,  } from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router';
import { Articulo } from '../../entities/DTO/Articulo/Articulo';
import { Promocion } from '../../entities/DTO/Promocion/Promocion';
import { TipoPromocion } from '../../entities/enums/TipoPromocion';
import { ProductServices } from '../../services/ProductServices';
import PromocionService from '../../services/PromocionService';
import ArticuloInsumoService from '../../services/ArticuloInsumoService';
import { useAuth0Extended } from '../../Auth/Auth0ProviderWithNavigate';

const PromocionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promocion, setPromocion] = useState<Promocion>(new Promocion());
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [tipoPromocion, setTipoPromocion] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const { activeSucursal } = useAuth0Extended();

  
  useEffect(() => {
    const fetchData = async () => {
      const parsedId = Number(id);

      if (!isNaN(parsedId) && parsedId !== 0) {
        try {
          const promocion = await PromocionService.getOne(parsedId);
          setPromocion(promocion);
        } catch (error) {
          console.error("Error obteniendo Promocion de ID: " + id, error);
        }
      }

      try {
        const manufacturados = await ProductServices.getAllFiltered(activeSucursal);
        const insumos = (
          await ArticuloInsumoService.obtenerArticulosInsumosFiltrados(activeSucursal)
        ).filter((articulos) => !articulos.esParaElaborar);
        const idsArticulosExistentes = promocion.detallesPromocion.map(
          (detalle) => detalle.articulo.id
        );
        const articulos = [...manufacturados, ...insumos].filter(
          (articulo) => !idsArticulosExistentes.includes(articulo.id)
        );
        setArticulos(articulos);
      } catch (error) {
        console.error("Error al obtener los articulos", error);
      }
    };

    fetchData();
  }, [id, activeSucursal]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPromocion({
      ...promocion,
      [name]: value,
    });
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoPromocion(event.target.value);
    let tipo: TipoPromocion;
    if (event.target.value === "HappyHour") {
      tipo = TipoPromocion.HappyHour;
    } else {
      tipo = TipoPromocion.Promocion;
    }
    setPromocion({
      ...promocion,
      tipoPromocion: tipo,
    });
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const updatedDetails = promocion.detallesPromocion.map((detalle, i) =>
      i === index ? { ...detalle, [field]: value } : detalle
    );
    setPromocion({ ...promocion, detallesPromocion: updatedDetails });
  };

  const addDetail = () => {
    setPromocion({
      ...promocion,
      detallesPromocion: [
        ...promocion.detallesPromocion,
        {
          cantidad: 1,
          articulo: {} as Articulo,
          id: 0,
          alta: true,
        },
      ],
    });
  };

  const removeDetail = (index: number) => {
    setPromocion({
      ...promocion,
      detallesPromocion: promocion.detallesPromocion.filter(
        (_, i) => i !== index
      ),
    });
  };

  const validateInputs = () => {
    if (!promocion.denominacion || promocion.denominacion.trim().length === 0) {
      setSubmitError("Agrega una denominacion");
      return false;
    }
    if (!promocion.fechaDesde) {
      setSubmitError("Agrega una fecha desde");
      return false;
    }
    if (!promocion.fechaHasta) {
      setSubmitError("Agrega una fecha hasta");
      return false;
    }
    if (!promocion.horaDesde || promocion.horaDesde.trim().length === 0) {
      setSubmitError("Agrega un horario desde");
      return false;
    }
    if (!promocion.horaHasta || promocion.horaHasta.trim().length === 0) {
      setSubmitError("Agrega un horario hasta");
      return false;
    }
    if (
      !promocion.descripcionDescuento ||
      promocion.descripcionDescuento.trim().length === 0
    ) {
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
    if (
      promocion.detallesPromocion.length === 0 ||
      !promocion.detallesPromocion[0].articulo.id
    ) {
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
        navigate("/promociones");
      } catch (error) {
        console.error("Error saving promotion:", error);
      }
    }
  };

  const getAvailableArticulos = (index: number) => {
    const selectedArticulosIds = promocion.detallesPromocion
      .filter((_, i) => i !== index)
      .map((detalle) => detalle.articulo.id);
    return articulos.filter(
      (articulo) => !selectedArticulosIds.includes(articulo.id)
    );
  };

  return (
    <Container>
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
              value={
                promocion.fechaDesde instanceof Date
                  ? promocion.fechaDesde.toISOString().split("T")[0]
                  : promocion.fechaDesde
              }
              onChange={(e) =>
                setPromocion({
                  ...promocion,
                  fechaDesde: new Date(e.target.value),
                })
              }
            />
          </Form.Group>
          <Form.Group as={Col} controlId="fechaHasta">
            <Form.Label>Fecha Hasta</Form.Label>
            <Form.Control
              type="date"
              name="fechaHasta"
              value={
                promocion.fechaHasta instanceof Date
                  ? promocion.fechaHasta.toISOString().split("T")[0]
                  : promocion.fechaHasta
              }
              onChange={(e) =>
                setPromocion({
                  ...promocion,
                  fechaHasta: new Date(e.target.value),
                })
              }
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

        <Form.Group controlId="selectTipoPromocion" as={Col}>
          <Form.Label>Seleccione un Tipo de Promoción</Form.Label>
          <select
            value={tipoPromocion}
            onChange={handleChangeSelect}
            className="form-select"
          >
            <option value="" disabled>
              Seleccionar Opción
            </option>
            {Object.values(TipoPromocion).map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="detallesPromocion">
          <Form.Label>Detalles de la Promoción</Form.Label>
          {promocion.detallesPromocion.map((detalle, index) => (
            <Row key={index} className="mb-3">
              <Col>
                <Form.Control
                  as="select"
                  value={detalle.articulo.id}
                  onChange={(e) =>
                    handleDetailChange(index, "articulo", {
                      ...detalle.articulo,
                      id: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={0} disabled>
                    Seleccionar Articulo
                  </option>
                  {getAvailableArticulos(index).map((articulo) => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.denominacion}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  value={detalle.cantidad}
                  onChange={(e) =>
                    handleDetailChange(index, "cantidad", parseInt(e.target.value))
                  }
                />
              </Col>
              <Col>
                <Button
                  variant="danger"
                  onClick={() => removeDetail(index)}
                  disabled={promocion.detallesPromocion.length <= 1}
                >
                  <FaMinus />
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="primary" onClick={addDetail}>
            <FaPlus /> Añadir Detalle
          </Button>
        </Form.Group>

        {submitError && <p className="text-danger">{submitError}</p>}

        <Button variant="primary" type="submit">
          Guardar
        </Button>
      </Form>
    </Container>
  );
};

export default PromocionForm;
