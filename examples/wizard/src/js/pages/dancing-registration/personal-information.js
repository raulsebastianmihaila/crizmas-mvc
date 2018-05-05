import React from 'react';
import PropTypes from 'prop-types';
import {Input} from 'crizmas-components';

const submit = (controller, e) => {
  e.preventDefault();
  controller.form.submit();
};

const PersonalInformation = ({controller}) => <form onSubmit={submit.bind(null, controller)}>
  personal information
  <div>
    first name: <Input {...controller.form.get('firstName')} />
  </div>
  <div>
    last name: <Input {...controller.form.get('lastName')} />
  </div>
  <div>
    email: <Input {...controller.form.get('email')} />
  </div>
  <div>
    phone: <Input {...controller.form.get('phone')} />
  </div>
  <button>next</button>
</form>;

PersonalInformation.propTypes = {
  controller: PropTypes.object.isRequired
};

export default PersonalInformation;
