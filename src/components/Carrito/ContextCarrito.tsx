import React, { createContext, ReactNode, useContext, useState } from 'react';
import Instrumento from '../../entidades/instrumentos';
import Pedido from '../../entidades/Pedido';
import PedidoDetalle from '../../entidades/PedidoDetalle';
import { agregarPedido, createPreferenceMP } from '../../servicios/funcionApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/Auth';
import ModalConfirm from '../Modal/ModalConfirm';

interface CartContextType {
  pedido: Pedido;
  costoEnvio: number;
  agregarAlCarrito: (instrumento: Instrumento | undefined) => void;
  quitarDelCarrito: (index: number) => void;
  vaciarCarrito: () => void;
  handleCompra: () => Promise<void>;
  handleCantidadChange: (index: number, cantidad: number) => void;
  error: string;
  preferenceId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pedido, setPedido] = useState<Pedido>(new Pedido());
  const [error, setError] = useState<string>('');
  const [costoEnvio, setCostoEnvio] = useState<number>(0);
  const { activeUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', text: '', onConfirm: () => {}, onCancel: () => {} });
  const [preferenceId, setPreferenceId] = useState<string>('');

  const agregarAlCarrito = (instrumento: Instrumento | undefined) => {
    if (instrumento) {
      const nuevoPedido = { ...pedido };
      const detalleExistente = nuevoPedido.pedidoDetalle.find(detalle => detalle.instrumento?.id === instrumento.id);
      if (detalleExistente) {
        detalleExistente.cantidad++;
        detalleExistente.subtotal = instrumento.precio * detalleExistente.cantidad;
      } else {
        const nuevoDetalle = new PedidoDetalle();
        nuevoDetalle.instrumento = instrumento;
        nuevoDetalle.cantidad = 1;
        nuevoDetalle.subtotal = instrumento.precio;
        nuevoPedido.pedidoDetalle.push(nuevoDetalle);
      }

      nuevoPedido.totalPedido += instrumento.precio;

      const costoEnvioActualizado = parseFloat(instrumento.costoEnvio);
      if (!isNaN(costoEnvioActualizado)) {
        setCostoEnvio(prevCostoEnvio => prevCostoEnvio + costoEnvioActualizado);
        nuevoPedido.totalPedido += costoEnvioActualizado;
      }
      setPedido(nuevoPedido);
      setPreferenceId('');
      setError('');
    }
  };

  const quitarDelCarrito = (index: number) => {
    const detalle = pedido.pedidoDetalle[index];
    if (detalle.instrumento && detalle.instrumento.precio) {
      detalle.cantidad--;
      if (detalle.cantidad <= 0) {
        pedido.pedidoDetalle.splice(index, 1);
      } else {
        detalle.subtotal = detalle.instrumento.precio * detalle.cantidad;
      }
      pedido.totalPedido -= detalle.instrumento.precio;

      const costoEnvioActualizado = parseFloat(detalle.instrumento.costoEnvio);
      if (!isNaN(costoEnvioActualizado)) {
        setCostoEnvio(prevCostoEnvio => prevCostoEnvio - costoEnvioActualizado);
        pedido.totalPedido -= costoEnvioActualizado;
      }
      setPedido({ ...pedido });
      
      setPreferenceId('');
    }
  };

  const vaciarCarrito = () => {
    setCostoEnvio(0);
    setPedido(new Pedido());
    setPreferenceId('');
  };

  const handleCantidadChange = (index: number, cantidad: number) => {
    const newPedido = { ...pedido };
    const detalle = newPedido.pedidoDetalle[index];
    if (!cantidad || cantidad <= 0) {
      setError('La cantidad debe ser mayor que 0');
      return;
    }
    
    const subtotalDetalle = detalle.instrumento.precio * cantidad;
    const cambioSubtotal = subtotalDetalle - detalle.subtotal;
    detalle.subtotal = subtotalDetalle;

    newPedido.totalPedido += cambioSubtotal;

    const costoEnvioActualizado = parseFloat(detalle.instrumento.costoEnvio);
    if (!isNaN(costoEnvioActualizado)) {
      const cambioCostoEnvio = costoEnvioActualizado * cantidad - detalle.instrumento.costoEnvio * detalle.cantidad;
      setCostoEnvio(prevCostoEnvio => prevCostoEnvio + cambioCostoEnvio);
      newPedido.totalPedido += costoEnvioActualizado;
    }

    detalle.cantidad = cantidad;
    setPedido(newPedido);
    setError('');
    
    setPreferenceId('');
  };

  const handleCompra = async () => {
    if (pedido.pedidoDetalle.length === 0) {
      setError('El carrito debe tener al menos un producto.');
      return;
    } else {
      setError('');
    }

    setShowModal(true);
    setModalConfig({
      title: 'Confirmar Compra',
      text: '¿Estás seguro de realizar la compra?',
      onConfirm: async () => {
        setShowModal(false);
        try {
          const data = await agregarPedido({ ...pedido, user: { nombreUsuario: activeUser, clave: "" } });
          if (data > 0) {
            await getPreferenceMP(data);
            toast.success('Compra realizada con éxito');
          } else {
            setError('Error al realizar el pedido');
          }
        } catch (error) {
          toast.error('Error al realizar el pedido');
          console.error(error);
        }
      },
      onCancel: () => setShowModal(false),
    });
  };

  const getPreferenceMP = async (pedidoId: number) => {
    try {
      const response = await createPreferenceMP({
        id: pedidoId,
        titulo: 'BuenSabor',
        totalPedido: pedido.totalPedido + costoEnvio,
        fecha: pedido.fecha,
        pedidoDetalle: pedido.pedidoDetalle,
      });
      if (response) {
        setPreferenceId(response.id);
      }
    } catch (error) {
      toast.error('Error al crear la preferencia de pago');
      console.error(error);
    }
  };

  return (
    <CartContext.Provider value={{ pedido, agregarAlCarrito, quitarDelCarrito, vaciarCarrito, handleCompra, error, costoEnvio, handleCantidadChange, preferenceId }}>
      {children}
      <ModalConfirm
        show={showModal}
        title={modalConfig.title}
        text={modalConfig.text}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
      />
    </CartContext.Provider>
  );
};
