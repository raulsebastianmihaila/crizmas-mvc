import Mvc from 'crizmas-mvc';
import Router from 'crizmas-router';

import Layout from './components/layout';
import NotFound from './components/not-found';
import HomePage from './components/home-page';
import FlowersPage from './components/flowers-page';
import FlowersController from './controllers/flowers-controller';

new Mvc({
  domElement: document.querySelector('#app'),
  component: Layout,
  router: new Router({
    routes: [
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'flowers',
        component: FlowersPage,
        controller: FlowersController
      },
      {
        path: '*',
        component: NotFound
      }
    ]
  })
});
