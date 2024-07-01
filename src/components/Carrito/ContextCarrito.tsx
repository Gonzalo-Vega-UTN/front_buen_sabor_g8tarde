import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import PedidoFull from "../../entities/DTO/Pedido/PedidoFull";
import { useAuth } from "../../Auth/Auth";
import ModalConfirm from "../modals/ModalConfirm";
import { createPreferenceMP } from "../../services/MPService";
import { DetallePedido } from "../../entities/DTO/Pedido/DetallePedido";
import { Articulo } from "../../entities/DTO/Articulo/Articulo";
import PedidoService from "../../services/PedidoService";
import { Cliente } from "../../entities/DTO/Cliente/Cliente";
import Usuario from "../../entities/DTO/Usuario/Usuario";
import { Promocion } from "../../entities/DTO/Promocion/Promocion";
import PromocionService from "../../services/PromocionService";

interface CartContextType {
  pedido: PedidoFull;
  promocionesAplicadas: Promocion[];
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
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [promocionesAplicada, setPromocionesAplicada] = useState<Promocion[]>([]);
  const [pedido, setPedido] = useState<PedidoFull>(new PedidoFull());
  const [error, setError] = useState<string>("");
  const {activeUser, activeSucursal } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    text: "",
    onConfirm: () => { },
    onCancel: () => { },
  });
  const [preferenceId, setPreferenceId] = useState<string>("");
  const [promociones, setPromociones] = useState<Promocion[]>([]);

  const [msjPedido, setMsjPedido] = useState<string>("");

  const fetchPromociones = async () => {
    setPromociones(
      await PromocionService.getAllBySucursal(Number(activeSucursal))
    );
  };

  useEffect(() => {
    if (activeSucursal) {
      fetchPromociones();
    }
  }, [activeSucursal]);

  const agregarAlCarrito = (articulo: Articulo | undefined) => {
    if (articulo) {
      const nuevoPedido = { ...pedido };
      const detalleExistente = nuevoPedido.detallePedidos.find(
        (detalle) => detalle.articulo?.id === articulo.id
      );

      
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
      //Verificar Promocion
      const promocionesAplicables = verificarPromociones(nuevoPedido, promociones);
      console.log(promocionesAplicables)
      setPromocionesAplicada(promocionesAplicables)
      // Sumar el precio del artículo al total
      nuevoPedido.total += articulo.precioVenta;

      setPedido(nuevoPedido);
      setPreferenceId("");
      setError("");
    }
  };

  const verificarPromociones = (pedido: PedidoFull, promociones: Promocion[]): Promocion[] => {
    return promociones.filter((promocion) =>
      aplicarDescuento(pedido, promocion)
    );
  };

  const aplicarDescuento = (pedido: PedidoFull, promocion: Promocion): boolean => {
    const pedidoMap = new Map<Articulo, number>();
    // Mapear los artículos y sus cantidades en el pedido
    pedido.detallePedidos.forEach((detalle) => {
      pedidoMap.set(
        detalle.articulo,
        detalle.cantidad
      );
    });

    // Verificar si los artículos y cantidades de la promoción están en el pedido
    for (const detallePromocion of promocion.detallesPromocion) {
      const cantidadNecesaria = detallePromocion.cantidad;
      if (
        !pedidoMap.has(detallePromocion.articulo) || pedidoMap.get(detallePromocion.articulo)! < cantidadNecesaria
      ) {
        console.log("RECONOCE EL ARTICULO", !pedidoMap.has(detallePromocion.articulo))
        console.log("RECONOCE LA CANTIDAD", pedidoMap.get(detallePromocion.articulo)! < cantidadNecesaria)
        return false;
      }
    }

    return true;
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
      setPreferenceId("");
    }
  };

  const handleCantidadChange = (index: number, cantidad: number) => {
    setPedido((prevPedido) => {
      const newPedido = { ...prevPedido };
      const detalle = newPedido.detallePedidos[index];
      if (!cantidad || cantidad <= 0) {
        setError("La cantidad debe ser mayor que 0");
        return newPedido;
      }
      if (detalle && detalle.articulo && detalle.articulo.precioVenta) {
        const subtotalDetalle = detalle.articulo.precioVenta * cantidad;
        const cambioSubtotal = subtotalDetalle - detalle.subTotal;
        detalle.subTotal = subtotalDetalle;
        newPedido.total += cambioSubtotal;
        detalle.cantidad = cantidad;
        setError("");
      }
      return newPedido;
    });
    setPreferenceId("");
  };

  const vaciarCarrito = () => {
    setPedido(new PedidoFull());
    setPromocionesAplicada([])
    setPreferenceId("");
  };

  const handleCompra = async () => {
    if (pedido.detallePedidos.length === 0) {
      setError("El carrito debe tener al menos un producto.");
      return;
    } else {
      setError("");
    }

    setShowModal(true);
    setModalConfig({
      title: "Confirmar Compra",
      text: "¿Estás seguro de realizar la compra?",
      onConfirm: async () => {
        setShowModal(false);
        try {
          pedido.cliente = new Cliente();
          pedido.cliente.usuario = new Usuario();
          pedido.cliente.usuario.username = activeUser;

          const data = await PedidoService.agregarPedido({ ...pedido });
          if (data > 0) {
            await getPreferenceMP(data);
            setMsjPedido("Compra realizada con éxito");
          } else {
            setError("Error al realizar el pedido");
          }
        } catch (error) {
          setMsjPedido("Error al realizar el pedido");
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
        alta: true,
        horaEstimadaFinalizacion: "",
        total: pedido.total,
        totalCosto: pedido.totalCosto,
        estado: pedido.estado,
        tipoEnvio: pedido.tipoEnvio,
        formaPago: pedido.formaPago,
        fechaPedido: pedido.fechaPedido,
        domicilio: pedido.domicilio,
        detallePedidos: pedido.detallePedidos,
        cliente: pedido.cliente,
        sucursal: pedido.sucursal
      };

      const response = await createPreferenceMP(pedidoFull);
      if (response) {
        setPreferenceId(response.id);
      }
    } catch (error) {
      setMsjPedido("Error al crear la preferencia de pago");
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        pedido,
        promocionesAplicadas: promocionesAplicada,
        agregarAlCarrito,
        quitarDelCarrito,
        vaciarCarrito,
        handleCompra,
        error,
        handleCantidadChange,
        preferenceId,
      }}
    >
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
