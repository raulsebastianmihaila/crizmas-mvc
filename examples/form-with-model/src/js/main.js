import Mvc from 'crizmas-mvc';
import Router from 'crizmas-router';

import View from './components/view';
import Controller from './controllers/controller';

new Mvc({
  domElement: document.querySelector('#app'),
  router: new Router({
    routes: [
      {
        component: View,
        controller: Controller
      }
    ]
  })
});
