import React, { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useHistory, useLocation  } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';  
import 'bootstrap/dist/css/bootstrap.min.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AuthService from '../auth/authService';

const Sidebar = ( ) => {
  const navigate = useHistory();
  const [show, setShow] = useState(false);
  const closeSidebar = () => setShow(false);
  const showSidebar = () => setShow(true);
  const goSignIn = () =>  navigate.push('/SignIn');
  const goSignUp = () =>  navigate.push("/SignUp");
  const userRole = localStorage.getItem('user_role');
  const location = useLocation();
  const { state } = location;
  

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{bgcolor: '#000087'}}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={showSidebar}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1,  fontFamily: 'Poppins', fontSize: '2rem'}}>
              Working CampusLand
            </Typography>
            <Button color="inherit" style={{ fontFamily: 'Poppins', fontSize: '1rem'}} onClick={goSignIn}>
              Sign In
            </Button>
            <Button color="inherit" style={{ fontFamily: 'Poppins', fontSize: '1rem'}} onClick={goSignUp}>
              Sign Up
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Offcanvas show={show} onHide={closeSidebar}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Uwu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <hr />
          {userRole === 'Admin' && (
          <div>
            <Link to="/managmentCampers" onClick={closeSidebar}>
              Management Campers
            </Link>
          </div>
        )}
        {(userRole === 'Admin' || userRole === 'Company' || userRole === 'User') && (
          <div>
            <Link to="/campers" onClick={closeSidebar}>
              Campers
            </Link>
          </div>
        )}
        {userRole === 'Admin' && (
          <div>
            <Link to="/administration" onClick={closeSidebar}>
              Administration
            </Link>
          </div>
        )}
      </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
