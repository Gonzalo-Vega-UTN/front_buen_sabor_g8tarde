import React, { useEffect, useState } from 'react';
import { useCart } from './ContextCarrito';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import CheckoutMP from './MP/CheckoutMP';

import './Carrito.css';
import { useAuth } from '../../Auth/Auth';
import { Sucursal } from '../../entities/DTO/Sucursal/Sucursal';
import SucursalService from '../../services/SucursalService';
import ModalDomicilios from '../../pages/Domicilio/ModalDomicilios';
import { Domicilio } from '../../entities/DTO/Domicilio/Domicilio';
import { TipoEnvio } from '../../entities/enums/TipoEnvio';
import { FormaPago } from '../../entities/enums/FormaPago';

const Carrito: React.FC<{ actualizarLista: () => void }> = ({ actualizarLista }) => {
  const { pedido, quitarDelCarrito, agregarAlCarrito, vaciarCarrito, handleCompra, handleCantidadChange, error, preferenceId } = useCart();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio | "">("");
  const [tipoPago, setTipoPago] = useState<FormaPago | "">("");
  const { activeSucursal } = useAuth();
  const [sucursal, setSucursal] = useState<Sucursal>();
  const [showModalDomicilios, setShowModalDomicilios] = useState(false);
  const [domicilioEntrega, setDomicilioEntrega] = useState<Domicilio>();

  useEffect(() => {
    if (activeSucursal) {
      fetchSucursal();
    }
  }, [activeSucursal]);

  useEffect(() => {
    if (preferenceId) {
      console.log(preferenceId);
    }
  }, [preferenceId]);

  const fetchSucursal = async () => {
    try {
      const sucursalData = await SucursalService.getOne(activeSucursal);
      setSucursal(sucursalData);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  };

  const RealizarCompra = async () => {
    if (domicilioEntrega) {
      pedido.domicilio = domicilioEntrega;
    }

    if (tipoPago) {
      pedido.formaPago = tipoPago as FormaPago;
    }

    if (tipoEnvio ) {
      pedido.tipoEnvio = tipoEnvio as TipoEnvio;
    }
    pedido.sucursal.id=Number(activeSucursal);

    await handleCompra();
    await actualizarLista();
  };

  const handleSeleccionarDomicilio = (domicilio: Domicilio) => {
    console.log('Domicilio seleccionado:', domicilio);
    setShowModalDomicilios(false);
    setDomicilioEntrega(domicilio);
  };

  useEffect(() => {
    if (tipoEnvio === TipoEnvio.TakeAway && sucursal && sucursal.domicilio) {
      console.log("Sucursal",sucursal)
      console.log("Domicilio",sucursal.domicilio)
      setDomicilioEntrega(sucursal.domicilio);
      
      console.log(domicilioEntrega)
    }
  }, [tipoEnvio, sucursal]);

  return (
    <div className="carrito-container">
      {currentStep === 0 && (
        <div>
          <h2 className="carrito-title">Carrito de Compras</h2>
          <p className="carrito-info">Cantidad de ítems: {pedido.detallePedidos.length}</p>
          {pedido.detallePedidos.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            pedido.detallePedidos.map((detalle, index) => (
              <div key={index} className="item-carrito">
                <div className="d-flex align-items-center">
                  <img
                    src={detalle.articulo.imagenes[0] ? detalle.articulo.imagenes[0].url : ""}
                    alt={detalle.articulo?.denominacion}
                    className="img-fluid rounded-circle carrito-img"
                  />
                  <div className="carrito-info">
                    <p className="carrito-producto">{detalle.articulo?.denominacion}</p>
                    <p className="carrito-subtotal">Precio: ${detalle.subTotal}</p>
                  </div>
                </div>
                <div className="botones-carrito">
                  <Button variant="danger" onClick={() => quitarDelCarrito(index)}>-</Button>
                  <Form.Control
                    type="number"
                    min={1}
                    value={detalle.cantidad}
                    onChange={(e) => handleCantidadChange(index, parseInt(e.target.value))}
                    className="cantidad"
                  />
                  <Button variant="success" onClick={() => agregarAlCarrito(detalle.articulo)}>+</Button>
                </div>
              </div>
            ))
          )}
          <p className="carrito-total text-black">Total del Pedido: ${pedido.total}</p>
          <div className="botones">
            <Button variant="warning" onClick={vaciarCarrito}>Vaciar Carrito</Button>
            <Button variant="primary" onClick={() => setCurrentStep(1)}>Confirmar Compra</Button>
          </div>
        </div>
      )}
      {currentStep === 1 && (
        <div>
          <Button variant="warning" onClick={() => setCurrentStep(0)}>Volver</Button>
          {pedido.detallePedidos.map((detalle, index) => (
            <div key={index} className="item-carrito">
              <div className="d-flex align-items-center">
                <img
                  src={detalle.articulo.imagenes[0] ? detalle.articulo.imagenes[0].url : ""}
                  alt={detalle.articulo?.denominacion}
                  className="img-fluid rounded-circle carrito-img"
                />
                <div className="carrito-info">
                  <p className="carrito-producto">{detalle.articulo?.denominacion}</p>
                  <p className="carrito-subtotal">Precio: ${detalle.subTotal}</p>
                </div>
              </div>
              <div className="botones-carrito">
                <Form.Control
                  type="text"
                  value={detalle.cantidad}
                  className="cantidad"
                  readOnly={true}
                />
              </div>
            </div>
          ))}
          <div className='text-black'>
            <h3>Elige tu Forma de Entrega</h3>
            <Row>
              <Col>
                <Form.Select onChange={(e) => {
                  setDomicilioEntrega(undefined);
                  setTipoEnvio(e.target.value as TipoEnvio);
                }}>
                  <option value={""}>Seleccionar una forma de retiro</option>
                  <option value={TipoEnvio.TakeAway}>Retiro en Sucursal</option>
                  <option value={TipoEnvio.Delivery}>Envío a Domicilio</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Select onChange={(e) => setTipoPago(e.target.value as FormaPago)}>
                  <option value={""}>Seleccionar una forma de pago</option>
                  {tipoEnvio === TipoEnvio.TakeAway && <option value={FormaPago.Efectivo}>Efectivo</option>}
                  <option value={FormaPago.MercadoPago}>Mercado Pago</option>
                </Form.Select>
              </Col>
            </Row>
            <div>
              {tipoEnvio === TipoEnvio.TakeAway && (
                <h5>Domicilio de Retiro</h5>

              )}
              {tipoEnvio === TipoEnvio.Delivery && (
                <>
                  <h5>Domicilio de Entrega</h5>
                  <Button variant="primary" onClick={() => setShowModalDomicilios(true)}>Seleccionar Domicilio</Button>
                  <ModalDomicilios
                    show={showModalDomicilios}
                    onHide={() => setShowModalDomicilios(false)}
                    onSelectDomicilio={handleSeleccionarDomicilio}
                  />
                </>
              )}
              {domicilioEntrega && (
                <div>
                  <p>{domicilioEntrega.calle} {domicilioEntrega.numero}</p>
                  <p>{domicilioEntrega.cp}</p>
                  <p>{domicilioEntrega.localidad.nombre}, {domicilioEntrega.localidad.provincia.nombre}</p>
                </div>
              )}
            </div>
          </div>
          {preferenceId ? (
            <CheckoutMP preferenceId={preferenceId} />
          ) : (
            <div className="botones">
              <Button variant="primary" onClick={RealizarCompra} disabled={tipoEnvio === "" || tipoPago === "" || !domicilioEntrega}>Pagar</Button>
            </div>
          )}
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default Carrito;
