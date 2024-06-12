import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Promocion } from "../entities/DTO/Promocion/Promocion";
import { ModalType } from "../types/ModalType";
import PromocionService from "../services/PromocionService";
import CustomButton from "../components/generic/Button";

export default function PromotionTable() {
  const navigate = useNavigate();

  const [promotion, setPromotion] = useState<Promocion>(new Promocion());
  const [promotions, setPromotions] = useState<Promocion[]>([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>();

  const [searchedDenominacion, setSearchedDenominacion] = useState<string>();

  const handleClick = (id: number) => {
    console.log("Promo",promotion)
    console.log("Promones",promotions)
    navigate("/create-promotion/" + id);
  };

  const handleClickEliminar = (newTitle: string, promo: Promocion, modal: ModalType) => {
    
    setPromotion(promo);
  };

  

  const fetchPromotions = async (idCategoria?: number, denominacion?: string) => {
    const promotionsFiltered = await PromocionService.getAll(/*idCategoria, denominacion*/);
    setPromotions(promotionsFiltered);
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

 


  useEffect(() => {
    fetchPromotions(categoriaSeleccionada, searchedDenominacion);
  }, [categoriaSeleccionada, searchedDenominacion]);

  return (
    <div className="container">
      <CustomButton
        classes="mt-4 mb-3"
        color="#4CAF50"
        size={25}
        icon={CiCirclePlus}
        text="Nueva Promoción"
        onClick={() => handleClick(0)}
      />
      <Table hover>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Denominación</th>
            <th>Fecha Desde</th>
            <th>Fecha Hasta</th>
            <th>Hora Desde</th>
            <th>Hora Hasta</th>
            <th>Precio Promocional</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion.id} className="text-center">
              <td>{promotion.id}</td>
              <td>{promotion.denominacion}</td>
              <td>{promotion.fechaDesde}</td>
              <td>{promotion.fechaHasta}</td>
              <td>{promotion.horaDesde}</td>
              <td>{promotion.horaHasta}</td>
              <td>{promotion.precioPromocional}</td>
              <td>
                <CustomButton
                  color="#FBC02D"
                  size={23}
                  icon={BsFillPencilFill}
                  onClick={() => handleClick(promotion.id)}
                />
              </td>
              <td>
                <CustomButton
                  color="#D32F2F"
                  size={23}
                  icon={BsTrashFill}
                  onClick={() =>
                    handleClickEliminar("Eliminar Promoción", promotion, ModalType.DELETE)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

     
    </div>
  );
}
