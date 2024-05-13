import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import * as Icon from "react-bootstrap-icons";


export default function Header() {
  const navigate = useNavigate();

  return (
    <Container>
      <Navbar expand="lg" className="border border-dark border-2">
        <Navbar.Brand onClick={() => navigate("/")}>
        
        </Navbar.Brand>
        <Navbar.Collapse id="navbarScroll" className="position-relative">
          <Nav
            className="me-auto my-2 my-lg-0 position-absolute top-50 end-0 translate-middle-y px-5"
            style={{ maxHeight: "100px" }}
          >
            <NavDropdown
              title={<Icon.PersonCircle size={32} />}
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item href="#action3">Editar Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
            
              <NavDropdown.Item onClick={() => navigate("/productos")}>
                Productos
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/ingredientes")}>
                Ingredientes
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action4">Cerrar Sesion</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}
