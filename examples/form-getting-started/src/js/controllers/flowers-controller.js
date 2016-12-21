import Mvc from 'crizmas-mvc';
import Form, {validation} from 'crizmas-form';

import flowers, {Flower} from 'js/models/flowers-model';

export default Mvc.controller(class HomeController {
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
          name: 'color',
          validate: validation.required()
        }
      ],

      actions: {
        submit: () => {
          const formResult = this.form.getResult();

          this.addFlower(formResult.name, formResult.color);
          this.form.clear();
        }
      }
    });
  }

  addFlower(name, color) {
    this.flowers.addFlower(name, color);
  }
});
