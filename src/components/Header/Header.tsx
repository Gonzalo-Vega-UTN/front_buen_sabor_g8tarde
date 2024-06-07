import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
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
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => handleNavigation('/')}>
          <h3>Buen Sabor</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0">
            {isAuthenticated && (
              <NavDropdown
                title={<Icon.PersonCircle size={32} />}
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Item href="#action3">Editar Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <BotonLogout />
              </NavDropdown>
            )}
            {!isAuthenticated && <BotonLogin />}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
