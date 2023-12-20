import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../auth/authService';

const PrivateRoute = ({ component: Component, ...rest }) => {

const roles = localStorage.getItem('user_role');
  const isLoggedIn = AuthService.isLoggedIn();
  const userRole = AuthService.getRole();
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn && (roles === undefined || roles.includes(userRole)) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/SignIn" />
        )
      }
    />
  );
};

export default PrivateRoute;