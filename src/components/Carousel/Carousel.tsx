import React from 'react';
import { Carousel } from 'react-bootstrap';

interface Product {
  name: string;
  description: string;
  imageUrl: string;
}

interface CarouselComponentProps {
  products: Product[];
}

const CarouselComponent: React.FC<CarouselComponentProps> = ({ products }) => {
  return (
    <div className="d-flex">
      <Carousel className="w-50">
        {products.map((product, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={product.imageUrl}
              alt={product.name}
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="product-description w-50 p-3">
        {products.map((product, index) => (
          <div key={index} className={`description ${index === 0 ? 'active' : ''}`}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselComponent;
