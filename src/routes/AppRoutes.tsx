import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import ArticuloInsumoPage from "../pages/ArticulosInsumosPage";
import { FormularioArtManuf } from "../pages/FormularioArtManuf";
import EmpresasPage from '../pages/EmpresasPage';
import SucursalesPage from "../pages/SucursalPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/productos" element={<DashboardPage />} />
      <Route path="/create-product/:id" element={<FormularioArtManuf />} /> {/* Corregido el enrutamiento */}
      <Route path="/ingredientes" element={<ArticuloInsumoPage />} />
      <Route path="/empresas" element={<EmpresasPage />} />
      <Route path="/sucursales" element={<SucursalesPage />} />
      <Route path="/sucursales/:id" element={<SucursalesPage />} />
    </Routes>
  );
}
