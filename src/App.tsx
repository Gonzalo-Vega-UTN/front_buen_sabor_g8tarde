import  { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import SucursalDropdown from './components/SucursalDropdown/SucursalDropdown';
import EmpresaDropdown from './components/EmpresaDropdown/EmpresaDropdown';
import './custom.css';
import { useAuth0Extended } from './Auth/Auth0ProviderWithNavigate';
import { useNavigate } from 'react-router-dom';

const AppContent = () => {

  const { activeEmpresa, selectEmpresa} = useAuth0Extended();
  const navigate = useNavigate();

  if(!activeEmpresa){
    navigate("/empresas");
  }
  return (
    <div className="container-fluid p-0 layout">
      <div className="row g-0">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 d-flex flex-column min-vh-100">
          <div className="dropdown-container">
            <div className="dropdown-wrapper">
              <EmpresaDropdown onEmpresaChange={selectEmpresa} />
              {activeEmpresa && <SucursalDropdown empresaId={activeEmpresa} />}
            </div>
          </div>
          <main className="flex-grow-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AppContent;
