import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import ArticuloInsumoPage from "../pages/ArticulosInsumosPage";
import { FormularioArtManuf } from "../pages/FormularioArtManuf";
import EmpresasPage from '../pages/EmpresasPage';
import SucursalesPage from "../pages/SucursalPage";
import Home from "../components/Home/Home";
import { CartProvider } from "../components/Carrito/ContextCarrito";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { Rol } from "../entities/enums/Rol";
import { PedidosList } from "../pages/PedidosList";
import { CategoriasList } from "../pages/CategoriasList";
import RegistroUsuarioCliente from "../components/Log-Register/FormRegistro";
import ClienteFormulario from "../components/Log-Register/ClienteFormulario";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={

        <CartProvider>
          <Home />
        </CartProvider>} />
      { /* <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/productos" element={<DashboardPage />} />
      <Route path="/create-product/:id" element={<FormularioArtManuf />} />
      <Route path="/ingredientes" element={<ArticuloInsumoPage />} />
      <Route path="/empresas" element={<EmpresasPage />} />
      <Route path="/sucursales" element={<SucursalesPage />} />
      <Route path="/sucursales/:id" element={<SucursalesPage />} /> */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute
            element={DashboardPage}
            roles={[Rol.Admin]} // Ejemplo: accesible para admin y user
          />
        }
      />
      <Route path="/registro" element={<RegistroUsuarioCliente/>}/>
      <Route path="/perfil" element={<ClienteFormulario />} /> 
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
        path="/create-product/:id"
        element={
          <PrivateRoute
            element={FormularioArtManuf}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/ingredientes"
        element={
          <PrivateRoute
            element={ArticuloInsumoPage}
            roles={[Rol.Admin]} // Solo admin puede acceder
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
        path="/estadisticas"
        element={
          <PrivateRoute
            element={SucursalesPage} //Recordar cambiar
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
        path="/categorias"
        element={
          <PrivateRoute
            element={CategoriasList} //Recordar cambiar
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />

    </Routes>
  );
}