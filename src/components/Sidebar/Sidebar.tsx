import React from 'react'
import { BsFillPeopleFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
const Sidebar = () => {
    return (
        <div className="col-auto col-sm-2 bg-dark d-flex flex-column justify-content-between min-vh-100" style={{ width: "100%" }}>
            <div>
                <Link to="" className="text-decoration-none ms-4 d-flex align-items-center  d-none d-sm-inline "></Link>
                <span className="fs-4 text-white">Side Menu</span>
                <hr className="text-white d-none d-sm-block" />
                <ul
                    className="nav nav-pills flex-column"
                >
                    <li className="nav-item ">
                        <Link to="/productos" className="nav-link text-white" aria-current="page">Productos</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/ingredientes" className="nav-link text-white">Ingredientes</Link>
                    </li>
                    <li className="nav-item disabled">
                        <Link to="#" className="nav-link">#</Link>
                    </li>
                </ul>
            </div>


            <div className="dropdown open">
                <a
                    className="btn border-none dropdown-toggle text-white d-flex align-items-center"
                    type="button"
                    id="triggerId"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <BsFillPeopleFill size={24} /> <span className='fs-4 ms-3'>Account</span>
                </a>
                <div className="dropdown-menu" aria-labelledby="triggerId">
                    <Link className="dropdown-item" to="/profile">Profile</Link>
                    <a className="dropdown-item disabled" href="#">Log Out</a>
                </div>
            </div>

        </div>
    )
}

export default Sidebar