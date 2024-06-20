import { CiCirclePlus } from "react-icons/ci";
import ArticuloInsumoTable from "./ArticuloInsumoTable";
import { ModalType } from "../../types/ModalType";
import Button from "../../components/generic/GenericButton";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/Auth";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { UnidadMedida } from "../../entities/DTO/UnidadMedida/UnidadMedida";
import { ArticuloInsumo } from "../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { CategoriaService } from "../../services/CategoriaService";
import UnidadMedidaService from "../../services/UnidadMedidaServices";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
import ArticuloInsumoModal from "./ArticuloInsumoModal";

export default function ArticuloInsumoPage() {

  //Estados
  const [showModalCrear, setShowModalCrear] = useState<boolean>(false);
  const [, setError] = useState<string>("");
  const{activeSucursal}=useAuth();

  //Estados Listas Entidades
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [articulosInsumo, setArticuloInsumo] = useState<ArticuloInsumo[]>([]);

  //Estados de Selección
  const [categoria, setCategoria] = useState<number>();
  const [unidadMedida, setUnidadMedida] = useState<number>();
  const [searchedDenominacion, setSearchedDenominacion] = useState<string>();


  // Estado para manejar los archivos
  const [, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const categorias = await CategoriaService.obtenerCategorias(activeSucursal);
      setCategorias(categorias);
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchUnidadadMedida = async () => {
      const unidadesMedida = await UnidadMedidaService.getAll();
      setUnidadesMedida(unidadesMedida);
    };

    fetchUnidadadMedida();
  }, []);

  const fetchDataArticulosInsumo = async (idCategoria?: number, idUnidadMedida?: number, denominacion?: string) => {
    const articulos = await ArticuloInsumoService.obtenerArticulosInsumosFiltrados(activeSucursal, idCategoria, idUnidadMedida, denominacion);
    setArticuloInsumo(articulos);
  };

  useEffect(() => {
    fetchDataArticulosInsumo();
  }, []);

  useEffect(() => {
      fetchDataArticulosInsumo(categoria,unidadMedida,searchedDenominacion);

  }, [categoria, unidadMedida, searchedDenominacion]);


  const handleSaveUpdate = async (art: ArticuloInsumo, files: File[]) => {
    try {
      let response: ArticuloInsumo;
      if (art.id === 0) { // Articulo Nuevo
        response = await ArticuloInsumoService.crearArticuloInsumo(art);
      } else { // Actualizar Articulo
        response = await ArticuloInsumoService.actualizarArticuloInsumo(art.id, art);
      }
      if (response) {
        setArticuloInsumo(prevArticulos => [...prevArticulos.filter(a => a.id !== art.id), response]); //Quita primero el articulo y luego lo agrega al final
        setError("");
        fetchDataArticulosInsumo(); // Llama a fetchDataArticulosInsumo después de actualizar el estado
      }

      if (response.id) {
       const uploadResponse = await ArticuloInsumoService.uploadFiles(response.id, files);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        setError(error.message);
      }
    }
  };

  const handleDelete = async (artId: number) => {
    try {
      const response = await ArticuloInsumoService.eliminarArticuloInsumoById(artId);

      if (response) {
        setArticuloInsumo(prevArticulos => prevArticulos.filter(a => a.id !== artId)); // Filtra el articulo eliminado
        setError("");
        fetchDataArticulosInsumo(); // Llama a fetchDataArticulosInsumo después de actualizar el estado
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        setError(error.message);
      }
    }
  };

  // Maneja el cambio de archivos
  const handleFileChange = (newFiles: File[]) => {
    setSelectedFiles(newFiles);
  };

  const handleChangeCategoria = (id: number) => {
    setCategoria(id > 0 ? id : undefined);
}

const handleChangeUnidadMedida = (id: number) => {
    setUnidadMedida(id > 0 ? id : undefined);
}

const handleChangeText = (denominacion: string) => {
    setSearchedDenominacion(denominacion ? denominacion : undefined);
}

  return (
    <>
      <Button className="mt-4 mb-3" color="#4CAF50" size={25} icon={CiCirclePlus} text="Nuevo Ingrediente" onClick={() => setShowModalCrear(true)}
      />

      <ArticuloInsumoTable
        categorias={categorias}
        unidadesMedida={unidadesMedida}
        articulosInsumo={articulosInsumo}
        handleSubmit={handleSaveUpdate}
        handleDelete={handleDelete}
        onFileChange={handleFileChange}
        handleChangeCategoria={handleChangeCategoria}
        handleChangeUnidadMedida={handleChangeUnidadMedida}
        handleChangeText={handleChangeText}
      />

      {showModalCrear && (
        <ArticuloInsumoModal
          onHide={() => setShowModalCrear(false)}
          articulo={undefined}
          modalType={ModalType.CREATE}
          titulo="Crear Articulo Insumo"
          handleSubmit={handleSaveUpdate}
          handleDelete={handleDelete}
          unidadesMedida={unidadesMedida}
          categorias={categorias}
          onFileChange={handleFileChange} // Pasar el manejador de archivos
        />
      )}
    </>
  );
}
