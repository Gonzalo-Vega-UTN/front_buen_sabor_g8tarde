import React, { useState } from 'react';
import { BsFillPeopleFill, BsBuilding, BsShop, BsBox, BsBasket, BsPercent, BsCart, BsGraphUp } from 'react-icons/bs';
import { TbRulerMeasure } from "react-icons/tb";
import { LuChefHat } from "react-icons/lu";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { MdDeliveryDining, MdOutlineCategory } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import './style.css';
import { useAuth0 } from "@auth0/auth0-react";
import { IconType } from 'react-icons';

import logo from '../../assets/images/Buen sabor logo 1.png';
import LoginButton from '../Log-Register/LoginButton';
import RegistroButton from '../Log-Register/RegistroButton';
import LogoutButton from '../Log-Register/LogoutButton';

interface RouteItem {
    path: string;
    icon: IconType;
    label: string;
}

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const [selected, setSelected] = useState('');
    const location = useLocation();
    const { isAuthenticated } = useAuth0();

    const handleMouseEnter = () => setExpanded(true);
    const handleMouseLeave = () => setExpanded(false);

    const handleClick = (path: string) => {
        setSelected(path);
    };

    const allRoutes: RouteItem[] = [
        { path: '/empresas', icon: BsBuilding, label: 'Empresas' },
        { path: '/sucursales', icon: BsShop, label: 'Sucursal' },
        { path: '/productos', icon: BsBox, label: 'Productos' },
        { path: '/unidadmedida', icon: TbRulerMeasure, label: 'Medidas' },
        { path: '/ingredientes', icon: BsBasket, label: 'Ingredientes' },
        { path: '/promociones', icon: BsPercent, label: 'Promociones' },
        { path: '/pedidos', icon: BsCart, label: 'Pedidos' },
        { path: '/clientes', icon: BsFillPeopleFill, label: 'Clientes' },
        { path: '/categorias', icon: MdOutlineCategory, label: 'Categorias' },
        { path: '/reportes', icon: BsGraphUp, label: 'Reportes' },
        { path: '/PedidosCajero', icon: LiaCashRegisterSolid, label: 'Cajero' },
        { path: '/PedidosDelivery', icon: MdDeliveryDining, label: 'Delivery' },
        { path: '/PedidosCocinero', icon: LuChefHat, label: 'Cocinero' },
    ];

    const defaultRoutes: RouteItem[] = [
        { path: '/', icon: BsShop, label: 'Tienda' },
        { path: '/acerca-de', icon: LuChefHat, label: 'Acerca De' }
    ];

    return (
        <div
            className={`bg-dark text-white min-vh-100 d-flex flex-column sidebar ${expanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="ms-4 my-3">
                <img src={logo} alt="Logo" className="logo" />
            </div>

            <hr className="text-white" />
            <ul className="nav flex-column flex-grow-1">
                {defaultRoutes.map(({ path, icon: Icon, label }) => (
                    <li className="nav-item" key={path}>
                        <Link
                            to={path}
                            className={`nav-link text-white ${location.pathname === path || selected === path ? 'active' : ''}`}
                            onClick={() => handleClick(path)}
                        >
                            <Icon size={24} className="me-2" />
                            <span className="nav-text">{label}</span>
                        </Link>
                    </li>
                ))}

                {!isAuthenticated && (
                    <>
                        <li className="nav-item">
                            <LoginButton />
                        </li>
                        <li className="nav-item">
                            <RegistroButton />
                        </li>
                    </>
                )}

                {isAuthenticated && (
                    <>
                        <li className="nav-item">
                            <LogoutButton />
                        </li>
                        {allRoutes.map(({ path, icon: Icon, label }) => (
                            <li className="nav-item" key={path}>
                                <Link
                                    to={path}
                                    className={`nav-link text-white ${location.pathname === path || selected === path ? 'active' : ''}`}
                                    onClick={() => handleClick(path)}
                                >
                                    <Icon size={24} className="me-2" />
                                    <span className="nav-text">{label}</span>
                                </Link>
                            </li>
                        ))}
                    </>
                )}
            </ul>
            <div className="mt-auto"></div>
        </div>
    );
}

export default Sidebar;