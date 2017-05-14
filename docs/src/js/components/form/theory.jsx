import React from 'react';
import {Link} from 'crizmas-router';

import Logo from 'js/components/logo';
import Ticks from 'js/components/ticks';
import Code from 'js/components/code';

export default () => <div>
  <h2 id="introduction"><Logo text="crizmas-form" /> - Theory</h2>

  <p>The form is basically a tree of one or more inputs mostly used to set, get
  and validate data.</p>

  <p>Most of the time the data captured with the form represents temporary data
  that doesn't need to be managed though a model. In this case an input has
  an implicit <Ticks text="value" /> property.
  However, there are cases where changing the input
  requires executing some internal model logic or complicated validation.
  For this use case the <Ticks text="getValue" /> and <Ticks text="setValue" /> methods
  can be passed in the form configuration.</p>

  <h4 id="example">Example</h4>

  <div>
    js/models/model.js
    <Code text={`
      export default {
        x: 100,
        y: 101,

        setX(value) {
          this.x = value;
          this.y = this.x + 1;
        },

        validateX() {
          if (this.x % 100 !== 0) {
            return 'x must be divisible by 100';
          }
        }
      };
    `} />
  </div>

  <div>
    js/controllers/controller.js
    <Code text={`
      import Form from 'crizmas-form';

      import model from 'js/models/model';

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
    `} />
  </div>

  <div>
    js/components/view.js
    <Code text={`
      import React from 'react';
      import PropTypes from 'prop-types';
      import {Input} from 'crizmas-components';

      const View = ({controller}) => {
        const xInput = controller.form.get('x');

        return <div>
          <Input {...xInput} value={xInput.getValue()} type="integer" />
          <button onClick={controller.form.submit}>submit</button>
        </div>;
      };

      View.propTypes = {
        controller: PropTypes.object.isRequired
      };

      export default View;
    `} />
  </div>

  <h4 id="inputs">Inputs</h4>

  <p>An input is an instance of the <Ticks text="Input" /> controller. A form is typically
  created using the <Ticks text="Form" /> controller. The object created by the Form
  controller is actually an instance of Input. The difference is that after the form
  creates the root input, it validates the tree of inputs before returning it. The
  inputs that are actually displayed on the page are typically the leaves of the
  input tree. You might be thinking that it would have made sense for the parent nodes
  to not be inputs, but form groups or something like that. If that was the case, there
  would have still been a high degree of API overlapping. At the same time, it's not clear
  that having an input as a parent node is not useful. Say you edit a JSON object. The parent's
  value could be the entire object, while each of its child inputs could hold the value
  of one of the object's properties. You could then switch between two editing modes so that
  you could either edit the entire object as a text, or each property individually.</p>

  <p>Beside the value, an input can have other state as well.
  The <Ticks text="isDirty" />, <Ticks text="isTouched" />, <Ticks
  text="isInputPending" />, <Ticks text="hasErrors" />, <Ticks
  text="errors" />, <Ticks text="isPendingBlocked" /> and <Ticks
  text="isBlocked" /> properties also depend on the
  state of the child inputs, while the <Ticks text="isSubmitted" /> property doesn't.</p>

  <p>The input objects are also observed, so they have the <Ticks
  text="pending" /> and <Ticks text="isPending" /> properties.
  This is especially useful with async
  validation, since it's performed by calling the <Ticks text="validate" /> method
  of an input. This calls the validate methods of all the child inputs in the
  subtree and awaits all the promises returned by them. So whenever an input is
  awaiting an async validation, if the validation was initiated by calling the
  validate method of the root, the root will be pending.</p>

  <h4 id="validation">Validation</h4>

  <p><Logo text="crizmas-form" /> automatically triggers the validation in some situations
  which allows us to do all kinds of complex validations whenever something happens.
  A validation function can return an error string or an array of error strings or
  a promise fulfilled with an error string or array of error strings.
  The validation has an event associated with it, which can be used by a validation
  function to decide whether or not it should do the validation. The validation
  also has an event target associated with it, which is the input in whose context
  the validation was initiated. For instance, if a field is required, it typically
  makes sense to validate it only when the value is changed, when the input loses
  focus and on submit. So, the validation function should return null or undefined to indicate
  that there's no error if the input has a value. And it should return the error
  message if ((the event is change or blur) and the target is the input itself) or
  if (the event is submit and (the target is the input itself or a parent input)).
  Otherwise it should return the old error. For most common cases <Logo
  text="crizmas-form" /> provides validation functions so you don't have to deal with it.</p>

  <p>The events for which <Logo text="crizmas-form" /> automatically triggers the
  validation are <Ticks text="init" /> (when the form is created), <Ticks
  text="change" /> (when the <Ticks text="onChange" /> method
  is called), <Ticks text="blur" /> (when the <Ticks text="onBlur" /> method is
  called), <Ticks text="submit" /> (when the <Ticks text="submit" /> method
  is called), <Ticks text="reset" /> (when the <Ticks text="reset" /> method is
  called), <Ticks text="clear" /> (when the <Ticks text="clear" /> method is
  called), <Ticks text="add" /> (when the <Ticks text="add" /> or <Ticks
  text="addChild" /> are called; addChild is called by add)
  and <Ticks text="remove" /> (when the <Ticks text="remove" /> or <Ticks
  text="removeChild" /> are called; removeChild is called by remove).</p>

  <p>With the exception of the init and submit events, the other events can have as an effect
  the change of the state of the parent nodes. For instance isDirty or isTouched of a parent
  could be modified. Therefore when these events and the init event occur the validation is
  initiated by calling the root's validate method, instead of the target's method.
  A validate method can also be called by the user whenever she sees fit.
  Custom events can be used as well.</p>

  <h4 id="blocking">Blocking</h4>

  <p>An input can be marked with the <Ticks text="isInputPending" /> property
  set to true to indicate that its value will change. This is useful in case of
  a debounced change handler. There are cases where you don't want to allow
  the form submission while the change handler of an input hasn't been executed yet
  (in order to avoid a race condition). Therefore the <Ticks
  text="onStartPending" /> method can be called in order to mark the input as input pending.
  When the <Ticks text="onChange" /> method is called, isInputPending is updated (if
  it has no children with isInputPending true, isInputPending is set to false).
  The input also has an <Ticks text="isPendingBlocked" /> property whose value is true
  while the input is pending or is input pending. If the form is pending blocked
  it cannot be reset or cleared. Whether or not the pending blocking state depends on the
  pending and input pending states can be configured.
  The input also has an <Ticks text="isBlocked" /> property whose value is true
  while the input either is pending blocked or has errors. If the
  form is blocked it cannot be submitted.</p>

  <h4 id="result">Result</h4>

  <p>Any input has the submit method. The actions object that is passed in the
  input configuration can have callbacks for the submit, reset and clear
  events. It can also have other methods. The actions object is observed.
  To get the form results the <Ticks text="getResult" /> method must be called.
  If the input has at least one child without a name, the result will be an array.
  If all the children have a name, the result will be an object. If there are
  no children, the result will be the same as the result of getValue. A form
  can have more submit buttons. This is useful if you want the same submit logic
  to apply to multiple user actions. The actions can be distinguished in the submit
  callback based on the arguments that are passed to the submit method, because
  the submit callback will receive them as well.</p>

  <p>Head over to the <Link to="/form/api">API</Link> and <Link
  to="/form/input-component">input</Link> sections for more details.</p>
</div>;
