import React from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/Carrito/ContextCarrito";
import Home from "./components/Home/Home";
import AcercaDe from "./pages/AcercaDe";
import FormularioTrabajo from "./pages/Empleado/FormularioTrabajo";
import DashboardPage from "./pages/ArtManufacturado/DashBoard";
import { UnidadesMedidaList } from "./pages/UnidadMedida/UnidadMedidaList";
import { FormularioArtManuf } from "./pages/ArtManufacturado/FormularioArtManuf";
import ArticuloInsumoPage from "./pages/ArticuloInsumo/ArticulosInsumosPage";
import EmpresasPage from "./pages/EmpresasPage";
import SucursalesPage from "./pages/SucursalPage";
import { Reportes } from "./pages/Reportes/Reportes";
import { PedidosList } from "./pages/PedidosList";
import ClientTable from "./pages/ClientesList";
import { CategoriaPage } from "./pages/Categoria/CategoriaPage";
import PromocionesPage from "./pages/Promocion/PromocionesPage";
import PromocionForm from "./pages/Promocion/FormularioPromocion";
import { PedidosCajero } from "./components/PedidosXEstado/PedidosCajero";
import { PedidosCocinero } from "./components/PedidosXEstado/PedidosCocinero";
import { PedidosDelivery } from "./components/PedidosXEstado/PedidosDelivery";
import FormularioDomicilio from "./pages/Domicilio/FormDomicilio";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";
import { AuthenticationGuard } from "./Auth/AuthenticationGuard";
import AppRoutes from "./routes/AppRoutes";

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

const App = () => <AppContent />;

export default App;
