import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from './componentes/Menu.tsx';
import DetalleInstrumento from './componentes/DetalleInstrumento.tsx';
import MenuABM from './componentes/MenuABM.tsx';
import { AuthProvider } from './Context/Auth.tsx';
import Estadisticas from './componentes/Estadisticas.tsx';
import PrivateRoute from './ControlAcceso/PrivateRoute.tsx';
import { CartProvider } from './componentes/Carrito/ContextCarrito.tsx';
import Lista from './componentes/Lista/lista.tsx';
import App from './entidades/App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> 
      <CartProvider> 
        <Routes>
          <Route path="/app" element={<App />} />
          <Route path="/lista" element={<Lista />} /> 
          <Route path='/*' element={<Menu />} />
          <Route path='/instrumento/:id' element={<DetalleInstrumento />} />
          <Route
            path="/estadisticas"
            element={
              <PrivateRoute
                element={Estadisticas}
                roles={['ADMIN']}
              />
            }
          />
           <Route
            path="/abm"
            element={
              <PrivateRoute
                element={MenuABM}
                roles={['ADMIN']}
              />
            }
          />
        </Routes>
        </CartProvider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
