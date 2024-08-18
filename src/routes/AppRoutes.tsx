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
import RegistroUsuarioCliente from "../components/Log-Register/FormRegistro";
import ClienteFormulario from "../components/Log-Register/ClienteFormulario";
import { FormularioArtManuf } from "../pages/ArtManufacturado/FormularioArtManuf";
import ArticuloInsumoPage from "../pages/ArticuloInsumo/ArticulosInsumosPage";
import { PedidosCajero } from "../components/PedidosXEstado/PedidosCajero";
import { PedidosCocinero } from "../components/PedidosXEstado/PedidosCocinero";
import { PedidosDelivery } from "../components/PedidosXEstado/PedidosDelivery";
import { CategoriaPage } from "../pages/Categoria/CategoriaPage";
import ClientTable from "../pages/ClientesList";
import FormularioDomicilio from "../pages/Domicilio/FormDomicilio";
import EmpresasPage from "../pages/EmpresasPage";
import { PedidosList } from "../pages/PedidosList";
import PromocionForm from "../pages/Promocion/FormularioPromocion";
import PromocionesPage from "../pages/Promocion/PromocionesPage";
import { Reportes } from "../pages/Reportes/Reportes";
import SucursalesPage from "../pages/SucursalPage";
import FormularioCliente from "../pages/Cliente/FormularioCliente";
import SucursalList from "../pages/SucursalList";
import UserList from "../pages/UserList";

export default function AppRoutes() {
  return (
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

      <Route
        path="/registro"
        element={<RegistroUsuarioCliente closeModal={() => console.log("")} />}
      />
      <Route path="/perfil" element={<ClienteFormulario />} />
      <Route path="/misPedidos" element={<MisPedidosList />} />
      <Route path="/formulario-cliente" element={<FormularioCliente />} />
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
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin y Cocinero puede acceder
          />
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute
            element={UserList}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />

      <Route
        path="/create-product/:id"
        element={
          <PrivateRoute
            element={FormularioArtManuf}
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/ingredientes"
        element={
          <PrivateRoute
            element={ArticuloInsumoPage}
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/empresas"
        element={
          <PrivateRoute
            element={EmpresasPage}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/sucursales"
        element={
          <PrivateRoute
            element={SucursalesPage}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/sucursales/:id"
        element={
          <PrivateRoute
            element={SucursalesPage}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/reportes"
        element={
          <PrivateRoute
            element={Reportes} //Recordar cambiar
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/pedidos"
        element={
          <PrivateRoute
            element={PedidosList} //Recordar cambiar
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/clientes"
        element={
          <PrivateRoute
            element={ClientTable}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/categorias"
        element={
          <PrivateRoute
            element={CategoriaPage} //Recordar cambiar
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/promociones"
        element={
          <PrivateRoute
            element={PromocionesPage} //Recordar cambiar
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/create-promotion/:id"
        element={
          <PrivateRoute
            element={PromocionForm}
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/PedidosCajero"
        element={
          <PrivateRoute
            element={PedidosCajero} //Recordar cambiar
            roles={[Rol.Admin, Rol.Cajero]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/PedidosCocinero"
        element={
          <PrivateRoute
            element={PedidosCocinero} //Recordar cambiar
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/PedidosDelivery"
        element={
          <PrivateRoute
            element={PedidosDelivery} //Recordar cambiar
            roles={[Rol.Admin, Rol.Delivery]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/Domicilio"
        element={
          <PrivateRoute
            element={FormularioDomicilio} //Recordar cambiar
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
    </Routes>
  );
}
