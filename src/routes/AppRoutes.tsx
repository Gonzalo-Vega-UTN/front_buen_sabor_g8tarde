import React from 'react';
import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import ArticuloInsumoPage from "../pages/ArticulosInsumosPage";
import { FormularioArtManuf } from "../pages/FormularioArtManuf";
import EmpresasPage from '../pages/EmpresasPage';
import SucursalesPage from "../pages/SucursalPage";
import Home from "../components/Home/Home";
import { CartProvider } from "../components/Carrito/ContextCarrito";
import PrivateRoute from '../PrivateRoute/PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <CartProvider>
          <Home />
        </CartProvider>
      }/>

      <Route path="/dashboard" element={
        <PrivateRoute element={DashboardPage} roles={['Admin']} />
      } />
      <Route path="/productos" element={
        <PrivateRoute element={DashboardPage} roles={['Admin']} />
      } />
      <Route path="/create-product/:id" element={
        <PrivateRoute element={FormularioArtManuf} roles={['Admin']} />
      } />
      <Route path="/ingredientes" element={
        <PrivateRoute element={ArticuloInsumoPage} roles={['Admin']} />
      } />
      <Route path="/empresas" element={
        <PrivateRoute element={EmpresasPage} roles={['Admin']} />
      } />
      <Route path="/sucursales" element={
        <PrivateRoute element={SucursalesPage} roles={['admin']} />
      } />
      <Route path="/sucursales/:id" element={
        <PrivateRoute element={SucursalesPage} roles={['admin']} />
      } />
    </Routes>
  );
}
