import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { ProductServices } from "../../services/ProductServices";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";
import { toast } from "react-toastify";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { ArticuloManufacturado } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import Formulario from "../formComponents/Formulario";

type ProductModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  prod: ArticuloManufacturado;
  products: React.Dispatch<React.SetStateAction<ArticuloManufacturado[]>>;
  handleSave : (producto :ArticuloManufacturado) => void;
};

export default function ProductModal({
  show,
  onHide,
  title,
  modalType,
  prod,
  products,
  handleSave
}: ProductModalProps) {

  const [ingredients, setIngredients] = useState<ArticuloInsumo[]>([]);

  useEffect(() => {
    const fetchArticuloInsumo = async () => {
      const ArticuloInsumo = await ArticuloInsumosServices.getArticuloInsumo();
      setIngredients(ArticuloInsumo);
    };
    fetchArticuloInsumo();
  }, []);

  

  const handleDelete = async () => {
    try {
      await ProductServices.deleteProduct(prod.id);
      products((prevProducts) =>
        prevProducts.filter((products) => products.id !== prod.id)
      );
      toast.success("Producto eliminado con exito", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };


  return (
    <>
      {modalType === ModalType.DELETE ? (
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
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            className="modal-xl"
          >
            <Modal.Header>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formulario onHide={onHide} articuloExistente={prod} handleSave={handleSave}></Formulario>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
}
