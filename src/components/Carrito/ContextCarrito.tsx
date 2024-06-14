import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import PedidoFull from '../../entities/DTO/Pedido/PedidoFull';
import { useAuth } from '../../Auth/Auth';
import ModalConfirm from '../modals/ModalConfirm';
import { createPreferenceMP } from '../../services/MPService';
import { DetallePedido } from '../../entities/DTO/Pedido/DetallePedido';
import { Articulo } from '../../entities/DTO/Articulo/Articulo';
import PedidoService from '../../services/PedidoService';
import { Cliente } from '../../entities/DTO/Cliente/Cliente';
import Usuario from '../../entities/DTO/Usuario/Usuario';

interface CartContextType {
  pedido: PedidoFull;
  agregarAlCarrito: (producto: Articulo | undefined) => void;
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
  
  const [msjPedido, setMsjPedido] = useState<string>('');

  const agregarAlCarrito = (articulo: Articulo | undefined) => {
    if (articulo) {
      const nuevoPedido = { ...pedido };
      const detalleExistente = nuevoPedido.detallePedidos.find(detalle => detalle.articulo?.id === articulo.id);
      if (detalleExistente) {
        detalleExistente.cantidad++;
        detalleExistente.subTotal = articulo.precioVenta * detalleExistente.cantidad;
      } else {
        const nuevoDetalle = new DetallePedido();
        nuevoDetalle.articulo = articulo;
        nuevoDetalle.cantidad = 1;
        nuevoDetalle.subTotal = articulo.precioVenta;
        nuevoPedido.detallePedidos.push(nuevoDetalle);
      }

      nuevoPedido.total += articulo.precioVenta;

      
      setPedido(nuevoPedido);
      setPreferenceId('');
      setError('');
    }
  };
  const quitarDelCarrito = (index: number) => {
    const detalle = pedido.detallePedidos[index];
    if (detalle.articulo && detalle.articulo.precioVenta) {
      detalle.cantidad--;
      if (detalle.cantidad <= 0) {
        pedido.detallePedidos.splice(index, 1);
      } else {
        detalle.subTotal = detalle.articulo.precioVenta * detalle.cantidad;
      }
      pedido.total -= detalle.articulo.precioVenta;

      
      setPedido({ ...pedido });
      
      setPreferenceId('');
    }
  };
  
  
  
  const handleCantidadChange = (index: number, cantidad: number) => {
    setPedido(prevPedido => {
      const newPedido = { ...prevPedido };
      const detalle = newPedido.detallePedidos[index];
      if (!cantidad || cantidad <= 0) {
        setError('La cantidad debe ser mayor que 0');
        return newPedido;
      }
      if (detalle && detalle.articulo && detalle.articulo.precioVenta) {
        const subtotalDetalle = detalle.articulo.precioVenta * cantidad;
        const cambioSubtotal = subtotalDetalle - detalle.subTotal;
        detalle.subTotal = subtotalDetalle;
        newPedido.total += cambioSubtotal;
        detalle.cantidad = cantidad;
        setError('');
      }
      return newPedido;
    });
    setPreferenceId('');
  };
  

  const vaciarCarrito = () => {
    setPedido(new PedidoFull());
    setPreferenceId('');
  };


  const handleCompra = async () => {
    
    if (pedido.detallePedidos.length === 0) {
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
          console.log(pedido)
          console.log(pedido.detallePedidos)
          pedido.cliente=new Cliente();
          pedido.cliente.usuario=new Usuario();
          pedido.cliente.usuario.username=activeUser;
          const data = await PedidoService.agregarPedido({ ...pedido });
          if (data > 0) {
            await getPreferenceMP(data);
            setMsjPedido('Compra realizada con éxito');
          } else {
            setError('Error al realizar el pedido');
          }
        } catch (error) {
          setMsjPedido('Error al realizar el pedido');
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
        detallePedidos: pedido.detallePedidos,
        cliente:pedido.cliente
      };
  
      const response = await createPreferenceMP(pedidoFull);
      if (response) {
        setPreferenceId(response.id);
      }
    } catch (error) {
      setMsjPedido('Error al crear la preferencia de pago');
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
