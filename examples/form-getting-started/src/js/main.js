import Mvc from 'crizmas-mvc';
import Router from 'crizmas-router';

import FlowersPage from 'js/components/flowers-page';
import FlowersController from 'js/controllers/flowers-controller';

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
