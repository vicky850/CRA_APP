import React from 'react';
import Loadable from 'react-loadable'

import {DefaultLayout} from '../containers';

function Loading() {
  return <div>Loading...</div>;
}

const Forms = Loadable({
  loader: () => import('../views/Base/Forms/Forms'),
  loading: Loading,
});

const ClientMenu = Loadable({
  loader: () => import('../views/Base/Client/ClientMenu'),
  loading: Loading,
});

const ClientMaster = Loadable({
  loader: () => import('../views/Masters/CreateClient'),
  loading: Loading,
});

const FeeComponent = Loadable({
  loader: () => import('../views/Base/Fee/FeeComponent'),
  loading: Loading,
});

const User = Loadable({
  loader: () => import('../views/Users/User'),
  loading: Loading,
});
const Dashboard = Loadable({
  loader: () => import('../views/Dashboard'),
  loading: Loading,
});


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/efiling', name: 'E-Filing', layout: DefaultLayout, privateRoute: false, component: Forms },
  { path: '/client', name: 'Client Menu', layout: DefaultLayout, privateRoute: false, component: ClientMenu },
  { path: '/clientmaster', name: 'Client Master', layout: DefaultLayout, privateRoute: false, component: ClientMaster },
  { path: '/fee', name: 'Fee Module', layout: DefaultLayout, privateRoute: false, component: FeeComponent },
  { path: '/users/:id', exact: true, name: 'User Details', layout: DefaultLayout, privateRoute: false, component: User }
];

export default routes;
