import Form from 'crizmas-form';

import model from '../models/model';

export default class {
  constructor() {
    this.form = new Form({
      children: [
        {
          name: 'x',

          getValue() {
            return model.x;
          },

          setValue(value) {
            model.setX(value);
          },

          validate() {
            return model.validateX();
          }
        }
      ],

      actions: {
        submit() {
          console.log('submitted', model);
        }
      }
    });
  }
}
