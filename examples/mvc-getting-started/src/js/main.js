import Mvc from 'crizmas-mvc';
import Router from 'crizmas-router';

import Layout from 'js/components/layout';
import HomePage from 'js/components/home-page';
import FlowersPage from 'js/components/flowers-page';
import FlowersController from 'js/controllers/flowers-controller';

new Mvc({
  domElement: document.querySelector('#app'),
  component: Layout,
  router: new Router({
    routes: [
      {
        component: HomePage
      },
      {
        path: 'flowers',
        component: FlowersPage,
        controller: FlowersController
      }
    ]
  })
});
