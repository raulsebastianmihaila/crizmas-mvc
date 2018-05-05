import React from 'react';
import PropTypes from 'prop-types';
import Wizard from 'js/components/wizard/wizard';
import PersonalInformation from './personal-information';
import DancingPreferences from './dancing-preferences';
import Summary from './summary';

const DancingRegistration = ({controller}) => <Wizard
  wizardController={controller.wizardController}
  stepsElements={[
    <PersonalInformation key={0} controller={controller.personalInformationController} />,
    <DancingPreferences key={1} controller={controller.dancingPreferencesController} />,
    <Summary key={2} dancingRegistrationController={controller} />
  ]} />;

DancingRegistration.propTypes = {
  controller: PropTypes.object.isRequired
};

export default DancingRegistration;
