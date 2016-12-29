import React from 'react';
import {Link} from 'crizmas-router';

import Code from 'js/components/code';

export default () => <div>
  <h2>Getting started</h2>

  <Code text={`
    npm i react
    npm i react-dom
    npm i crizmas-utils # peer dependency
    npm i crizmas-mvc
  `} />

  <p>If script tags are used:</p>

  <Code text={`
    <!-- not minified -->

    <script src="path-to-node_modules/crizmas-utils/src/utils.js"></script>
    <script src="path-to-node_modules/crizmas-mvc/src/observe.js"></script>
    <!-- mvc depends on react, react-dom, utils and observe -->
    <script src="path-to-node_modules/crizmas-mvc/src/mvc.js"></script>
  `} />

  <h4>Complementary tools</h4>

  <Code text={`
    npm i crizmas-async-utils # peer dependency of router and form
    npm i crizmas-promise-queue # peer dependency of form
    npm i crizmas-router
    npm i crizmas-form
    npm i crizmas-components
  `} />

  <p>If script tags are used:</p>

  <Code text={`
    <!-- not minified -->

    <!-- async utils depends on utils -->
    <script src="path-to-node_modules/crizmas-async-utils/src/async-utils.js"></script>
    <script src="path-to-node_modules/crizmas-promise-queue/src/promise-queue.js"></script>
    <script src="path-to-node_modules/crizmas-router/src/history.js"></script>
    <!-- router depends on react, mvc, history, utils and async utils -->
    <script src="path-to-node_modules/crizmas-router/src/router.js"></script>
    <!-- form depends on mvc and async utils -->
    <script src="path-to-node_modules/crizmas-form/src/form.js"></script>
    <!-- validation depends on utils and promise queue -->
    <script src="path-to-node_modules/crizmas-form/src/validation.js"></script>
    <script src="path-to-node_modules/crizmas-components/src/utils.js"></script>
    <!-- input depends on react and components utils -->
    <script src="path-to-node_modules/crizmas-components/src/components/input.js"></script>
  `} />

  <h4>Example</h4>

  <p>The model manages the domain logic.</p>

  <div>
    js/models/flowers-model.js
    <Code text={`
      export class Flower {
        static validateName(name) {
          if (!name.endsWith('flower')) {
            return 'The name must end with flower';
          }
        }

        constructor(name, daysLeft = 50) {
          this.name = name;
          this.daysLeft = daysLeft;
        }

        get isAlive() {
          return this.daysLeft > 0;
        }

        randomizeAge() {
          if (this.isAlive) {
            this.daysLeft -= Math.ceil(Math.random() * this.daysLeft);
          }
        }
      }

      export default {
        items: [
          new Flower('Red flower'),
          new Flower('Blue flower'),
          new Flower('Pink flower')
        ],

        addFlower(name, daysLeft) {
          this.items.push(new Flower(name, daysLeft));
        },

        randomizeAges() {
          this.items.forEach(flower => flower.randomizeAge());
        }
      };
    `} />

    <p>The controller stands between the view and the model, as the UI shouldn't try
    to modify the state of the model through direct interaction. The controller asks the model
    to update itself based on certain input or actions. The controller can also provide
    instructions to the view (preferably in a reactive fashion) and can create the connection
    between the current context of the application and other parts of the application,
    for instance by initiating route transitioning.</p>

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
    `} />

    <p>The view handles the rendering process. It can reflect the state of the model. It also asks
    the controller to handle the user's input and actions.</p>

    js/components/flowers-page.jsx
    <Code text={`
      import React, {Component, PropTypes} from 'react';
      import {Input} from 'crizmas-components';

      export default class FlowersPage extends Component {
        constructor() {
          super();

          this.onAdd = (e) => {
            e.preventDefault();
            this.props.controller.form.submit();
          };

          this.onRandomizeAges = () => {
            this.props.controller.randomizeAges();
          };
        }

        render() {
          const {flowers, form} = this.props.controller;

          return <div>
            <button onClick={this.onRandomizeAges}>randomize ages</button>

            {flowers.items.map((flower, i) => {
              return <div key={i}
                style={flower.isAlive ? null : {textDecoration: 'line-through'}}>
                {flower.name}, {flower.daysLeft} days left
              </div>;
            })}

            <div>
              Add a new flower
              <div>
                <form>
                  <label>name:</label>
                  <Input {...form.get('name')} />
                  <label>days left:</label>
                  <Input {...form.get('daysLeft')} type="integer" />
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

    <p>Here we're creating our application. We must provide a dom element. We must also provide
    at least a component, an element or a router. So each of these is optional as long as we
    provide one of them.</p>

    js/main.js
    <Code text={`
      import Mvc from 'crizmas-mvc';
      import Router from 'crizmas-router';

      import Layout from 'js/components/layout';
      import HomePage from 'js/components/home-page';
      import FlowersPage from 'js/components/flowers-page';
      import FlowersController from 'js/controllers/flowers-controller';

      new Mvc({
        domElement: document.querySelector('#app'),
        component: Layout,
        router: new Router({
          routes: [
            {
              component: HomePage
            },
            {
              path: 'flowers',
              component: FlowersPage,
              controller: FlowersController
            }
          ]
        })
      });
    `} />

    <p>Head over to the <Link to="/theory">theory</Link>, <Link to="/router">router
    </Link> and <Link to="/form">form</Link> sections for more details.</p>
  </div>
</div>;
