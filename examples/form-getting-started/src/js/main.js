import Mvc from 'crizmas-mvc';
import Router from 'crizmas-router';

import FlowersPage from './components/flowers-page';
import FlowersController from './controllers/flowers-controller';

new Mvc({
  domElement: document.querySelector('#app'),
  router: new Router({
    routes: [
      {
        component: FlowersPage,
        controller: FlowersController
      }
    ]
  })
});
