import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";

import ArticuloInsumoPage from "../pages/ArticulosInsumosPage";
import { FormularioArtManuf } from "../pages/FormularioArtManuf";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/productos" element={<DashboardPage />} />
      <Route path="/create-product">
        <Route path=":id" element={<FormularioArtManuf />} ></Route>
      </Route>
      <Route path="/ingredientes" element={<ArticuloInsumoPage />} />
    </Routes>
  );
}