import { FormEvent, useEffect, useState } from "react";
import { Promocion } from "../../entities/DTO/Promocion/Promocion";
import ImagenCarousel from "../../components/generic/carousel/ImagenCarousel";
import { PromocionDetails } from "./form/PromocionDetails";
import { PromocionValidity } from "./form/PromocionValidity";
import { PromocionItems } from "./form/PromocionItems";
import { useMultistepForm } from "../../hooks/useMultistepForm";
import { Imagen } from "../../entities/DTO/Imagen";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/esm/Form";
import Spinner from "react-bootstrap/esm/Spinner";
import { Articulo } from "../../entities/DTO/Articulo/Articulo";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import { ProductServices } from "../../services/ProductServices";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
interface PromocionModalProps {
  promocion: Promocion;
  handleSubmit: (promocion: Promocion, files: File[]) => void;
  onHide: () => void;
}
export const PromocionFormModal = ({
  promocion,
  handleSubmit,
  onHide,
}: PromocionModalProps) => {
  const { activeSucursal } = useAuth0Extended();
  const [currentPromocion, setCurrentPromcion] = useState<Promocion>(promocion);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Promocion, string>>
  >({});
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableArticulos, setAvailableArticulos] = useState<Articulo[]>([]);

  const fetchArticulos = async () => {
    try {
      const manufacturados = await ProductServices.getAllFiltered(
        activeSucursal
      );
      const insumosNoElaborados =
        await ArticuloInsumoService.obtenerArticulosInsumosFiltrados(
          activeSucursal
        );
      setAvailableArticulos([
        ...manufacturados,
        ...insumosNoElaborados.filter((a) => !a.esParaElaborar),
      ]);
    } catch (error) {
      console.error("Error al obtener los articulos manufacturados", error);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, [activeSucursal]);

  const handleChange = (field: Partial<Promocion>) => {
    setCurrentPromcion((prev) => ({
      ...prev,
      ...field,
    }));
    const fieldName = Object.keys(field)[0] as keyof Promocion;
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };
  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setCurrentPromcion((prev) => {
      return {
        ...prev,
        imagenes: newImages,
      };
    });
  };

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <PromocionDetails
        promocion={currentPromocion}
        handleChange={handleChange}
        errors={errors}
      />,
      <PromocionValidity
        promocion={currentPromocion}
        handleChange={handleChange}
        errors={errors}
      />,
      <PromocionItems
        promocion={currentPromocion}
        handleChange={handleChange}
        errors={errors}
        availableArticulos={availableArticulos}
      />,
      <ImagenCarousel
        imagenesExistentes={currentPromocion.imagenes}
        onFilesChange={handleFileChange}
        onImagenesChange={handleImagenesChange}
      />,
    ]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep && validateFields()) return next();
  }

  function save() {
    if (validateFields()) {
      setIsLoading(true);

      setTimeout(() => {
        handleSubmit(currentPromocion, files);
        setIsLoading(false);
        onHide();
      }, 2000);
    }
  }

  const validateFields = () => {
    const newErrors: {
      denominacion?: string;
      descripcionDescuento?: string;
      tipoPromocion?: string;
      fechaDesde?: string;
      fechaHasta?: string;
      horaDesde?: string;
      horaHasta?: string;
      promocionDetalles?: string;
    } = {};

    if (currentStepIndex === 0) {
      if (!currentPromocion.denominacion) {
        newErrors.denominacion = "La denominación es requerida";
      }

      if (!currentPromocion.descripcionDescuento) {
        newErrors.descripcionDescuento = "La descripción es requerida";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <Modal show={true} size="lg" backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>Formulario de Articulo Manufacturado</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <div style={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
            {currentStepIndex + 1} / {steps.length}
          </div>
          {step}
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: ".5rem",
              justifyContent: "flex-end",
            }}
          >
            {!isFirstStep && (
              <Button type="button" variant="secondary" onClick={back}>
                Atras
              </Button>
            )}
            {!isLastStep && <Button type="submit">Siguiente</Button>}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Cerrar
        </Button>
        {isLastStep && (
          <Button
            variant="primary"
            type="button"
            onClick={save}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};