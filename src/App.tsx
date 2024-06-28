import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/Sidebar';
import { CartProvider } from './components/Carrito/ContextCarrito';
import { AuthenticationGuard } from './Auth/AuthenticationGuard';

const AppContent: React.FC = () => {
  return (
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
};

const AppWithProviders: React.FC = () => {
  return (
    <CartProvider>
      <AuthenticationGuard component={AppContent} />
    </CartProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppWithProviders />
    </Router>
  );
};

export default App;
