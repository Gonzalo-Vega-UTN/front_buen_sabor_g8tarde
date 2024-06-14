import React, { useState, useEffect, ChangeEvent } from 'react';
import { Form, Button, Row, Col, Container, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import PromocionService from '../services/PromocionService';
import { Promocion } from '../entities/DTO/Promocion/Promocion';
import { Articulo } from '../entities/DTO/Articulo/Articulo';
import { ProductServices } from '../services/ProductServices';
import { useNavigate, useParams } from 'react-router-dom';



const PromocionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promocion, setPromocion] = useState<Promocion>( {
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
    const fetchData = async () => {
      const parsedId = Number(id);

    if (!isNaN(parsedId) && parsedId !== 0) {
      try {
        const promocion = await PromocionService.getOne(parsedId);
        console.log("LO QUE LLEGO", promocion)
        setPromocion(promocion);
      } catch (error) {
        console.error('Error fetching promocion details:', error);
      }
    }
  
      try {
        const articulos = await ProductServices.getAllFiltered();
        setArticulos(articulos);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
  
    fetchData();
  }, [id]);
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPromocion({
      ...promocion,
      [name]: value
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
      detallesPromocion: [...promocion.detallesPromocion, {
          cantidad: 0, articulo: {} as Articulo,
          id: 0,
          alta: false
      }]
    });
  };

  const removeDetail = (index: number) => {
    setPromocion({
      ...promocion,
      detallesPromocion: promocion.detallesPromocion.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (promocion.id !== 0) {
        await PromocionService.update(promocion.id, promocion);
        navigate("/promociones");
      } else {
        await PromocionService.create(promocion);
        navigate("/promociones");
      }
      
    } catch (error) {
      
    navigate("/promociones");
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
              value={promocion.fechaDesde instanceof Date ? promocion.fechaDesde.toISOString().split('T')[0] : promocion.fechaDesde}
              onChange={(e) => setPromocion({ ...promocion, fechaDesde: new Date(e.target.value) })}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="fechaHasta">
            <Form.Label>Fecha Hasta</Form.Label>
            <Form.Control
              type="date"
              name="fechaHasta"
              value={promocion.fechaHasta instanceof Date ? promocion.fechaHasta.toISOString().split('T')[0] : promocion.fechaHasta}
  
              onChange={(e) => setPromocion({ ...promocion, fechaHasta: new Date(e.target.value) })}
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
          <Form.Control
            type="number"
            name="precioPromocional"
            value={promocion.precioPromocional}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Detalles de la Promoción</Form.Label>
          {promocion.detallesPromocion.map((detalle, index) => (
            <InputGroup key={index} className="mb-2">
              <Form.Select
                aria-label="Seleccionar Artículo"
                value={detalle.articulo.id || ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDetailChange(index, 'articulo', articulos.find(a => a.id === parseInt(e.target.value)) || {} as Articulo)}
              >
                <option value="">Seleccionar Artículo</option>
                {articulos.map((articulo) => (
                  <option key={articulo.id} value={articulo.id}>
                    {articulo.denominacion}
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
