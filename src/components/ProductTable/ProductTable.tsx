import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import { ProductServices } from "../../services/ProductServices";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { StateType } from "../../types/StateType";
import { RubroType } from "../../types/RubroType";
import DeleteButton from "../DeleteButton/DeleteButton";
import EditButton from "../EditButton/EditButton";

import ProductModal from "../ProductModal/ProductModal";

export default function ProductTable() {
  //Inicializamos un producto por defecto cuando vayamos a crear uno nuevo
  const initializableNewProduct = (): Product => {
    return {
      id: 0,
      denominacion: "",
      descripcion: "",
      precioVenta: 0,
      estadoArticulo: StateType.Alta,
      rubro: {
        id: 0,
        denominacion: "",
        estadoRubro: StateType.Alta,
        tipoRubro: RubroType.manufacturado,
      },
      tiempoEstimadoCocina: 0,
      precioCosto: 0,
      receta: "",
      detallesArtManufacturado: [
        {
          cantidad: 0,
          articuloInsumo: {
            id: 0,
            denominacion: "",
            descripcion: "",
            precioVenta: 0,
            estadoArticulo: StateType.Alta,
            rubro: {
              id: 0,
              denominacion: "",
              estadoRubro: StateType.Alta,
              tipoRubro: RubroType.insumo,
            },
            precioCompra: 0,
            stockActual: 0,
            stockMinimo: 0,
            unidadMedida: {
              id: 0,
              denominacion: "",
              abreviatura: "",
            },
            url_Imagen: "",
          },
        },
      ],
      url_Imagen: "",
    };
  };

  //Producto seleccionado que se va a pasar como prop al modal
  const [product, setProduct] = useState<Product>(initializableNewProduct);

  //const para manejar el estado del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  //Logica del modal
  const handleClick = (newTitle: string, prod: Product, modal: ModalType) => {
    setTitle(newTitle);
    setModalType(modal);
    setProduct(prod);
    setShowModal(true);
  };

  //Estado que contiene los productos recibidos de nuestra API
  const [products, setProducts] = useState<Product[]>([]);

  //Variable que muestra el componente Loader
  const [isLoading, setIsLoading] = useState(true);

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
      <Button
        className="mt-4 mb-3"
        onClick={() =>
          handleClick(
            "Nuevo Producto",
            initializableNewProduct(),
            ModalType.CREATE
          )
        }
      >
        {" "}
        Nuevo Producto
      </Button>
     
        <Table hover>
          <thead>
            <tr className="text-center">
              <th>Nombre</th>
              <th>Rubro</th>
              <th>Tiempo de Cocina</th>
              <th>Precio Venta</th>

              <th>Estado</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="text-center">
                <td>{product.denominacion}</td>
                <td>{product.rubro?.denominacion}</td>
                <td>{product.tiempoEstimadoCocina} min</td>
                <td>$ {product.precioVenta}</td>

                <td>{product.estadoArticulo}</td>
                <td>
                  <EditButton
                    onClick={() =>
                      handleClick("Editar Producto", product, ModalType.UPDATE)
                    }
                  />
                </td>
                <td>
                  <DeleteButton
                    onClick={() =>
                      handleClick(
                        "Eliminar Producto",
                        product,
                        ModalType.DELETE
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )
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
