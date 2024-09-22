import  { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { BsTrashFill, BsPencilSquare } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { Promocion } from "../../entities/DTO/Promocion/Promocion";
import PromocionService from "../../services/PromocionService";
import CustomButton from "../../components/generic/GenericButton";
import GenericButton from "../../components/generic/GenericButton";
import { FaSave } from "react-icons/fa";

import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import PromotionFormModal from "./PromotionFormModal";


export default function PromotionTable() {
  const [, setPromocion] = useState<Promocion>(new Promocion());
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedPromocionId, setSelectedPromocionId] = useState<number | undefined>(undefined);
  const [, setTitle] = useState("");

  const { activeSucursal } = useAuth0Extended();

  const handleOpenFormModal = (id?: number) => {
    setSelectedPromocionId(id);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedPromocionId(undefined);
  };

  const handleClickEliminar = (newTitle: string, promo: Promocion) => {
    setTitle(newTitle);
    setShowDeleteModal(true);
    setPromocion(promo);
  };

  async (id: number) => {
    try {
      await PromocionService.delete(Number(activeSucursal), id);
      setShowDeleteModal(false);
      fetchPromotions();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPromotions = async () => {
    const promotionsFiltered = await PromocionService.getAllBySucursal(Number(activeSucursal));
    setPromociones(promotionsFiltered);
  };

  useEffect(() => {
    fetchPromotions();
  }, [activeSucursal]);

  return (
    <div className="container">
      <CustomButton
        className="mt-4 mb-3"
        color="#4CAF50"
        size={25}
        icon={CiCirclePlus}
        text="Nueva Promoción"
        onClick={() => handleOpenFormModal()}
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
          {promociones.map((promotion) => (
            <tr
              key={promotion.id}
              className="text-center"
              style={{ backgroundColor: !promotion.alta ? '#d3d3d3' : 'inherit' }}
            >
              <td>{promotion.id}</td>
              <td>{promotion.denominacion}</td>
              <td>{new Date(promotion.fechaDesde).toLocaleDateString()}</td>
              <td>{new Date(promotion.fechaHasta).toLocaleDateString()}</td>
              <td>{promotion.horaDesde}</td>
              <td>{promotion.horaHasta}</td>
              <td>{promotion.tipoPromocion}</td>
              <td>${promotion.precioPromocional.toFixed(2)}</td>
              <td>
                <GenericButton
                  color="#007bff"
                  size={23}
                  icon={BsPencilSquare}
                  onClick={() => handleOpenFormModal(promotion.id)}
                />
              </td>
              <td>
                <GenericButton
                  color={promotion.alta ? "#D32F2F" : "#50C878"}
                  size={23}
                  icon={promotion.alta ? BsTrashFill : FaSave}
                  onClick={() =>
                    handleClickEliminar(
                      promotion.alta ? "Dar de Baja Promoción" : "Dar de Alta Promoción",
                      promotion
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PromotionFormModal
        show={showFormModal}
        onHide={handleCloseFormModal}
        onSave={fetchPromotions}
        promocionId={selectedPromocionId}
      />
    </div>
  );
}