import React, { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import PedidoFull from '../../entities/DTO/Pedido/PedidoFull';
import { ArticuloManufacturado } from '../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado';
import { useAuth } from '../../Auth/Auth';
import { DetallePedido } from '../../entities/DTO/Pedido/DetallePedido';
import ModalConfirm from '../modals/ModalConfirm';
import { createPreferenceMP } from '../../services/MPService';
import { agregarPedido } from '../../services/PedidoService';

interface CartContextType {
  pedido: PedidoFull;
  agregarAlCarrito: (producto: ArticuloManufacturado | undefined) => void;
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
  const [pedido, setPedido] = useState<PedidoFull>(new PedidoFull());
  const [error, setError] = useState<string>('');
  const { activeUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', text: '', onConfirm: () => {}, onCancel: () => {} });
  const [preferenceId, setPreferenceId] = useState<string>('');

  const agregarAlCarrito = (articuloManufacturado: ArticuloManufacturado | undefined) => {
    if (articuloManufacturado) {
      const nuevoPedido = { ...pedido };
      const detalleExistente = nuevoPedido.detallePedidoList.find(detalle => detalle.ArticuloManufacturado?.id === articuloManufacturado.id);
      if (detalleExistente) {
        detalleExistente.cantidad++;
        detalleExistente.subTotal = articuloManufacturado.precioVenta * detalleExistente.cantidad; // Cambiado a subTotal
      } else {
        const nuevoDetalle = new DetallePedido(); // Crea un nuevo detalle de pedido
        nuevoDetalle.ArticuloManufacturado = articuloManufacturado;
        nuevoDetalle.cantidad = 1;
        nuevoDetalle.subTotal = articuloManufacturado.precioVenta; // Cambiado a subTotal
        nuevoPedido.detallePedidoList.push(nuevoDetalle); // Agrega el nuevo detalle al pedido
      }
  
      nuevoPedido.total += articuloManufacturado.precioVenta; // Cambiado a total
  
      setPedido(nuevoPedido);
      setPreferenceId('');
      setError('');
    }
  };
  
  const quitarDelCarrito = (index: number) => {
    const detalle = pedido.detallePedidoList[index]; // Corregido el acceso al detalle del pedido
  
    if (detalle && detalle.ArticuloManufacturado && detalle.ArticuloManufacturado.precioVenta) {
      detalle.cantidad--;
  
      if (detalle.cantidad <= 0) {
        pedido.detallePedidoList.splice(index, 1);
      } else {
        detalle.subTotal = detalle.ArticuloManufacturado.precioVenta * detalle.cantidad; // Cambiado a subTotal
      }
  
      pedido.total -= detalle.ArticuloManufacturado.precioVenta; // Cambiado a total
  
  
      setPedido({ ...pedido });
      setPreferenceId('');
    }
  };
  

  const vaciarCarrito = () => {
    setPedido(new PedidoFull());
    setPreferenceId('');
  };

  const handleCantidadChange = (index: number, cantidad: number) => {
    const newPedido = { ...pedido };
    const detalle = newPedido.detallePedidoList[index]; // Corregido el acceso al detalle del pedido
  
    if (!cantidad || cantidad <= 0) {
      setError('La cantidad debe ser mayor que 0');
      return;
    }
  
    const subtotalDetalle = detalle.ArticuloManufacturado?.precioVenta * cantidad; // Corregido el acceso al precio y manejo de null o undefined
    const cambioSubtotal = subtotalDetalle - detalle.subTotal; // Cambiado a subTotal
    detalle.subTotal = subtotalDetalle;
  
    newPedido.total += cambioSubtotal; // Cambiado a total
  
  
    detalle.cantidad = cantidad;
    setPedido(newPedido);
    setError('');
    
    setPreferenceId('');
  };
  

  const handleCompra = async () => {
    if (pedido.detallePedidoList.length === 0) {
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
          const data = await agregarPedido({ ...pedido });
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
      const pedidoFull: PedidoFull = {
        id: pedidoId,
        alta:true,
        horaEstimadaFinalizacion: '', // Asigna un valor adecuado
        total: pedido.total, // Asegúrate de que el total esté correctamente asignado
        totalCosto: pedido.totalCosto,
        estado: pedido.estado, // Asigna el estado si está disponible
        tipoEnvio: pedido.tipoEnvio, // Asigna el tipo de envío si está disponible
        formaDePago: pedido.formaDePago, // Asigna la forma de pago si está disponible
        fechaPedido: pedido.fechaPedido,
        domicilioShort: pedido.domicilioShort, // Asegúrate de que esté asignado correctamente
        detallePedidoList: pedido.detallePedidoList,
      };
  
      const response = await createPreferenceMP(pedidoFull);
      if (response) {
        setPreferenceId(response.id);
      }
    } catch (error) {
      toast.error('Error al crear la preferencia de pago');
      console.error(error);
    }
  };
  
  

  return (
    <CartContext.Provider value={{ pedido, agregarAlCarrito, quitarDelCarrito, vaciarCarrito, handleCompra, error, handleCantidadChange, preferenceId }}>
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
