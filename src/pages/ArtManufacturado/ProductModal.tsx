import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { ArticuloManufacturado } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
import { useAuth } from "../../Auth/Auth";

type ProductModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  product: ArticuloManufacturado;
  handleDelete : (id: number) => void;
};

export default function ProductModal({
  show,
  onHide,
  title,
  product,
  handleDelete

}: ProductModalProps) {

  const [, setIngredients] = useState<ArticuloInsumo[]>([]);
  const {activeSucursal} = useAuth();


  useEffect(() => {
    const fetchArticuloInsumo = async () => {
      const ArticuloInsumo = await ArticuloInsumoService.obtenerArticulosInsumo(activeSucursal);
      setIngredients(ArticuloInsumo);
    };
    fetchArticuloInsumo();
  }, []);



  


  return (
    <>
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {"¿Esta seguro que desea eliminar el producto?"}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                Cancelar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(product.id)}>
                Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  );
}