import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../logo';
import Code from '../code';

export default () => <div>
  <h2><Logo text="crizmas-components" /> - Input</h2>

  <p>Make sure you check the <Link to="/components">getting started</Link> section first.</p>

  <b>
    <Code text={`
      import {Input} from 'crizmas-components';
      // in ES5, Input is window.crizmas.Input;

      <Input type="integer" {...someCrizmasInput} />

      // if getValue is used, instead of the automatically created value property,
      // then the result of getValue must be passed explicitly
      <Input type="integer" {...someCrizmasInput} value={someCrizmasInput.getValue()} />
    `} />
  </b>

  <p>If you have your own components, this can be seen as a reference implementation
  of how to deal with the input controller.</p>

  <p>Input has the 'crizmas-input' css class and the 'has-errors' class when it has errors.</p>

  <p>The props that Input can receive are (all optional):</p>
  <ul className="simple-list">
    <li>value</li>
    <li>
      type
      <ul>
        <li>One of 'text', 'password', 'number', 'integer', 'textarea', 'email', 'url',
        'tel', 'search', 'hidden', 'radio', 'checkbox', 'string' (same as 'text').</li>
        <li>Defaults to 'text'.</li>
      </ul>
    </li>
    <li>
      initialValue
      <ul>
        <li>If the input is numeric and it's cleared, instead of using the empty string as
        the new value, the initialValue can be used.</li>
        <li>In order to use the initialValue, it must be falsy. If it's undefined, then
        undefined is used, otherwise null is used.</li>
      </ul>
    </li>
    <li>errors</li>
    <li>
      isPending
      <ul>
        <li>The input is read only while pending.</li>
      </ul>
    </li>
    <li>
      isInputPending
      <ul>
        <li>If it's already true, onStartPending is not called anymore.</li>
      </ul>
    </li>
    <li>
      required
      <ul>
        <li>Displays a star before the input.</li>
      </ul>
    </li>
    <li>placeholder</li>
    <li>className</li>
    <li>inputClassName</li>
    <li>
      inputProps
      <ul>
        <li>An object of props that are passed directly to the HTML input or textarea element.</li>
      </ul>
    </li>
    <li>readOnly</li>
    <li>disabled</li>
    <li>autoFocus</li>
    <li>
      debounce
      <ul>
        <li>Number of milliseconds for change and blur debounce.</li>
        <li>If it's 0 there will be no deobunce at all.</li>
      </ul>
    </li>
    <li>
      onChange
      <ul>
        <li>This should be inputController.onChange.</li>
      </ul>
    </li>
    <li>
      onBlur
      <ul>
        <li>This should be inputController.onBlur.</li>
      </ul>
    </li>
    <li>
      onStartPending
      <ul>
        <li>This should be inputController.onStartPending.</li>
      </ul>
    </li>
  </ul>

  <p>Context props:</p>
  <ul className="simple-list">
    <li>
      inputDebounce
      <ul>
        <li>Number of milliseconds for change debounce.</li>
        <li>If it's 0 there will be no deobunce at all.</li>
      </ul>
    </li>
  </ul>

  <p>The default debounce is 100. It can be overwritten by the inputDebounce context prop,
  which can be overwritten by the debounce prop. The default debounce when the type is
  checkbox or radio is 0. It can only be overwritten by the debounce prop and not by
  the inputDebounce context prop.</p>
</div>;
