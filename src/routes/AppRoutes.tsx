import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import ArticuloInsumoPage from "../pages/ArticulosInsumosPage";
import { FormularioArtManuf } from "../pages/FormularioArtManuf";
import EmpresasPage from '../pages/EmpresasPage';
import SucursalesPage from "../pages/SucursalPage";
import Home from "../components/Home/Home";
import { CartProvider } from "../components/Carrito/ContextCarrito";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        
      <CartProvider>
        <Home/>
      </CartProvider>}/>
      
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/productos" element={<DashboardPage />} />
      <Route path="/create-product/:id" element={<FormularioArtManuf />} />
      <Route path="/ingredientes" element={<ArticuloInsumoPage />} />
      <Route path="/empresas" element={<EmpresasPage />} />
      <Route path="/sucursales" element={<SucursalesPage />} />
      <Route path="/sucursales/:id" element={<SucursalesPage />} />

    </Routes>
  );
}
