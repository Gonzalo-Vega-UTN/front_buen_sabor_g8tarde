import React, { useState, useEffect, ChangeEvent } from 'react';
import { Form, Button, Row, Col, Container, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import PromocionService from '../services/PromocionService';
import { Promocion, PromocionDetalle } from '../entities/DTO/Promocion/Promocion';
import { Articulo } from '../entities/DTO/Articulo/Articulo';

interface FormProps {
  promocion?: Promocion;
  onSave: (promocion: Promocion) => void;
}

const PromocionForm: React.FC<FormProps> = ({ promocion, onSave }) => {
  const [formState, setFormState] = useState<Promocion>(promocion || {
    id: 0,
    alta: true,
    denominacion: '',
    fechaDesde: new Date(),
    fechaHasta: new Date(),
    horaDesde: '',
    horaHasta: '',
    descripcionDescuento: '',
    precioPromocional: 0,
    tipoPromocion: undefined,
    detallesPromocion: []
  });

  const [articulos, setArticulos] = useState<Articulo[]>([]);

  useEffect(() => {
    // Fetch articles
    const fetchArticulos = async () => {
      try {
        const response = await fetch('api/articulos/manufacturados'); // Replace with actual URL
        const data = await response.json();
        setArticulos(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticulos();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const updatedDetails = formState.detallesPromocion.map((detalle, i) =>
      i === index ? { ...detalle, [field]: value } : detalle
    );
    setFormState({ ...formState, detallesPromocion: updatedDetails });
  };

  const addDetail = () => {
    setFormState({
      ...formState,
      detallesPromocion: [...formState.detallesPromocion, {
          cantidad: 0, articulo: {} as Articulo,
          id: 0,
          alta: false
      }]
    });
  };

  const removeDetail = (index: number) => {
    setFormState({
      ...formState,
      detallesPromocion: formState.detallesPromocion.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (promocion) {
        await PromocionService.update(promocion.id, formState);
      } else {
        await PromocionService.create(formState);
      }
      onSave(formState);
    } catch (error) {
      console.error('Error saving promotion:', error);
    }
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
              value={formState.denominacion}
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
              value={formState.fechaDesde.toISOString().split('T')[0]}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="fechaHasta">
            <Form.Label>Fecha Hasta</Form.Label>
            <Form.Control
              type="date"
              name="fechaHasta"
              value={formState.fechaHasta.toISOString().split('T')[0]}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="horaDesde">
            <Form.Label>Hora Desde</Form.Label>
            <Form.Control
              type="time"
              name="horaDesde"
              value={formState.horaDesde}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="horaHasta">
            <Form.Label>Hora Hasta</Form.Label>
            <Form.Control
              type="time"
              name="horaHasta"
              value={formState.horaHasta}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="descripcionDescuento">
          <Form.Label>Descripción del Descuento</Form.Label>
          <Form.Control
            type="text"
            name="descripcionDescuento"
            value={formState.descripcionDescuento}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="precioPromocional">
          <Form.Label>Precio Promocional</Form.Label>
          <Form.Control
            type="number"
            name="precioPromocional"
            value={formState.precioPromocional}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Detalles de la Promoción</Form.Label>
          {formState.detallesPromocion.map((detalle, index) => (
            <InputGroup key={index} className="mb-2">
              <Form.Select
                aria-label="Seleccionar Artículo"
                value={detalle.articulo.id || ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDetailChange(index, 'articulo', articulos.find(a => a.id === e.target.value))}
              >
                <option value="">Seleccionar Artículo</option>
                {articulos.map((articulo) => (
                  <option key={articulo.id} value={articulo.id}>
                    {articulo.nombre}
                  </option>
                ))}
              </Form.Select>
              <FormControl
                type="number"
                value={detalle.cantidad || 0}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDetailChange(index, 'cantidad', parseInt(e.target.value))}
                />
                <Button variant="outline-danger" onClick={() => removeDetail(index)}>
                  <FaMinus />
                </Button>
              </InputGroup>
            ))}
            <Button variant="outline-primary" onClick={addDetail}>
              <FaPlus /> Añadir Detalle
            </Button>
          </Form.Group>
  
          <Button type="submit" variant="primary">
            Guardar Promoción
          </Button>
        </Form>
      </Container>
    );
  };
  
  export default PromocionForm;
  
