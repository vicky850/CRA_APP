import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * This is a private/protected route.
 * If token exists, navigates to requested route.
 * Otherwise naviagtes to login page
 */
const PrivateRoute = ({ render: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    localStorage.getItem('accessToken') ?
      ( <Component {...props} /> ) :
      ( <Redirect to="/login" /> )
  )} />
);

export default PrivateRoute;