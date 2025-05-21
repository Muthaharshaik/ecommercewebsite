import React from 'react';
import { Container, Nav, Navbar, NavDropdown,Badge  } from 'react-bootstrap';
 //this library gives us Bootstrap components as React-ready components.
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/userContext';




const Header = ()=> {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', {}, { withCredentials: true });
      setUser(null); // clear user from context
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  return(
    <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href='/'>Muthahar's Mart</Navbar.Brand>
            {/* Hamburger icon */}
            <Navbar.Toggle/>
            {/* Collapsible content triggered by the hamburger */}
            <Navbar.Collapse className="justify-content-end">
                <Nav className="me-auto">
                  {/* Dynamic Category Links */}
                <Nav.Link as={Link} to="/category/watches">Watches</Nav.Link>
                <Nav.Link as={Link} to="/category/bags">Bags</Nav.Link>
                <Nav.Link as={Link} to="/category/wallets">Wallets</Nav.Link>
                <Nav.Link as={Link} to="/category/jewellery">Jewellery</Nav.Link>
                </Nav>
                          <Nav>
            {user ? (
              <NavDropdown title={user.name} id="user-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}

export default Header;