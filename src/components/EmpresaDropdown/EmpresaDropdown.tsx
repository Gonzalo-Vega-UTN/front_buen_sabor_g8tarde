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
  const { activeEmpresa } = useAuth0Extended();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await EmpresaService.fetchEmpresas();
        setEmpresas(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las empresas');
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const handleEmpresaChange = (empresaId: number) => {
    onEmpresaChange(empresaId);
  };

  if (loading) {
    return <div className="text-right text-muted">Cargando empresas...</div>;
  }

  if (error) {
    return <div className="text-right text-danger">{error}</div>;
  }

  // Ocultar en rutas específicas
  if (location.pathname === '/' || location.pathname === '/unidadmedida') {
    return null;
  }

  return (
    <div className="empresa-dropdown">
      <label htmlFor="empresa-dropdown" className="form-label">Empresa:</label>
      <select
        id="empresa-dropdown"
        className="form-select"
        value={activeEmpresa}
        onChange={(e) => handleEmpresaChange(Number(e.target.value))}
      >
        <option value="" disabled>Selecciona una empresa</option>
        {empresas.map((empresa) => (
          <option key={empresa.id} value={empresa.id}>
            {empresa.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmpresaDropdown;
