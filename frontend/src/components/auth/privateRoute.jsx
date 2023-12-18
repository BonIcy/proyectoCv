import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../auth/authService';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      AuthService.isLoggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/SignIn" />
      )
    }
  />
);

export default PrivateRoute;