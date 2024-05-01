import { Navbar, Container, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export const AsideMenu = () => {
  return (
    <Navbar bg="dark" variant="dark" className="p-5">
      <Container>
        <Nav className="flex-column">
          <NavLink to={'/'} className="nav-link">Home</NavLink>
          <NavLink to={'/grilla'} className="nav-link">Grilla</NavLink>
        </Nav>
      </Container>
    </Navbar>
    
  )
}
