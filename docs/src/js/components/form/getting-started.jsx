import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../logo';
import Code from '../code';

export default () => <div>
  <h2><Logo text="crizmas-form" /> - Getting started</h2>

  <p>Assuming that you've already installed <Logo /> and its dependencies, proceed with:</p>

  <Code text={`
    npm i crizmas-async-utils # peer dependency
    npm i crizmas-promise-queue # peer dependency
    npm i crizmas-form
  `} />

  <p>If old script tags are used see the dependencies <Link to="/getting-started">here</Link>.</p>

  <h4>Complementary tools</h4>

  <Code text={`
    npm i crizmas-components
  `} />

  <h4>Example</h4>

  <div>
    js/models/flowers-model.js
    <Code text={`
      export class Flower {
        static validateName(name) {
          if (!name.endsWith('flower')) {
            return 'The name must end with flower';
          }
        }

        constructor(name, color) {
          this.name = name;
          this.color = color;
        }
      }

      export default {
        items: [
          new Flower('Red flower', 'red'),
          new Flower('Blue flower', 'blue'),
          new Flower('Pink flower', 'green')
        ],

        addFlower(name, color) {
          this.items.push(new Flower(name, color));
        }
      };
    `} />
  </div>

  <div>
    js/controllers/flowers-controller.js
    <Code text={`
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
    `} />
  </div>

  <div>
    js/components/flowers-page.js
    <Code text={`
      import React, {Component} from 'react';
      import PropTypes from 'prop-types';
      import {Input} from 'crizmas-components';

      export default class FlowersPage extends Component {
        constructor() {
          super();

          this.onAdd = (e) => {
            e.preventDefault();
            this.props.controller.form.submit();
          };
        }

        render() {
          const {flowers, form} = this.props.controller;

          return <div>
            {flowers.items.map((flower, i) => {
              return <div key={i}>
                {flower.name}, {flower.color}
              </div>;
            })}

            <div>
              Add a new flower
              <div>
                <form>
                  <label>name:</label>
                  <Input {...form.get('name')} />
                  <label>color:</label>
                  <Input {...form.get('color')} />
                  <button onClick={this.onAdd}
                    disabled={form.isBlocked}>add</button>
                </form>
              </div>
            </div>
          </div>;
        }
      }

      FlowersPage.propTypes = {
        controller: PropTypes.object.isRequired
      };
    `} />
  </div>

  <div>
    js/main.js
    <Code text={`
      import Mvc from 'crizmas-mvc';
      import Router from 'crizmas-router';

      import FlowersPage from 'js/components/flowers-page';
      import FlowersController from 'js/controllers/flowers-controller';

      new Mvc({
        domElement: document.querySelector('#app'),
        router: new Router({
          routes: [
            {
              component: FlowersPage,
              controller: FlowersController
            }
          ]
        })
      });
    `} />
  </div>

  <p>Head over to the <Link to="/form/theory">theory</Link> and <Link
  to="/form/api">API</Link> sections for more advanced features and more details.</p>
</div>;
