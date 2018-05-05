import Mvc from 'crizmas-mvc';
import React from 'react';
import DancingRegistrationPage from 'js/pages/dancing-registration/dancing-registration';
import DancingRegistrationController
  from 'js/pages/dancing-registration/dancing-registration-controller';

new Mvc({
  element: <DancingRegistrationPage controller={new DancingRegistrationController()} />,
  domElement: document.querySelector('#app')
});
