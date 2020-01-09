import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../logo';
import Ticks from '../ticks';
import Code from '../code';

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
  Otherwise it should return the old error. Another example that shows how the target is
  useful is the case where we have a start date and an end date, and the end date must
  be greater than the start date, we can use the target of the event to display the error in the
  right place, which allows for better user experience. For instance, if I'm setting the dates
  properly and then later I change my mind and update the end date to be earlier than
  the start date, normally the end date is the one that is correct, because
  I probably had a reason to make the changes by starting with the end date.
  Therefore, in this case, the start date is incorrect and the error should be displayed
  under the start date, not under the end date, even though the end date is the input
  that the user interacted with most recently. For most common cases <Logo
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

  <p>With the exception of the init and submit events, the other events can have as a direct effect
  the change of the state of the parent nodes. For instance isDirty or isTouched of a parent
  could be modified. Therefore when these events occur the validation is
  initiated by calling the root's validate method, instead of the target's method.
  A validate method can also be called by the user whenever she sees fit.
  Custom events can be used as well.</p>

  <p><Logo text="crizmas-form" /> provides an API to create validation functions for standard
  cases. Note that some of these API functions create closures that keep some local state and
  therefore the resulted functions can not be reused for multiple inputs, since they would
  use the same internal state from the closures. Take a look at each one of them on the API
  page to see which ones can be reused and which ones can not.</p>

  <p>Since crizmas-form allows you to associate models with forms and inputs, the validation
  process allows reflecting the validation state of the model in the form as well.</p>

  <h4 id="async-validation-strategy">Async validation strategy</h4>

  <p>A form framework must provide means to validate the inputs, by allowing you to specify
  validation functions that are called when certain events occur. This means that the validation
  process has two sides: 1) the form framework has a certain logic of calling the validation
  functions and 2) the validation functions themselves have a certain logic of deciding whether
  the input has a valid state or not.</p>

  <p>In order to validate inputs that are different from the event's target we must validate the
  entire tree of inputs, which is what happens most of the times. When validating an input,
  crizmas-form first validates its children. This allows the current input to get access to the
  children errors during its own validation.</p>

  <p>The parent input will contain not only its own errors, but also its children errors. After
  validating the children, their errors are collected into an array. After the parent's validation
  function is called, its errors are added to that array and after that the errors array is set on
  the parent input.</p>

  <p>With async validations, it's possible to have interlaid async validations with other either
  sync or async validations. These interlaid validations must be managed so that they don't lead
  to inconsistencies or surprising race conditions. Different approaches are possible.
  For instance, we may want an event that triggers async validations to be treated atomically.
  But what happens if a new event occurs, perhaps even with new form state, while the
  initial async validation is in progress? Should the initial validation be suppressed
  by the new validation? Should the new validation be ignored if there is another validation in
  progress? Or perhaps we want to allow both validations and keep only the result
  from the one that finishes first. Or the one that finishes last.</p>

  <p>Many different scenarios are possible and in each case one or another approach can be more
  appropriate. With our approach the input initially clears the errors. After that, as mentioned,
  the parent gathers the children errors after they are validated. This means that if, during the
  validation process, the children are validated synchronously and the parent asynchronously, the
  children errors are gathered before the parent's validation function is called and if a second
  validation is initiated during the parent's initial async validation, at the end of the parent's
  first validation, the children errors that were gathered may be stale, in case the children have
  new errors from the second validation. Or perhaps the children are validated asynchronously and a
  second sync validation is performed, which means that, during the initial validation, the parent
  will gather the children errors resulted from the second sync validation. What if the children
  errors were gathered after the parent's validation has finalized? The issue in this case is
  that at the end of the validation process that has an event associated with it, the parent will
  reflect children errors that were caused by another validation with possibly a different
  associated event, which may lead to logical inconsistencies. At the same time, it wouldn't make
  sense to disallow interlaid validations, because it would be against the natural
  flow determined by the user's actions together with the changing state of the world. All these
  approaches have downsides, so how do we solve this?</p>

  <p>The key is separation of concerns. As mentioned before: 1) the form framework has a certain
  logic of calling the validation functions and 2) the validation functions themselves have a
  certain logic of deciding whether the input has a valid state or not. The helps us taking the
  simplest route: the form framework does whatever is easier to understand and the validation
  functions can have any custom logic and can be as complex as needed in order to reflect whatever
  behavior is desired. We considered that gathering the children errors right before the parent
  validation function is called is the most intuitive approach as it appears to be an atomic
  process from the parent's perspective and at the same time is agnostic and permissive,
  meaning that interlaid validations are allowed and the parent doesn't care in which validation
  process the children errors were set. Whatever extra logic is needed to obtain the desired
  behavior must be contained in the validation functions.</p>

  <p>This means that in complicated situations the validation functions must be aware of possible
  interlaid validations and must be explicit in handling the possible race conditions in order to
  clearly express the desired behavior. This can be complicated, but crizmas-form saves the day by
  providing a useful API for implementing interlaid async validations for practical cases (see
  the API section).</p>

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

  <p>Head over to the <Link to="/form/api">API</Link> section for more details.</p>
</div>;
