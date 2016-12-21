import Mvc from 'crizmas-mvc';
import Router from 'crizmas-router';

import View from 'js/components/view';
import Controller from 'js/controllers/controller';

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
