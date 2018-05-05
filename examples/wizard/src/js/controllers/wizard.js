import Mvc from 'crizmas-mvc';

export default Mvc.controller(function WizardController() {
  const wizard = {
    currentStepIndex: 0,
    lastVisitedStepIndex: 0
  };

  wizard.goToNextStep = () => {
    wizard.currentStepIndex += 1;

    if (wizard.currentStepIndex > wizard.lastVisitedStepIndex) {
      wizard.lastVisitedStepIndex = wizard.currentStepIndex;
    }
  };

  wizard.goToPreviousStep = () => {
    wizard.currentStepIndex -= 1;
  };

  wizard.goToStep = (stepIndex) => {
    if (stepIndex > wizard.lastVisitedStepIndex) {
      throw new Error('Step hasn\'t been visited');
    }

    wizard.currentStepIndex = stepIndex;
  };

  return wizard;
});
