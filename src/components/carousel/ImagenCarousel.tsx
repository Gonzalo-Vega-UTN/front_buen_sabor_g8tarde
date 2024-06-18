import React, { useState, useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Imagen } from '../../entities/DTO/Articulo/Imagen';
import { Button } from 'react-bootstrap';

interface Props {
    imagenesGuardadas: Imagen[];
    onFileChange: (newFiles: File[]) => void;
}

const ImagenCarousel: React.FC<Props> = ({ imagenesGuardadas, onFileChange }) => {
    const [index, setIndex] = useState<number>(0);
    const [imagenes, setImagenes] = useState<Imagen[]>(imagenesGuardadas);
    const [isHovered, setIsHovered] = useState<boolean[]>(Array(imagenesGuardadas.length).fill(false));
    const timeoutRefs = useRef<(number | null)[]>(Array(imagenesGuardadas.length).fill(null));

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const files = event.target.files;
        console.log(files)
        if (files) {
            const newFiles = Array.from(files);
            onFileChange(newFiles);
            const newImages: Imagen[] = newFiles.map(file => ({
                id: 0,
                alta: true,
                url: URL.createObjectURL(file),
                name: file.name
            }));
            setImagenes((prevImages) => [...prevImages, ...newImages]);
            setIsHovered((prevHovered) => [...prevHovered, ...Array(newFiles.length).fill(false)]);
        }
    };

    const handleMouseEnter = (index: number) => {
        timeoutRefs.current[index] = window.setTimeout(() => {
            setIsHovered((prev) => {
                const newHovered = [...prev];
                newHovered[index] = true;
                return newHovered;
            });
        }, 1500); // 1.5 segundos
    };

    const handleMouseLeave = (index: number) => {
        if (timeoutRefs.current[index] !== null) {
            window.clearTimeout(timeoutRefs.current[index] as number);
            timeoutRefs.current[index] = null;
        }
        setIsHovered((prev) => {
            const newHovered = [...prev];
            newHovered[index] = false;
            return newHovered;
        });
    };

    const handleDelete = (index: number) => {
        const updatedImages = imagenes.filter((_, i) => i !== index);
        setImagenes(updatedImages);
        setIsHovered((prev) => prev.filter((_, i) => i !== index));
        if (index >= imagenes.length - 1 && index > 0) {
            setIndex(index - 1);
        }
    };

    return (
        <div className='align-items-center' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {imagenes.length !== 0 && (
                <Carousel
                    activeIndex={index}
                    onSelect={handleSelect}
                    style={{ width: '400px', minHeight: '300px', maxHeight: '300px' }}
                    wrap={false}
                    prevIcon={<Button>Atras</Button>}
                    nextIcon={index === imagenes.length - 1 ? <Button>Agregar</Button> : <Button>Siguiente</Button>}
                    variant='dark'
                >
                    {imagenes.map((imagen, idx) => (
                        <Carousel.Item
                            key={idx}
                            onMouseEnter={() => handleMouseEnter(idx)}
                            onMouseLeave={() => handleMouseLeave(idx)}
                        >
                            <img
                                src={imagen.url}
                                alt={`Slide ${idx}`}
                                style={{ width: '80%', height: '80%', objectFit: 'contain', position: 'relative' }}
                            />
                            {isHovered[idx] && (
                                <Button
                                    variant="danger"
                                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                                    onClick={() => handleDelete(idx)}
                                >
                                    Eliminar
                                </Button>
                            )}
                        </Carousel.Item>
                    ))}
                </Carousel>
            )}
            <input type="file" multiple onChange={handleFileChange} />
        </div>
    );
};

export default ImagenCarousel;
