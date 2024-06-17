import React, { useState } from 'react';
import Carousel from 'react-bootstrap/esm/Carousel';
import { Imagen } from '../../entities/DTO/Articulo/Imagen';
import { Button } from 'react-bootstrap';

interface Props {
    imagenesGuardadas: Imagen[];
}

const ImagenCarousel: React.FC<Props> = ({ imagenesGuardadas }) => {
    const [index, setIndex] = useState<number>(0);
    const [imagenes, setImagenes] = useState<Imagen[]>(imagenesGuardadas);

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
        if (selectedIndex === imagenes.length - 1) {
            console.log("Entre al if");
            const imagen = new Imagen();
            imagen.url = "https://www.saccosystem.com/public/imgCat3/big/203-952315666-Semiduri.jpg";
            setImagenes((prevImages) => {
                const updatedImages = [...prevImages, imagen];
                setIndex(updatedImages.length - 1); // Move to the new last image
                return updatedImages;
            });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages: Imagen[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result) {
                        newImages.push({ id: 0, alta: true, url: reader.result as string, name: file.name });
                        if (newImages.length === files.length) {
                            setImagenes((prevImages) => [...prevImages, ...newImages]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    return (
        <div className='align-items-center' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                style={{ width: '400px', height: '400px' }}
                wrap={false}
                prevIcon={<Button>Atras</Button>}
                nextIcon={index === imagenes.length - 1 ? <Button>Agregar</Button> : <Button>Siguiente</Button>}
                variant='dark'
            >
                {imagenes.map((imagen, index) => (
                    <Carousel.Item key={index}>
                        <img
                            src={imagen.url}
                            alt={`Slide ${index}`}
                            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
            <input type="file" multiple onChange={handleFileChange} />
        </div>
    );
};

export default ImagenCarousel;
