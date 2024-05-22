import React, { useState } from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';
import './style.css';  // Importa el archivo CSS

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
                        Empresas
                    </Link>
                </li>
                <li className="nav-item">
                    <span 
                        className={`nav-link text-white ${location.pathname.startsWith('/productos') || selected.startsWith('/productos') ? 'active' : ''}`} 
                        onClick={toggleSubmenu}
                    >
                        Productos
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
                        Ingredientes
                    </Link>
                </li>
            
            </ul>

            <div className="mt-auto">
                <OverlayTrigger
                    trigger="hover"
                    placement="right"
                    overlay={
                        <Popover id="popover-basic" style={{ width: '10em' }}>
                            <Popover.Header as="h3">Account</Popover.Header>
                            <Popover.Body>
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                <a href="#" className="dropdown-item disabled">Log Out</a>
                            </Popover.Body>
                        </Popover>
                    }
                >
                    <Button variant="outline-light" className="w-100" style={{ textAlign: 'left' }}>
                        <BsFillPeopleFill size={24} className="me-2" /> Account
                    </Button>
                </OverlayTrigger>
            </div>
        </div>
    );
};

export default Sidebar;
