import React, { useState } from 'react';
import { BsFillPeopleFill, BsBuilding, BsShop, BsBox, BsBasket, BsPercent, BsCart, BsGraphUp } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';
import './style.css';

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const [selected, setSelected] = useState('');
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const location = useLocation();

    const handleMouseEnter = () => setExpanded(true);
    const handleMouseLeave = () => setExpanded(false);

    const handleClick = (path: React.SetStateAction<string>) => {
        setSelected(path);
    };

    const toggleSubmenu = () => {
        setSubmenuOpen(!submenuOpen);
    };

    return (
        <div 
            className={`bg-dark text-white min-vh-100 sidebar ${expanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="ms-4 my-3">
                <span className="fs-4">Buen Sabor</span>
            </div>
            
            <hr className="text-white" />
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link 
                        to="/empresas" 
                        className={`nav-link text-white ${location.pathname === '/empresas' || selected === '/empresas' ? 'active' : ''}`}
                        onClick={() => handleClick('/empresas')}
                    >
                        <BsBuilding size={24} className="me-2" />
                        <span className="nav-text">Empresas</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link 
                        to="/sucursales" 
                        className={`nav-link text-white ${location.pathname === '/sucursal' || selected === '/sucursal' ? 'active' : ''}`}
                        onClick={() => handleClick('/sucursales')}
                    >
                        <BsShop size={24} className="me-2" />
                        <span className="nav-text">Sucursal</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <span 
                        className={`nav-link text-white ${location.pathname.startsWith('/productos') || selected.startsWith('/productos') ? 'active' : ''}`} 
                        onClick={toggleSubmenu}
                    >
                        <BsBox size={24} className="me-2" />
                        <span className="nav-text">Productos</span>
                    </span>
                    {submenuOpen && (
                        <ul className="nav flex-column submenu">
                            <li className="nav-item">
                                <Link 
                                    to="/productos" 
                                    className={`nav-link text-white ${location.pathname === '/productos' || selected === '/productos/lista' ? 'active' : ''}`} 
                                    onClick={() => handleClick('/productos')}
                                >
                                    Lista Productos
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    to="/create-product/0" 
                                    className={`nav-link text-white ${location.pathname === '/create-product/0' || selected === '/create-product/0' ? 'active' : ''}`}
                                    onClick={() => handleClick('/create-product/0')}
                                >
                                    Crear Producto
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li className="nav-item">
                    <Link 
                        to="/ingredientes" 
                        className={`nav-link text-white ${location.pathname === '/ingredientes' || selected === '/ingredientes' ? 'active' : ''}`}
                        onClick={() => handleClick('/ingredientes')}
                    >
                        <BsBasket size={24} className="me-2" />
                        <span className="nav-text">Ingredientes</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link 
                        to="/promociones" 
                        className={`nav-link text-white ${location.pathname === '/promociones' || selected === '/promociones' ? 'active' : ''}`}
                        onClick={() => handleClick('/promociones')}
                    >
                        <BsPercent size={24} className="me-2" />
                        <span className="nav-text">Promociones</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link 
                        to="/pedidos" 
                        className={`nav-link text-white ${location.pathname === '/pedidos' || selected === '/pedidos' ? 'active' : ''}`}
                        onClick={() => handleClick('/pedidos')}
                    >
                        <BsCart size={24} className="me-2" />
                        <span className="nav-text">Pedidos</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link 
                        to="/clientes" 
                        className={`nav-link text-white ${location.pathname === '/clientes' || selected === '/clientes' ? 'active' : ''}`}
                        onClick={() => handleClick('/clientes')}
                    >
                        <BsFillPeopleFill size={24} className="me-2" />
                        <span className="nav-text">Clientes</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link 
                        to="/estadisticas" 
                        className={`nav-link text-white ${location.pathname === '/estadisticas' || selected === '/estadisticas' ? 'active' : ''}`}
                        onClick={() => handleClick('/estadisticas')}
                    >
                        <BsGraphUp size={24} className="me-2" />
                        <span className="nav-text">Estadísticas</span>
                    </Link>
                </li>
            
            </ul>

            
        </div>
    );
};

export default Sidebar;
