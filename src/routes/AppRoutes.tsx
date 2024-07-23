
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "../components/Carrito/ContextCarrito";
import Home from "../components/Home/Home";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { Rol } from "../entities/enums/Rol";
import AcercaDe from "../pages/AcercaDe";
import DashboardPage from "../pages/ArtManufacturado/DashBoard";
import { MisPedidosList } from "../pages/Cliente/mipedido";
import FormularioTrabajo from "../pages/Empleado/FormularioTrabajo";
import { UnidadesMedidaList } from "../pages/UnidadMedida/UnidadMedidaList";
import FormularioCliente from "../pages/Cliente/FormularioCliente";

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <CartProvider>
          <Home />
        </CartProvider>
      }
    />
    <Route path="/acerca-de" element={<AcercaDe />} />
    <Route path="/formulario-empleado" element={<FormularioTrabajo />} />
    <Route path="/formulario-cliente" element={<FormularioCliente />} />
    <Route path="/misPedidos" element={<MisPedidosList />} />
    <Route
      path="/productos"
      element={
        <PrivateRoute
          element={DashboardPage}
          roles={[Rol.Admin]} // Solo admin puede acceder
        />
      }
    />
    <Route
      path="/unidadmedida"
      element={
        <PrivateRoute
          element={UnidadesMedidaList}
          roles={[Rol.Admin, Rol.Cocinero]} // Solo admin y cocinero pueden acceder
        />
      }
    />
  </Routes>
);

export default AppRoutes;
