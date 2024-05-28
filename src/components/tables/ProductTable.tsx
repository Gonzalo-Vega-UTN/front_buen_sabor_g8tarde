import { useEffect, useState } from "react";
import { ProductServices } from "../../services/ProductServices";
import { Col, Row, Table } from "react-bootstrap";
import CustomButton from "../generic/Button"
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { ModalType } from "../../types/ModalType";
import ProductModal from "../modals/ProductModal";
import { ArticuloManufacturado } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import { useNavigate } from "react-router-dom";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import { UnidadMedidaServices } from "../../services/UnidadMedidaServices";
import { UnidadMedida } from "../../entities/DTO/UnidadMedida/UnidadMedida";
import FiltroProductos from "../Filtrado/FiltroArticulo";

export default function ProductTable() {
  const navigate = useNavigate();
  //Producto seleccionado que se va a pasar como prop al modal
  const [product, setProduct] = useState<ArticuloManufacturado>(new ArticuloManufacturado());
  const [products, setProducts] = useState<ArticuloManufacturado[]>([]);

  //const para manejar el estado del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([])

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>();
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState<number>();
  const [searchedDenominacion, setSearchedDenominacion] = useState<string>();


  //Logica del modal
  const handleClick = (id: number) => {
    navigate("/create-product/" + id)
  };

  const handleClickEliminar = (newTitle: string, prod: ArticuloManufacturado, modal: ModalType) => {
    setTitle(newTitle);
    setModalType(modal);
    setProduct(prod);
    setShowModal(true);
  };

  const handleSave = async (newProduct: ArticuloManufacturado) => {
    try {
      if (newProduct.id === 0) {
        const createdProduct = await ProductServices.createProduct(newProduct);
        console.log("Se está creando el producto", createdProduct);
        setProducts(prevProducts => [...prevProducts, createdProduct]);
      } else {
        const updatedProduct = await ProductServices.updateProduct(newProduct.id, newProduct);
        console.log("Se está actualizando el producto", updatedProduct);
        setProducts(prevProducts =>
          prevProducts.map(prod =>
            prod.id === updatedProduct.id ? updatedProduct : prod
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
    setShowModal(false); // Ocultar el modal después de guardar
  };
  //Estado que contiene los productos recibidos de nuestra API

  //Variable que muestra el componente Loader
  const [isLoading, setIsLoading] = useState(true);

  //El useEffect se ejecuta cada vez que se renderice el componente

  const fetchProducts = async (idCategoria?: number, idUnidadMedida?: number, denominacion?: string) => {
    const productsFiltered = await ProductServices.getProductsFiltered(idCategoria, idUnidadMedida, denominacion)
    console.log(productsFiltered);

    //const products = await ProductServices.getProducts();
    setProducts(productsFiltered);
    setIsLoading(false);

  }
  useEffect(() => {

    fetchProducts();
  }, []);


  useEffect(() => {
    const fetchCategorias = async () => {
      const categorias = await CategoriaService.getCategorias();
      setCategorias(categorias);
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchUnidadadMedida = async () => {
      const unidadesMedida = await UnidadMedidaServices.getUnidadesMedida();
      setUnidadesMedida(unidadesMedida);
    };

    fetchUnidadadMedida();
  }, []);


  const handleChangeCategoria = (id: number) => {
    setCategoriaSeleccionada(id > 0 ? id : undefined);
  }
  
  const handleChangeUnidadMedida = (id: number) => {
    setUnidadMedidaSeleccionada(id > 0 ? id : undefined);
  }

  const handleChangeText = (denominacion: string) => {
    setSearchedDenominacion(denominacion ? denominacion : undefined);
  }
  useEffect(() => {
    fetchProducts(categoriaSeleccionada, unidadMedidaSeleccionada, searchedDenominacion);
  }, [categoriaSeleccionada, unidadMedidaSeleccionada,searchedDenominacion]);

  
  return (
    <div className="container">
      <CustomButton classes="mt-4 mb-3" color="#4CAF50" size={25} icon={CiCirclePlus} text="Nuevo Producto" onClick={() =>
        handleClick(0)}
      />
      
       <FiltroProductos
      categorias={categorias}
      unidadesMedida={unidadesMedida}
      handleChangeText={handleChangeText}
      handleChangeCategoria={handleChangeCategoria}
      handleChangeUnidadMedida={handleChangeUnidadMedida}
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
              <td>$ {(product.precioVenta)}</td>
              <td>{product.categoria?.denominacion}</td>
              <td>{product.alta ? "Activo" : "Inactivo"}</td>
              <td>
                <CustomButton color="#FBC02D" size={23} icon={BsFillPencilFill} onClick={() =>
                  handleClick(product.id)
                } />
              </td>
              <td>
                <CustomButton color="#D32F2F" size={23} icon={BsTrashFill} onClick={() =>
                  handleClickEliminar(
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
          handleSave={handleSave}
        />
      )}
    </div>
  );
}
