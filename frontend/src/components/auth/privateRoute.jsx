import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../auth/authService';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const isLoggedIn = AuthService.isLoggedIn();
  const userRole = AuthService.getRole();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLoggedIn) {
          return <Redirect to="/SignIn" />;
        }

        if (roles && roles.length > 0 && !roles.includes(userRole)) {
          return <Redirect to="/campers" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
