import { CiCirclePlus } from "react-icons/ci";
import ArticuloInsumoTable from "../components/tables/ArticuloInsumoTable";
import { ModalType } from "../types/ModalType";
import Button from "../components/generic/GenericButton";
import { useEffect, useState } from "react";
import ArticuloInsumoModal from "../components/modals/ArticuloInsumoModal";
import { ArticuloInsumo } from "../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { Categoria } from "../entities/DTO/Categoria/Categoria";
import ArticuloInsumoService from "../services/ArticuloInsumoService";
import { CategoriaService } from "../services/CategoriaService";
import { UnidadMedida } from "../entities/DTO/UnidadMedida/UnidadMedida";
import UnidadMedidaServices from "../services/UnidadMedidaServices";

export default function ArticuloInsumoPage() {

  //Estados
  const [showModalCrear, setShowModalCrear] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  //Estados Listas Entidades
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([])
  const [articulosInsumo, setArticuloInsumo] = useState<ArticuloInsumo[]>([])

  useEffect(() => {
    const fetchCategorias = async () => {
      const categorias = await CategoriaService.obtenerCategorias();
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

  const fetchDataArticulosInsumo = async (idCategoria?: number, idUnidadMedida?: number, denominacion?: string) => {
    const articulos = await ArticuloInsumoService.obtenerArticulosInsumosFiltrados(idCategoria, idUnidadMedida, denominacion);
    setArticuloInsumo(articulos);
  };

  useEffect(() => {
    fetchDataArticulosInsumo();
  }, []);




  const handleSaveUpdate = async (art: ArticuloInsumo) => {
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
        />
      )}
    </>
  );
}
