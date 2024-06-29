import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/Carrito/ContextCarrito';
import Home from './components/Home/Home';
import AcercaDe from './pages/AcercaDe';
import FormularioTrabajo from './pages/Empleado/FormularioTrabajo';
import DashboardPage from './pages/ArtManufacturado/DashBoard';
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
    <Route path="/productos" element={<AuthenticationGuard component={DashboardPage} />} />
    <Route path="/unidadmedida" element={<AuthenticationGuard component={UnidadesMedidaList} />} />
    <Route path="/create-product/:id" element={<AuthenticationGuard component={FormularioArtManuf} />} />
    <Route path="/ingredientes" element={<AuthenticationGuard component={ArticuloInsumoPage} />} />
    <Route path="/empresas" element={<AuthenticationGuard component={EmpresasPage} />} />
    <Route path="/sucursales" element={<AuthenticationGuard component={SucursalesPage} />} />
    <Route path="/sucursales/:id" element={<AuthenticationGuard component={SucursalesPage} />} />
    <Route path="/reportes" element={<AuthenticationGuard component={Reportes} />} />
    <Route path="/pedidos" element={<AuthenticationGuard component={PedidosList} />} />
    <Route path="/clientes" element={<AuthenticationGuard component={ClientTable} />} />
    <Route path="/categorias" element={<AuthenticationGuard component={CategoriaPage} />} />
    <Route path="/promociones" element={<AuthenticationGuard component={PromocionesPage} />} />
    <Route path="/create-promotion/:id" element={<AuthenticationGuard component={PromocionForm} />} />
    <Route path="/PedidosCajero" element={<AuthenticationGuard component={PedidosCajero} />} />
    <Route path="/PedidosCocinero" element={<AuthenticationGuard component={PedidosCocinero} />} />
    <Route path="/PedidosDelivery" element={<AuthenticationGuard component={PedidosDelivery} />} />
    <Route path="/Domicilio" element={<AuthenticationGuard component={FormularioDomicilio} />} />
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