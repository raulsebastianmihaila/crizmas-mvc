import Mvc from 'crizmas-mvc';

import HomePage from './components/home-page';

new Mvc({
  domElement: document.querySelector('#app'),
  component: HomePage
});
