import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth0Extended } from '../../Auth/Auth0ProviderWithNavigate';
import { Sucursal } from '../../entities/DTO/Sucursal/Sucursal';
import SucursalService from '../../services/SucursalService';

const SucursalDropdown: React.FC = () => {
  const { selectSucursal, activeSucursal } = useAuth0Extended();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const data = await SucursalService.fetchSucursales();
        setSucursales(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las sucursales');
        setLoading(false);
      }
    };

    fetchSucursales();
  }, []);

  const handleSucursalChange = (sucursalId: number) => {
    selectSucursal(sucursalId);
  };

  if (loading) {
    return <div className="text-right text-muted">Cargando sucursales...</div>;
  }

  if (error) {
    return <div className="text-right text-danger">{error}</div>;
  }

  return (
    <div className="position-absolute top-0 end-0 m-3">
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
