import React from 'react';
import PropTypes from 'prop-types';

const Wizard = ({wizardController, stepsElements}) => {
  const currentStepElement = stepsElements[wizardController.currentStepIndex];

  return <React.Fragment>
    {stepsElements.map((v, i) => <button
      key={i}
      disabled={i > wizardController.lastVisitedStepIndex}
      onClick={i !== wizardController.currentStepIndex
        ? wizardController.goToStep.bind(null, i)
        : undefined}>{i + 1}</button>)}
    {currentStepElement}
  </React.Fragment>;
};

Wizard.propTypes = {
  wizardController: PropTypes.object.isRequired,
  stepsElements: PropTypes.arrayOf(PropTypes.node).isRequired
};

export default Wizard;
