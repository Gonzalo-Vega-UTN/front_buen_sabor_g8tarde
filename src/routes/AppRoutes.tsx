import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";

import ArticuloInsumoPage from "../pages/ArticulosInsumosPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/productos" element={<DashboardPage />} />
    
      <Route path="/ingredientes" element={<ArticuloInsumoPage />} />
    </Routes>
  );
}
