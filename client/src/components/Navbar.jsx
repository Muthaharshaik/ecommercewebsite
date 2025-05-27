import React, { useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Badge } from 'react-bootstrap';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/userContext';
import { useCart } from '../context/cartContext';
import { FaShoppingCart } from 'react-icons/fa';
const baseUrl = import.meta.env.VITE_API_BASE_URL;


const Header = () => {
  const { user, setUser } = useUser();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/api/users/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate('/');
      setExpanded(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const handleNavItemClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar bg="light" expand="lg" expanded={expanded} onToggle={setExpanded}>
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleNavItemClick}>
          Muthahar's Mart
        </Navbar.Brand>

        {/* Mobile: Cart first, then Hamburger with small gap */}
        <div className="d-lg-none d-flex align-items-center">
          <Nav.Link
            as={Link}
            to="/cart"
            onClick={handleNavItemClick}
            className="position-relative me-2"
            style={{ padding: '0.25rem' }}
          >
            <FaShoppingCart size={24} />
            {cartCount > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute"
                style={{
                  top: '6px',
                  right: '2px',
                  fontSize: '0.65rem',
                  transform: 'none',
                }}
              >
                {cartCount}
              </Badge>
            )}
          </Nav.Link>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </div>

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-start">
          <Nav className="flex-column flex-lg-row w-100">
            <Nav.Link as={Link} to="/category/watches" onClick={handleNavItemClick}>
              Watches
            </Nav.Link>
            <Nav.Link as={Link} to="/category/bags" onClick={handleNavItemClick}>
              Bags
            </Nav.Link>
            <Nav.Link as={Link} to="/category/wallets" onClick={handleNavItemClick}>
              Wallets
            </Nav.Link>
            <Nav.Link as={Link} to="/category/jewellery" onClick={handleNavItemClick}>
              Jewellery
            </Nav.Link>

            <div className="flex-grow-1" />

            {user ? (
              <NavDropdown title={user.name} id="user-nav-dropdown" onSelect={handleNavItemClick}>
                <NavDropdown.Item
                  onClick={() => {
                    handleLogout();
                    setExpanded(false);
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/register" onClick={handleNavItemClick}>
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login" onClick={handleNavItemClick}>
                  Login
                </Nav.Link>
              </>
            )}

            {/* Desktop cart icon on right */}
            <Nav.Link
              as={Link}
              to="/cart"
              className="d-none d-lg-flex align-items-center position-relative ms-3"
              style={{ padding: '0.25rem' }}
            >
              <FaShoppingCart size={24} />
              {cartCount > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute"
                  style={{
                    top: '0px',
                    right: '2px',
                    fontSize: '0.5rem',
                    transform: 'none',
                  }}
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

