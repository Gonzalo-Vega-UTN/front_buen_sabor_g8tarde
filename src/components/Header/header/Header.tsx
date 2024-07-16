import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import * as Icon from 'react-bootstrap-icons';

import { useAuth0 } from '@auth0/auth0-react';


const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

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
            {(
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
            {isAuthenticated }
          </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
