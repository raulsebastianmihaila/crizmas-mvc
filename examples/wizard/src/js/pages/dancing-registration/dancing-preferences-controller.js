import Mvc from 'crizmas-mvc';
import Form, {validation} from 'crizmas-form';

const markValidationFunc = (value) =>
  (value < 1 || value > 5) && 'Mark must be between 1 and 5';

export default Mvc.controller(function DancingPreferencesController({wizardController}) {
  const ctrl = {
    wizardController,
    form: new Form({
      name: 'dancingPreferences',
      children: [
        {
          name: 'bachata',
          validate: validation(
            validation.required(),
            validation.validate(markValidationFunc))
        },
        {
          name: 'salsa',
          validate: validation(
            validation.required(),
            validation.validate(markValidationFunc))
        },
        {
          name: 'kizomba',
          validate: validation(
            validation.required(),
            validation.validate(markValidationFunc))
        }
      ],
      actions: {
        submit: () => {
          wizardController.goToNextStep();
        }
      }
    })
  };

  return ctrl;
});
