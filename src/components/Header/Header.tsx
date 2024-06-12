import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import * as Icon from 'react-bootstrap-icons';
import BotonLogin from '../Log-Register/BotonLogin';
import BotonLogout from '../Log-Register/BotonLogout';
import { useAuth } from '../../Auth/Auth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRol } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Navbar expand="lg">
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll" className="position-relative">
        <Nav className="me-auto my-2 my-lg-0 position-absolute top-50 end-0 translate-middle-y px-5">
          <NavDropdown title={<Icon.PersonCircle size={32} />} id="navbarScrollingDropdown">
            {isAuthenticated && (
              <>
                <NavDropdown.Item onClick={() => handleNavigation('/perfil')}>
                  Editar Perfil
                </NavDropdown.Item>
                <NavDropdown.Divider />
              </>
            )}
            {userRol === 'Admin' && (
              <>
                <NavDropdown.Item onClick={() => handleNavigation('/productos')}>
                  Productos
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavigation('/ingredientes')}>
                  Ingredientes
                </NavDropdown.Item>
                <NavDropdown.Divider />
              </>
            )}  
            <NavDropdown.Item>
            {isAuthenticated ? <BotonLogout /> : <BotonLogin />}
          </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
