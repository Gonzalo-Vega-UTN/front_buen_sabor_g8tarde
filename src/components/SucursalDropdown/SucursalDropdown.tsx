import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth0Extended } from '../../Auth/Auth0ProviderWithNavigate';
import { Sucursal } from '../../entities/DTO/Sucursal/Sucursal';
import SucursalService from '../../services/SucursalService';

interface SucursalDropdownProps {
  empresaId: number;
}

const SucursalDropdown: React.FC<SucursalDropdownProps> = ({ empresaId }) => {
  const location = useLocation();
  const { activeSucursal } = useAuth0Extended();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const data = await SucursalService.fetchSucursalesByEmpresaId(empresaId);
        setSucursales(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las sucursales');
        setLoading(false);
      }
    };

    if (empresaId) {
      fetchSucursales();
    }
  }, [empresaId]);

  const handleSucursalChange = (sucursalId: number) => {
    console.log("Sucursal seleccionada: ", sucursalId);
  };

  if (loading) {
    return <div className="text-right text-muted">Cargando sucursales...</div>;
  }

  if (error) {
    return <div className="text-right text-danger">{error}</div>;
  }

  // Ocultar en rutas específicas
  if (location.pathname === '/' || location.pathname === '/unidadmedida' || location.pathname === '/empresas' ) {
    return null;
  }

  return (
    <div className="sucursal-dropdown">
      <label htmlFor="sucursal-dropdown" className="form-label">Sucursal:</label>
      <select
        id="sucursal-dropdown"
        className="form-select"
        value={activeSucursal}
        onChange={(e) => handleSucursalChange(Number(e.target.value))}
      >
        <option value="" disabled>Selecciona una sucursal</option>
        {sucursales.map((sucursal) => (
          <option key={sucursal.id} value={sucursal.id}>
            {sucursal.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SucursalDropdown;
