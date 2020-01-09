import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../logo';
import Code from '../code';

export default () => <div>
  <h2><Logo text="crizmas-router" /> - Getting started</h2>

  <p>Assuming that you've already installed <Logo /> and its dependencies, proceed with:</p>

  <Code text={`
    npm i crizmas-async-utils # peer dependency
    npm i crizmas-router
  `} />

  <p>If old script tags are used see the dependencies <Link to="/getting-started">here</Link>.</p>

  <h4>Example</h4>

  <div>
    js/main.js
    <Code text={`
      import Mvc from 'crizmas-mvc';
      import Router from 'crizmas-router';

      import Layout from 'js/components/layout';
      import NotFound from 'js/components/not-found';
      import HomePage from 'js/components/home-page';
      import FlowersPage from 'js/components/flowers-page';
      import FlowersController from 'js/controllers/flowers-controller';

      new Mvc({
        domElement: document.querySelector('#app'),
        component: Layout,
        router: new Router({
          routes: [
            {
              path: 'home',
              component: HomePage
            },
            {
              path: 'flowers',
              component: FlowersPage,
              controller: FlowersController
            },
            {
              path: '*',
              component: NotFound
            }
          ]
        })
      });
    `} />
  </div>

  <div>
    js/components/layout.jsx
    <Code text={`
      import React from 'react';
      import PropTypes from 'prop-types';

      const Layout = ({children}) => <div>
        <h1>This is a simple router example.</h1>
        <div>{children}</div>
      </div>;

      Layout.propTypes = {
        children: PropTypes.any
      };

      export default Layout;
    `} />
  </div>

  <div>
    js/components/home-page.jsx
    <Code text={`
      import React from 'react';
      import {Link} from 'crizmas-router';

      export default () => <div>
        <h2>This is the home page</h2>
        <div>Go to the <Link to="/flowers">flowers</Link> page.</div>
      </div>;
    `} />
  </div>

  <div>
    js/controllers/flowers-controller.js
    <Code text={`
      import Mvc from 'crizmas-mvc';

      export default Mvc.controller(class FlowersController {
        constructor() {
          this.count = 0;
        }

        onEnter() {
          alert('Entering the flowers page');
        }

        onLeave() {
          alert('Leaving the flowers page');
        }

        increaseCount() {
          this.count += 1;
        }
      });
    `} />
  </div>

  <div>
    js/components/flowers-page.jsx
    <Code text={`
      import React, {Component} from 'react';
      import PropTypes from 'prop-types';
      import {Link} from 'crizmas-router';

      class FlowersPage extends Component {
        constructor() {
          super();

          this.click = () => {
            this.props.controller.increaseCount();
          };
        }

        render() {
          return <div>
            <h2>This is the flowers page</h2>
            <div>
              <button onClick={this.click}>Click to increase the flowers count</button>
              <div>Flowers count: {this.props.controller.count}</div>
            </div>
            <div>Go to the <Link to="/home">home</Link> page.</div>
          </div>;
        }
      }

      FlowersPage.propTypes = {
        controller: PropTypes.object.isRequired
      };

      export default FlowersPage;
    `} />
  </div>

  <div>
    js/components/not-found.jsx
    <Code text={`
      import React from 'react';
      import {Link} from 'crizmas-router';

      export default () => <div>
        <div>Page not found.</div>
        <div>Go to the <Link to="/home">home</Link> page.</div>
      </div>;
    `} />
  </div>

  <p>Head over to the <Link to="/router/theory">theory</Link> and <Link
  to="/router/api">API</Link> sections for more advanced features and more details.</p>
</div>;
