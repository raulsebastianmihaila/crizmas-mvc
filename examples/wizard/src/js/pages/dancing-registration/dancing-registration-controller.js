import Mvc from 'crizmas-mvc';
import Form from 'crizmas-form';
import FormWizardController from 'js/controllers/form-wizard';
import PersonalInformationController from './personal-information-controller';
import DancingPreferencesController from './dancing-preferences-controller';

export default Mvc.controller(function DancingRegistrationController() {
  const dancingRegistrationForm = new Form({
    actions: {
      submit: () => {
        console.log(dancingRegistrationForm.getResult());
      }
    }
  });
  const wizardController = new FormWizardController({form: dancingRegistrationForm});
  const ctrl = {
    dancingRegistrationForm,
    wizardController,
    personalInformationController: new PersonalInformationController({wizardController}),
    dancingPreferencesController: new DancingPreferencesController({wizardController})
  };

  dancingRegistrationForm.addChild(ctrl.personalInformationController.form);
  dancingRegistrationForm.addChild(ctrl.dancingPreferencesController.form);

  return ctrl;
});
