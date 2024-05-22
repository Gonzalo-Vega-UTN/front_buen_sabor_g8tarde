import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import ArticuloInsumoPage from "../pages/ArticulosInsumosPage";
import { FormularioArtManuf } from "../pages/FormularioArtManuf";
import EmpresasPage from '../pages/EmpresasPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/productos" element={<DashboardPage />} />
      <Route path="/create-product">
        <Route path=":id" element={<FormularioArtManuf />} />
      </Route>
      <Route path="/ingredientes" element={<ArticuloInsumoPage />} />
      <Route path="/empresas" element={<EmpresasPage />} />
    </Routes>
  );
}
