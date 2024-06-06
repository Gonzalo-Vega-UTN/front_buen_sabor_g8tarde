import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/Auth';
import Instrumento from '../../entidades/instrumentos';
import { getInstrumentosFetch } from '../../servicios/funcionApi';
import ItemInstrumento from './ObjLista/itemInstrumento';
import MenuOpciones from '../MenuOpciones';
import Carrito from '../Carrito/carrito';

const Lista: React.FC = () => {
  const { isAuthenticated, activeUser } = useAuth();
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);

  const actualizarListaInstrumentos = async () => {
    try {
      const datos: Instrumento[] = await getInstrumentosFetch();
      setInstrumentos(datos);
    } catch (error) {
      console.error('Error al cargar instrumentos:', error);
    }
  };

  useEffect(() => {
    const fetchInstrumentos = async () => {
      try {
        const datos: Instrumento[] = await getInstrumentosFetch();
        setInstrumentos(datos);
      } catch (error) {
        console.error('Error al cargar instrumentos:', error);
      }
    };

    fetchInstrumentos();
  }, []);

  return (
    <>
      <MenuOpciones />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              {instrumentos.map((instrumento: Instrumento) => (
                <div key={instrumento.id} className="col-md-6 mb-4">
                  <ItemInstrumento instrumento={instrumento} />
                </div>
              ))}
            </div>
          </div>
          {isAuthenticated && (
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Carrito</h5>
                  <Carrito actualizarListaInstrumentos={actualizarListaInstrumentos}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Lista;
