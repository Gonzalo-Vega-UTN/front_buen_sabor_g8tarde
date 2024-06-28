import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/Carrito/ContextCarrito';
import Home from './components/Home/Home';
import AcercaDe from './pages/AcercaDe';
import FormularioTrabajo from './pages/Empleado/FormularioTrabajo';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import DashboardPage from './pages/ArtManufacturado/DashBoard';
import { Rol } from './entities/enums/Rol';
import { UnidadesMedidaList } from './pages/UnidadMedida/UnidadMedidaList';
import { FormularioArtManuf } from './pages/ArtManufacturado/FormularioArtManuf';
import ArticuloInsumoPage from './pages/ArticuloInsumo/ArticulosInsumosPage';
import EmpresasPage from './pages/EmpresasPage';
import SucursalesPage from './pages/SucursalPage';
import { Reportes } from './pages/Reportes/Reportes';
import { PedidosList } from './pages/PedidosList';
import ClientTable from './pages/ClientesList';
import { CategoriaPage } from './pages/Categoria/CategoriaPage';
import PromocionesPage from './pages/Promocion/PromocionesPage';
import PromocionForm from './pages/Promocion/FormularioPromocion';
import { PedidosCajero } from './components/PedidosXEstado/PedidosCajero';
import { PedidosCocinero } from './components/PedidosXEstado/PedidosCocinero';
import { PedidosDelivery } from './components/PedidosXEstado/PedidosDelivery';
import FormularioDomicilio from './pages/Domicilio/FormDomicilio';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import { AuthenticationGuard } from './Auth/AuthenticationGuard';


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={
      <CartProvider>
        <Home />
      </CartProvider>
    } />
    <Route path="/acerca-de" element={<AcercaDe />} />
    <Route path="/formulario-empleado" element={<FormularioTrabajo />} />
    <Route path="/productos" element={
      <PrivateRoute element={DashboardPage} roles={[Rol.Admin]} />
    } />
    <Route path="/unidadmedida" element={
      <PrivateRoute element={UnidadesMedidaList} roles={[Rol.Admin, Rol.Cocinero]} />
    } />
    <Route path="/create-product/:id" element={
      <PrivateRoute element={FormularioArtManuf} roles={[Rol.Admin, Rol.Cocinero]} />
    } />
    <Route path="/ingredientes" element={
      <PrivateRoute element={ArticuloInsumoPage} roles={[Rol.Admin, Rol.Cocinero]} />
    } />
    <Route path="/empresas" element={
      <PrivateRoute element={EmpresasPage} roles={[Rol.Admin]} />
    } />
    <Route path="/sucursales" element={
      <PrivateRoute element={SucursalesPage} roles={[Rol.Admin]} />
    } />
    <Route path="/sucursales/:id" element={
      <PrivateRoute element={SucursalesPage} roles={[Rol.Admin]} />
    } />
    <Route path="/reportes" element={
      <PrivateRoute element={Reportes} roles={[Rol.Admin]} />
    } />
    <Route path="/pedidos" element={
      <PrivateRoute element={PedidosList} roles={[Rol.Admin]} />
    } />
    <Route path="/clientes" element={
      <PrivateRoute element={ClientTable} roles={[Rol.Admin]} />
    } />
    <Route path="/categorias" element={
      <PrivateRoute element={CategoriaPage} roles={[Rol.Admin]} />
    } />
    <Route path="/promociones" element={
      <PrivateRoute element={PromocionesPage} roles={[Rol.Admin, Rol.Cocinero]} />
    } />
    <Route path="/create-promotion/:id" element={
      <PrivateRoute element={PromocionForm} roles={[Rol.Admin, Rol.Cocinero]} />
    } />
    <Route path="/PedidosCajero" element={
      <PrivateRoute element={PedidosCajero} roles={[Rol.Admin, Rol.Cajero]} />
    } />
    <Route path="/PedidosCocinero" element={
      <PrivateRoute element={PedidosCocinero} roles={[Rol.Admin, Rol.Cocinero]} />
    } />
    <Route path="/PedidosDelivery" element={
      <PrivateRoute element={PedidosDelivery} roles={[Rol.Admin, Rol.Delivery]} />
    } />
    <Route path="/Domicilio" element={
      <PrivateRoute element={FormularioDomicilio} roles={[Rol.Admin]} />
    } />
  </Routes>
);

const AppContent = () => (
  <div className="container-fluid p-0 layout">
    <div className="row g-0">
      <div className="col-md-2">
        <Sidebar />
      </div>
      <div className="col-md-10 d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  </div>
);

const AppWithProviders = () => (
  <CartProvider>
    <AuthenticationGuard component={AppContent} />
  </CartProvider>
);

const App = () => (
  <AppWithProviders />
);

export default App;
