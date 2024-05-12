import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { RubroType } from "../../types/RubroType";
import { StateType } from "../../types/StateType";
import DeleteButton from "../DeleteButton/DeleteButton";
import EditButton from "../EditButton/EditButton";

import ArticuloInsumoModal from "../ArticuloInsumoModal/ArticuloInsumoModal";
import { ArticuloInsumosServices } from "../../services/ArticuloInsumoServices";

export default function ArticuloInsumoTable() {
  //Inicializamos un ingrediente por defecto cuando vayamos a crear uno nuevo
  const initializableNewArticuloInsumo = (): ArticuloInsumo => {
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
    };
  };

  //Producto seleccionado que se va a pasar como prop al modal
  const [ArticuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>(
    initializableNewArticuloInsumo
  );

  //const para manejar el estado del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  //Logica del modal
  const handleClick = (
    newTitle: string,
    art: ArticuloInsumo,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setArticuloInsumo(art);
    setShowModal(true);
  };

  //Estado que contiene los productos recibidos de nuestra API
  const [ArticuloInsumos, setArticuloInsumos] = useState<ArticuloInsumo[]>([]);

  //Variable que muestra el componente Loader
  const [isLoading, setIsLoading] = useState(true);

  //El useEffect se ejecuta cada vez que se renderice el componente
  useEffect(() => {
    const fetchArticuloInsumos = async () => {
      const articulos = await ArticuloInsumosServices.getArticuloInsumo();
      setArticuloInsumos(articulos);
      setIsLoading(false);
    };

    fetchArticuloInsumos();
  }, []);

  return (
    <div className="container">
      <Button
        className="mt-4 mb-3"
        onClick={() =>
          handleClick(
            "Nuevo Ingrediente",
            initializableNewArticuloInsumo(),
            ModalType.CREATE
          )
        }
      >
        {" "}
        Nuevo Ingrediente
      </Button>
      
        <Table hover>
          <thead>
            <tr className="text-center">
              <th>Nombre</th>
              <th>Unidad de Medida</th>
              <th>Stock Minimo</th>
              <th>Stock Actual</th>
              <th>Diferencia Stock</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {ArticuloInsumos.map((articulo) => (
              <tr className="text-center">
                <td>{articulo.denominacion}</td>
                <td>{articulo.unidadMedida.denominacion}</td>
                <td>{articulo.stockMinimo}</td>
                <td>{articulo.stockActual}</td>
                <td>{articulo.stockActual - articulo.stockMinimo}</td>
                <td>
                  <EditButton
                    onClick={() =>
                      handleClick(
                        "Editar Ingrediente",
                        articulo,
                        ModalType.UPDATE
                      )
                    }
                  />
                </td>
                <td>
                  <DeleteButton
                    onClick={() =>
                      handleClick(
                        "Eliminar Ingrediente",
                        articulo,
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
        <ArticuloInsumoModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title={title}
          modalType={modalType}
          articulo={ArticuloInsumo}
          articulosInsumos={setArticuloInsumos}
        />
      )}
    </div>
  );
}
