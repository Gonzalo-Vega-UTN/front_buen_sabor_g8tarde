import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

interface Empresa {
  id: number;
  nombre: string;
  razonsocial: string;
  cuil: number;
}

const EmpresaList: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresas = () => {
    axios.get('http://localhost:8080/api/empresas')
      .then(response => {
        if (Array.isArray(response.data)) {
          setEmpresas(response.data);
        } else {
          console.error('Response is not an array:', response.data);
          setError('Error fetching empresas: Response is not an array');
        }
      })
      .catch(error => {
        console.error('Error fetching empresas:', error);
        setError('Error fetching empresas');
      });
  };

  useEffect(() => {
    fetchEmpresas();
  }, [refresh]);

  return (
    <div>
      <h2>Empresas</h2>
      {error && <p>{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Razon Social</th>
            <th>CUIL</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map(empresa => (
            <tr key={empresa.id}>
              <td>{empresa.id}</td>
              <td>{empresa.nombre}</td>
              <td>{empresa.razonsocial}</td>
              <td>{empresa.cuil}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EmpresaList;
