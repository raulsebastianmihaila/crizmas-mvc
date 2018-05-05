import Mvc from 'crizmas-mvc';
import WizardController from './wizard';

export default Mvc.controller(function FormWizardController({form}) {
  const wizardController = new WizardController();

  wizardController.submit = () => {
    form.submit();

    if (form.hasErrors) {
      form.children.some((subForm, i) => {
        if (subForm.hasErrors) {
          wizardController.goToStep(i);

          return true;
        }
      });
    }
  };

  return wizardController;
});
