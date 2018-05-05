import React from 'react';
import PropTypes from 'prop-types';

const Summary = ({
  dancingRegistrationController: {
    wizardController,
    dancingRegistrationForm
  }
}) => {
  const {personalInformation, dancingPreferences} = dancingRegistrationForm.getResult();

  return <div>
    summary
    <div>personal information</div>
    <div>
      <label>first name:</label> {personalInformation.firstName}
    </div>
    <div>
      <label>last name:</label> {personalInformation.lastName}
    </div>
    <div>
      <label>email:</label> {personalInformation.email}
    </div>
    <div>
      <label>phone:</label> {personalInformation.phone}
    </div>
    <div>dancing preferences marks</div>
    <div>
      <label>bachata:</label> {dancingPreferences.bachata}
    </div>
    <div>
      <label>salsa:</label> {dancingPreferences.salsa}
    </div>
    <div>
      <label>kizomba:</label> {dancingPreferences.kizomba}
    </div>
    <button onClick={wizardController.goToPreviousStep}>previous</button>
    <button onClick={wizardController.submit}>submit</button>
  </div>;
};

Summary.propTypes = {
  dancingRegistrationController: PropTypes.object.isRequired
};

export default Summary;
