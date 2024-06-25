import React, { useState } from 'react';
import { BsFillPeopleFill, BsBuilding, BsShop, BsBox, BsBasket, BsPercent, BsCart, BsGraphUp } from 'react-icons/bs';
import { TbRulerMeasure } from "react-icons/tb";
import { LuChefHat } from "react-icons/lu";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { MdDeliveryDining, MdOutlineCategory } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import './style.css';
import { useAuth } from '../../Auth/Auth';
import { Rol } from '../../entities/enums/Rol';
import logo from '../../assets/images/Buen sabor logo 1.png'; // Importa el logo
import BotonLogin from '../Log-Register/BotonLogin';
import BotonLogout from '../Log-Register/BotonLogout';

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const [selected, setSelected] = useState('');
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const location = useLocation();
    const { userRol } = useAuth();
    const { isAuthenticated } = useAuth();

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
            className={`bg-dark text-white min-vh-100 d-flex flex-column sidebar ${expanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="ms-4 my-3">
                <img src={logo} alt="Logo" className="logo" /> {/* Muestra el logo en lugar de "Buen Sabor" */}
            </div>

            <hr className="text-white" />
            <ul className="nav flex-column flex-grow-1"> {/* Aplica flex-grow-1 para que ocupe todo el espacio vertical disponible */}
                <li className="nav-item">
                    <Link
                        to="/"
                        className={`nav-link text-white ${location.pathname === '/' || selected === '/' ? 'active' : ''}`}
                        onClick={() => handleClick('/')}
                    >
                        <BsShop size={24} className="me-2" />
                        <span className="nav-text">Tienda</span>
                    </Link>
                </li>

                {isAuthenticated ?
                    <BotonLogout />
                    :
                    <BotonLogin 
                    
                    
                    />
                }
                {
                    isAuthenticated && userRol === Rol.Admin && (
                        <>
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
                                <Link
                                    to="/productos"
                                    className={`nav-link text-white ${location.pathname === '/productos' || selected === '/productos' ? 'active' : ''}`}
                                    onClick={() => handleClick('/productos')}
                                >
                                    <BsBox size={24} className="me-2" />
                                    <span className="nav-text">Productos</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    to="/unidadmedida"
                                    className={`nav-link text-white ${location.pathname === '/unidadmedida' || selected === '/unidadmedida' ? 'active' : ''}`}
                                    onClick={() => handleClick('/unidadmedida')}
                                >
                                    <TbRulerMeasure size={24} className="me-2" />
                                    <span className="nav-text">Medidas</span>
                                </Link>
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
                                    to="/categorias"
                                    className={`nav-link text-white ${location.pathname === '/categorias' || selected === '/categorias' ? 'active' : ''}`}
                                    onClick={() => handleClick('/categorias')}
                                >
                                    <MdOutlineCategory size={24} className="me-2" />
                                    <span className="nav-text">Categorias</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/reportes"
                                    className={`nav-link text-white ${location.pathname === '/reportes' || selected === '/reportes' ? 'active' : ''}`}
                                    onClick={() => handleClick('/reportes')}
                                >
                                    <BsGraphUp size={24} className="me-2" />
                                    <span className="nav-text">Reportes</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    to="/PedidosCajero"
                                    className={`nav-link text-white ${location.pathname === '/PedidosCajero' || selected === '/PedidosCajero' ? 'active' : ''}`}
                                    onClick={() => handleClick('/PedidosCajero')}
                                >
                                    <LiaCashRegisterSolid size={24} className="me-2" />
                                    <span className="nav-text">Cajero</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/PedidosDelivery"
                                    className={`nav-link text-white ${location.pathname === '/PedidosDelivery' || selected === '/PedidosDelivery' ? 'active' : ''}`}
                                    onClick={() => handleClick('/PedidosDelivery')}
                                >
                                    <MdDeliveryDining size={24} className="me-2" />
                                    <span className="nav-text">Delivery</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/PedidosCocinero"
                                    className={`nav-link text-white ${location.pathname === '/PedidosCocinero' || selected === '/PedidosCocinero' ? 'active' : ''}`}
                                    onClick={() => handleClick('/PedidosCocinero')}
                                >
                                    <LuChefHat size={24} className="me-2" />
                                    <span className="nav-text">Cocinero</span>
                                </Link>
                            </li>

                        </>
                    )}
            </ul>
            <div className="mt-auto"></div> {/* Alinea los elementos al fondo del sidebar */}
        </div>
    );
}


export default Sidebar;
