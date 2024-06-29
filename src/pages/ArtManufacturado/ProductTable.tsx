import { useEffect, useState } from "react";
import { ProductServices } from "../../services/ProductServices";
import { Table } from "react-bootstrap";
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { ArticuloManufacturado } from "../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import { useNavigate } from "react-router-dom";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import { UnidadMedida } from "../../entities/DTO/UnidadMedida/UnidadMedida";
import UnidadMedidaServices from "../../services/UnidadMedidaServices";
import GenericButton from "../../components/generic/GenericButton";
import FiltroProductos from "../../components/Filtrado/FiltroArticulo";
import { useAuth0, Auth0ContextInterface, User } from "@auth0/auth0-react";
import ProductModal from "./ProductModal";
import { FaSave } from "react-icons/fa";
import "./tableProdict.css"
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";

interface Auth0ContextInterfaceExtended<UserType extends User> extends Auth0ContextInterface<UserType> {
  activeSucursal: string ;
}

export default function ProductTable() {
  const navigate = useNavigate();
  //Producto seleccionado que se va a pasar como prop al modal
  const [product, setProduct] = useState<ArticuloManufacturado>(new ArticuloManufacturado());
  const [products, setProducts] = useState<ArticuloManufacturado[]>([]);

  //const para manejar el estado del modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([])

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>();
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState<number>();
  const [searchedDenominacion, setSearchedDenominacion] = useState<string>();

  const { activeSucursal } = useAuth0Extended();



  //Logica del modal
  const handleClick = (id: number) => {
    navigate("/create-product/" + id)
  };

  const handleClickEliminar = (newTitle: string, prod: ArticuloManufacturado) => {
    setTitle(newTitle);
    setProduct(prod);
    setShowModal(true);
  };

  //Variable que muestra el componente Loader
  const [, setIsLoading] = useState(true);

  //El useEffect se ejecuta cada vez que se renderice el componente

  const fetchProducts = async (idCategoria?: number, idUnidadMedida?: number, denominacion?: string) => {
    const productsFiltered = await ProductServices.getAllFiltered(activeSucursal, idCategoria, idUnidadMedida, denominacion)
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
      const categorias = await CategoriaService.obtenerCategorias(activeSucursal);
      setCategorias(categorias);
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchUnidadadMedida = async () => {
      const unidadesMedida = await UnidadMedidaServices.getAll();
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
  }, [categoriaSeleccionada, unidadMedidaSeleccionada, searchedDenominacion]);


  const handleDelete = async (id: number) => {
    try {
      await ProductServices.delete(id);
      setShowModal(false)
      fetchProducts();
    } catch (error) {
      console.error(error);
      // toast.error("Ha ocurrido un error");
    }
  };
  return (
    <div className="container">
      <GenericButton className="mt-4 mb-3" color="#4CAF50" size={25} icon={CiCirclePlus} text="Nuevo Producto" onClick={() =>
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
            <tr key={product.id} className={"text-center"}  >
              <td className={product.alta ? "" : "bg-secondary"}>{product.id}</td>
              <td className={product.alta ? "" : "bg-secondary"}>{product.denominacion}</td>
              <td className={product.alta ? "" : "bg-secondary"}>{product.tiempoEstimadoMinutos} min</td>
              <td className={product.alta ? "" : "bg-secondary"}>$ {(product.precioVenta)}</td>
              <td className={product.alta ? "" : "bg-secondary"}>{product.categoria?.denominacion}</td>
              <td className={product.alta ? "" : "bg-secondary"}>{product.alta ? "Activo" : "Inactivo"}</td>
              <td className={product.alta ? "" : "bg-secondary"}>
                <GenericButton color="#FBC02D" size={23} icon={BsFillPencilFill} onClick={() =>
                  handleClick(product.id)
                } />
              </td>
              <td className={product.alta ? "" : "bg-secondary"}>
                <GenericButton color={product.alta ? "#D32F2F" : "#50C878"} size={23} icon={product.alta ? BsTrashFill : FaSave} onClick={() =>
                  handleClickEliminar(
                    "Alta/Baja Articulo",
                    product,

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
          handleDelete={handleDelete}
          product={product}
        />
      )}
    </div>
  );
}