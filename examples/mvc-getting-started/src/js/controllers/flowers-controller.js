import Mvc from 'crizmas-mvc';
import Form, {validation} from 'crizmas-form';

import flowers, {Flower} from 'js/models/flowers-model';

export default Mvc.controller(class {
  constructor() {
    this.flowers = flowers;

    this.form = new Form({
      children: [
        {
          name: 'name',
          validate: validation(
            validation.required(),
            validation.minLength(5),
            ({input}) => {
              const value = input.getValue();

              if (value) {
                return Flower.validateName(value);
              }
            }
          )
        },

        {
          name: 'daysLeft',
          validate: validation(validation.required(), validation.min(10))
        }
      ],

      actions: {
        submit: () => {
          const formResult = this.form.getResult();

          this.addFlower(formResult.name, formResult.daysLeft);
          this.form.clear();
        }
      }
    });
  }

  addFlower(name, daysLeft) {
    this.flowers.addFlower(name, daysLeft);
  }

  randomizeAges() {
    this.flowers.randomizeAges();
  }
});
