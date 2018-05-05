import Mvc from 'crizmas-mvc';
import Form, {validation} from 'crizmas-form';

const emailRegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default Mvc.controller(function PersonalInformationController({wizardController}) {
  const ctrl = {
    wizardController,
    form: new Form({
      name: 'personalInformation',
      children: [
        {
          name: 'firstName',
          validate: validation(
            validation.required(),
            validation.minLength(3),
            validation.maxLength(50))
        },
        {
          name: 'lastName',
          validate: validation(
            validation.required(),
            validation.minLength(3),
            validation.maxLength(50))
        },
        {
          name: 'email',
          validate: validation(
            validation.required(),
            validation.maxLength(50),
            validation.validate((value) => value && !emailRegExp.test(value) && 'Invalid email'))
        },
        {
          name: 'phone',
          validate: validation(
            validation.required(),
            validation.validate((value) => value && !/^\d{6,20}$/.test(value) && 'Invalid phone'))
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
