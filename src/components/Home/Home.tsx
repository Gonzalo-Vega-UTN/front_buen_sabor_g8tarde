import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import { CategoriaService } from '../../services/CategoriaService';
import { Categoria } from '../../entities/DTO/Categoria/Categoria';
import Lista from '../../MioImport/lista';

const Home = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

    // Función para obtener categorías
    const fetchCategories = async () => {
        try {
            const data = await CategoriaService.obtenerCategorias();
            setCategorias([{
                id: undefined, denominacion: 'Todos', imagen: '',
                alta: false
            }, ...data]); // Agrega la categoría "Todos"
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const defaultImageUrl = 'https://http2.mlstatic.com/storage/sc-seller-journey-backoffice/images-assets/234940675890-Sucursales--una-herramienta-para-mejorar-la-gesti-n-de-tus-puntos-de-venta.png';

    const handleCategoryClick = (categoryId: number | undefined) => {
        setSelectedCategoryId(categoryId);
    };

    return (
        <div className="container mt-5">
            {/* Search Bar and Header */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <input type="text" className="form-control" placeholder="Buscar comida..." />
                </div>
                <div className="col-md-4">
                    <Header />
                </div>
            </div>
            {/* Categories */}
            <div className="row mb-4">
                {categorias.map(category => (
                    <div
                        className={`col-3 text-center ${selectedCategoryId === category.id ? 'selected' : ''}`}
                        key={category.id === undefined ? 'all' : category.id}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        <img
                            src={category.imagen || defaultImageUrl}
                            className="rounded-circle"
                            alt={category.denominacion}
                            width="100"
                        />
                        <h5 className="mt-2">{category.denominacion}</h5>
                    </div>
                ))}
            </div>

            {/* Featured Products */}
            <Lista selectedCategoryId={selectedCategoryId} /> {/* Pasa la categoría seleccionada al componente Lista */}
        </div>
    );
};

export default Home;
