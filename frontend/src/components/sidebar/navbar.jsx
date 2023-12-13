import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">uwu</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/managmentCampers">Management Campers</Nav.Link>
        <Nav.Link as={Link} to="/campers">Campers</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;
