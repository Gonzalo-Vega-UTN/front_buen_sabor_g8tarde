import { useEffect, useState } from "react";
import { ProductServices } from "../../services/ProductServices";
import { Table } from "react-bootstrap";
import Button from "../generic/Button"
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { ModalType } from "../../types/ModalType";
import { StateType } from "../../types/StateType";

import ProductModal from "../modals/ProductModal";
import { ArticuloManufacturado } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";

export default function ProductTable() {

  //Producto seleccionado que se va a pasar como prop al modal
  const [product, setProduct] = useState<ArticuloManufacturado>(new ArticuloManufacturado());
  const [products, setProducts] = useState<ArticuloManufacturado[]>([]);

  //const para manejar el estado del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  //Logica del modal
  const handleClick = (newTitle: string, prod: ArticuloManufacturado, modal: ModalType) => {
    setTitle(newTitle);
    setModalType(modal);
    setProduct(prod);
    setShowModal(true);
  };

  //Estado que contiene los productos recibidos de nuestra API

  //Variable que muestra el componente Loader
  const [, setIsLoading] = useState(true);

  //El useEffect se ejecuta cada vez que se renderice el componente
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await ProductServices.getProducts();
      setProducts(products);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <Button classes="mt-4 mb-3" color="#4CAF50" size={25} icon={CiCirclePlus} text="Nuevo Producto" onClick={() =>
        handleClick(
          "Nuevo Producto",
          product,
          ModalType.CREATE
        )}
      />

      <Table hover>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Nombre</th>
            <th>Tiempo de Cocina</th>
            <th>Precio Venta</th>
            <th>Categoria</th>

            <th>Estado</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-center">
              <td>{product.id}</td>
              <td>{product.denominacion}</td>
              <td>{product.tiempoEstimadoMinutos} min</td>
              <td>$ {(product.precioVenta).toFixed(2)}</td>
              <td>{product.categoria?.denominacion}</td>
              <td>{product.alta ? "Activo" : "Inactivo"}</td>
              <td>
                <Button color="#FBC02D" size={23} icon={BsFillPencilFill} onClick={() =>
                  handleClick(
                    "Editar Producto",
                    product,
                    ModalType.UPDATE)
                } />
              </td>
              <td>
                <Button color="#D32F2F" size={23} icon={BsTrashFill} onClick={() =>
                  handleClick(
                    "Eliminar Producto",
                    product,
                    ModalType.DELETE
                  )
                } />

              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <ProductModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title={title}
          modalType={modalType}
          prod={product}
          products={setProducts}
        />
      )}
    </div>
  );
}
