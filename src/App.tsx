import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import SucursalDropdown from './components/SucursalDropdown/SucursalDropdown';
import EmpresaDropdown from './components/EmpresaDropdown/EmpresaDropdown';
import './custom.css';

const AppContent = () => {
  const location = useLocation();
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);

  const handleEmpresaChange = (empresaId: number) => {
    setSelectedEmpresaId(empresaId);
  };

  return (
    <div className="container-fluid p-0 layout">
      <div className="row g-0">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 d-flex flex-column min-vh-100">
          <div className="dropdown-container">
            <div className="dropdown-wrapper">
              <EmpresaDropdown onEmpresaChange={handleEmpresaChange} />
              {selectedEmpresaId && <SucursalDropdown empresaId={selectedEmpresaId} />}
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
