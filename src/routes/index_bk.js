import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from '.';
import PrivateRoute from './PrivateRoute';

/**
 * Routes are iterated to build the different routes needed
 */
const SwitchRoutes = () => (
  <Switch>
    {routes.map(route => (
      route.privateRoute
        ? (
          <PrivateRoute
            key={route.id}
            exact={route.exact}
            path={route.path}
            render={props => (
              <route.layout>
                <route.component {...props} />
              </route.layout>
            )}
          />
        )
        : (
          <Route
            key={route.id}
            exact={route.exact}
            path={route.path}
            render={props => (
              <route.layout>
                <route.component {...props} />
              </route.layout>
            )}
          />
        )
    ))}
  </Switch>
);

export default SwitchRoutes;
