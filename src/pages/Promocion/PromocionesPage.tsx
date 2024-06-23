import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Promocion } from "../../entities/DTO/Promocion/Promocion";
import PromocionService from "../../services/PromocionService";
import CustomButton from "../../components/generic/GenericButton";
import GenericButton from "../../components/generic/GenericButton";
import { FaSave } from "react-icons/fa";
import PromModal from "./ModalPromocion";

export default function PromotionTable() {
  const navigate = useNavigate();

  const [promotion, setPromotion] = useState<Promocion>(new Promocion());
  const [promotions, setPromotions] = useState<Promocion[]>([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>();

  const [searchedDenominacion, setSearchedDenominacion] = useState<string>();
  // const para manejar el estado del modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  const handleClick = (id: number) => {
    navigate("/create-promotion/" + id);
  };

  const handleClickEliminar = (newTitle: string, promo: Promocion) => {
    setTitle(newTitle);
    setShowModal(true);
    setPromotion(promo);
  };

  const handleDelete = async (id: number) => {
    try {
      await PromocionService.delete(id);
      setShowModal(false);
      fetchPromotions();
    } catch (error) {
      console.error(error);
    }
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
        className="mt-4 mb-3"
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
            <th>Tipo Promocion</th>
            <th>Precio Promocional</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr
              key={promotion.id}
              className="text-center"
              style={{ backgroundColor: !promotion.alta ? '#d3d3d3' : 'inherit' }}
            >
              <td>{promotion.id}</td>
              <td>{promotion.denominacion}</td>
              <td>{promotion.fechaDesde.toString()}</td>
              <td>{promotion.fechaHasta.toString()}</td>
              <td>{promotion.horaDesde}</td>
              <td>{promotion.horaHasta}</td>
              <td>{promotion.tipoPromocion}</td>
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
                <GenericButton
                  color={promotion.alta ? "#D32F2F" : "#50C878"}
                  size={23}
                  icon={promotion.alta ? BsTrashFill : FaSave}
                  onClick={() =>
                    handleClickEliminar(
                      "Alta/Baja Articulo",
                      promotion
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <PromModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title={title}
          handleDelete={handleDelete}
          promo={promotion}
        />
      )}
    </div>
  );
}
