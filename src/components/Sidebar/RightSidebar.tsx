import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useAuth0Extended } from '../../Auth/Auth0ProviderWithNavigate';
import EmpresaDropdown from '../EmpresaDropdown/EmpresaDropdown';
import SucursalDropdown from '../SucursalDropdown/SucursalDropdown';

const RightSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeEmpresa, selectEmpresa } = useAuth0Extended();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`right-sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </button>
      <div className="sidebar-content">
        <EmpresaDropdown onEmpresaChange={selectEmpresa} />
        {activeEmpresa && <SucursalDropdown empresaId={activeEmpresa} />}
      </div>
    </div>
  );
};

export default RightSidebar;