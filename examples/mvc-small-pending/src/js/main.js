import Mvc from 'crizmas-mvc';

import TestPage from './components/test-page';

new Mvc({
  domElement: document.querySelector('#app'),
  component: TestPage
});
