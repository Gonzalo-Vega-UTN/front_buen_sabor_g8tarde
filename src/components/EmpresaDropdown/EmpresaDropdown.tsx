// src/components/EmpresaDropdown.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Empresa } from '../../entities/DTO/Empresa/Empresa';
import { useAuth0Extended } from '../../Auth/Auth0ProviderWithNavigate';
import { EmpresaService } from '../../services/EmpresaService';

interface EmpresaDropdownProps {
  onEmpresaChange: (empresaId: number) => void;
}

const EmpresaDropdown: React.FC<EmpresaDropdownProps> = ({ onEmpresaChange }) => {
  const location = useLocation();
  const { activeEmpresa, selectEmpresa } = useAuth0Extended();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const empresasData = await EmpresaService.fetchEmpresas();
        setEmpresas(empresasData);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchEmpresas();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value, 10);
    onEmpresaChange(selectedId);
    selectEmpresa(selectedId); // Actualiza empresa activa en el contexto y localStorage
  };

  // Condiciones para ocultar el dropdown en ciertas rutas
  if (location.pathname === '/' || location.pathname === '/unidadmedida' || location.pathname === '/empresas') {
    return null;
  }

  if (loading) return <div className="alert alert-info">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mb-3">
      <label htmlFor="empresaDropdown" className="form-label">Seleccione una Empresa</label>
      <select
        id="empresaDropdown"
        className="form-select"
        onChange={handleChange}
        value={activeEmpresa}
      >
        <option value="">Seleccione una Empresa</option>
        {empresas.map(empresa => (
          <option key={empresa.id} value={empresa.id}>
            {empresa.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmpresaDropdown;
