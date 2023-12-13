import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';  
import 'bootstrap/dist/css/bootstrap.min.css';


const Sidebar = () => {
  const [show, setShow] = useState(false);

  const closeSidebar = () => setShow(false);
  const showSidebar = () => setShow(true);

  return (
    <>
      <Button variant="secondary" onClick={showSidebar}>
        <FaBars />
      </Button>

      <Offcanvas show={show} onHide={closeSidebar}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Uwu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <hr />
          <div>
            <Link to="/managmentCampers" onClick={closeSidebar}>
              Management Campers
            </Link>
          </div>
          <div>
            <Link to="/campers" onClick={closeSidebar}>
              Campers
            </Link>
          </div>
          <div>
            <Link to="/administration" onClick={closeSidebar}>
              Administration
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
