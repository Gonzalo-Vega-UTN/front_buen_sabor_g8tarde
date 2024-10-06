import React, { useState, useRef } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Button, Container } from "react-bootstrap";
import "./ImageCarousel.css"; // Importa el archivo CSS
import { Imagen } from "../../../entities/DTO/Imagen";

interface Props {
  imagenesExistentes: Imagen[];
  onFilesChange: (nuevasImagenes: File[]) => void;
  onImagenesChange: (newImages: Imagen[]) => void; // Actualizar estado en Componente padre
}

const ImagenCarousel: React.FC<Props> = ({
  imagenesExistentes,
  onFilesChange,
  onImagenesChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAgregarImagenButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [, setIndex] = useState<number>(0);
  const [imagenes, setImagenes] = useState<Imagen[]>(imagenesExistentes);
  const [imagenAEditar, setImagenAEditar] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      onFilesChange(newFiles);
      const newImages: Imagen[] = newFiles.map((file) => ({
        id: 0,
        alta: true,
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      setImagenes((prevImages) => {
        let updatedImages;
        if (imagenAEditar !== null) {
          updatedImages = [...prevImages];
          updatedImages[imagenAEditar] = newImages[0]; // Reemplaza la imagen editada
          setImagenAEditar(null); // Resetea el índice de la imagen editada
        } else {
          updatedImages = [...prevImages, ...newImages];
        }
        onImagenesChange(updatedImages); // Llamar a la función del padre
        return updatedImages;
      });
    }
  };

  const handleDelete = (index: number) => {
    const updatedImages = imagenes.filter((_, i) => i !== index);
    setImagenes(updatedImages);
    onImagenesChange(updatedImages); // Llamar a la función del padre

    if (index === imagenes.length - 1 && index > 0) {
      // Si se elimina la última imagen, mostrar la anterior
      setIndex(index - 1);
    } else if (index === 0) {
      // Si se elimina la primera imagen, mostrar la última
      setIndex(imagenes.length - 1);
    }
  };

  const handleEditar = (index: number) => {
    setImagenAEditar(index);
    handleAgregarImagenButton();
  };

  return (
    <>
      <Container className="mb-2">
        <Button onClick={handleAgregarImagenButton}>Agregar Imagen</Button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Container>
      <Container>
        {imagenes.length !== 0 ? (
          <Carousel variant="dark" slide={false}>
            {imagenes.map((imagen, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block custom-image"
                  src={imagen.url}
                  alt={imagen.name}
                />
                <Carousel.Caption className="d-flex justify-content-between">
                  <Button variant="primary" onClick={() => handleEditar(index)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(index)}>
                    Eliminar
                  </Button>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <p>No hay imagenes guardadas</p>
        )}
      </Container>
    </>
  );
};

export default ImagenCarousel;
