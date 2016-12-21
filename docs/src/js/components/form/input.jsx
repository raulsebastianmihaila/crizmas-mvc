import React from 'react';

import Logo from 'js/components/logo';
import Code from 'js/components/code';

export default () => <div>
  <h2><Logo text="crizmas-components" /> - Input</h2>

  <Code text="npm i crizmas-components" />

  <b>
    <Code bold text={`
      import {Input} from 'crizmas-components';
      // in ES5, Input is window.CrizmasInput;

      <Input type="integer" {...someCrizmasInput} />

      // if getValue is used, instead of the automatically created value property,
      // then the result of getValue must be passed explicitly
      <Input type="integer" {...someCrizmasInput} value={someCrizmasInput.getValue()} />
    `} />
  </b>

  <p>If you have your own components, this can be seen as a reference implementation
  of how to deal with the input controller.</p>

  <p>The props that Input can receive are (all optional):</p>
  <ul className="simple-list">
    <li>value</li>
    <li>
      type
      <ul>
        <li>One of 'string', 'text', 'number', 'integer', 'checkbox', 'radio'.</li>
        <li>Defaults to 'string'.</li>
      </ul>
    </li>
    <li>
      initialValue
      <ul>
        <li>If it's falsy and the type of the input is numeric,
        it's used when the input is cleared instead of the empty string.</li>
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
    <li>
      debounce
      <ul>
        <li>Number of milliseconds for change debounce.</li>
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
  which can be overwritten by the debounce prop.</p>
</div>;
