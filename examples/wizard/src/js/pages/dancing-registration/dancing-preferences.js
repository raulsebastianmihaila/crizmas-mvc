import React from 'react';
import PropTypes from 'prop-types';
import {Input} from 'crizmas-components';

const submit = (controller, e) => {
  e.preventDefault();
  controller.form.submit();
};

const DancingPreferences = ({controller}) => <form onSubmit={submit.bind(null, controller)}>
  dancing preferences - give a mark from 1 to 5 for each dancing type
  <div>
    bachata <Input {...controller.form.get('bachata')} type="integer" />
  </div>
  <div>
    salsa <Input {...controller.form.get('salsa')} type="integer" />
  </div>
  <div>
    kizomba <Input {...controller.form.get('kizomba')} type="integer" />
  </div>
  <button type="button" onClick={controller.wizardController.goToPreviousStep}>previous</button>
  <button>next</button>
</form>;

DancingPreferences.propTypes = {
  controller: PropTypes.object.isRequired
};

export default DancingPreferences;
