import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BotonDetalleProps {
  id: number;
}

const BotonDetalle: React.FC<BotonDetalleProps> = ({ id }) => {
  const navigate = useNavigate();

  const handleDetalleClick = () => {
    navigate(`/instrumento/${id}`);
  };

  return (
    <button className="btn btn-primary" onClick={handleDetalleClick}>
      Detalle
    </button>
    
  );
};

export default BotonDetalle;
