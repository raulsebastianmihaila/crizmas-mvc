import React from 'react';
import {Link} from 'crizmas-router';

import Logo from 'js/components/logo';

export default () => <div>
  <p>
    <Logo /> is a framework based on <a href="https://www.npmjs.com/package/react"
    target="_blank">React</a> and the MVC pattern with the goal of simplifying front-end
    programming.
  </p>

  <p>The main advantages and features of <Logo /> are:</p>
  <ul className="simple-list">
    <li>simplicity for common cases and flexibility for complicated cases</li>
    <li>management of pending trees of objects</li>
    <li>doesn't touch your model, allowing you to write it anyway you want</li>
  </ul>

  <p>Check the <Link to="/getting-started">getting started</Link> and
    the <Link to="/theory">theory</Link> sections for more reasons to use this framework.</p>

  <p>The code is written in ES2016 (without modules), so it's possible that you need
  transcompilation. If that is the case, you need to include the framework files
  in your transcompilation process (you can use a regexp that starts with crizmas-).</p>

  <p>JSX is not used in the framework code so you're not obliged to support JSX.</p>

  <p>Only the browsers with JS proxies are supported.</p>
</div>;
