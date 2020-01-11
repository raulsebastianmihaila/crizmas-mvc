import React from 'react';

import Logo from '../logo';
import Code from '../code';
import Ticks from '../ticks';

export default () => <div>
  <h2>Tools</h2>

  <h4><Logo text="crizmas-promise-queue" /> - Promise queue</h4>

  <Code text="npm i crizmas-promise-queue" />

  <b>
    <Code text={`
      import PromiseQueue from 'crizmas-promise-queue';
      // in ES5, PromiseQueue is window.crizmas.PromiseQueue

      const promiseQueue = new PromiseQueue({
        done(value) {},

        catch(err) {},

        update(value) {}
      });

      function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }

      promiseQueue.add(delay(4000));
      promiseQueue.add(delay(2000));
      promiseQueue.add(delay(5000))
        .then(value => console.log(value));
    `} />
  </b>

  <p>The promise queue is a queue of promises that allows us to discard previous pending
  promises when we have a new promise that we're interested in. The add method
  returns a promise (the queue promise) that will match the state of
  the last promise that was added.
  If a previous promise is fulfilled before the last promise is settled,
  the update callback is called, unless there was a promise that was added afterwards and was
  settled before. If a previous promise is rejected before
  the last promise is settled, the catch callback is called and the queue promise is rejected.
  If all goes well, when the last promise is settled, the queue promise is settled
  and matches the last promise's state. If the queue promise is fulfilled, the done
  callback is called, otherwise the catch callback is called.
  If the add method is called again before the queue promise is settled
  the new promise becomes the last promise and the add method returns the same queue promise.
  If the add method is called again after the queue promise was
  settled a new queue promise is created. The object argument is optional.
  </p>

  <p>The promise queue is used by <Logo text="crizmas-form" /> for asynchronous
  form validations. It can also be used for things like searches that discard
  previous searches when the field value is changed.</p>

  <h4><Logo text="crizmas-async-utils" /> - Cancellation</h4>

  <Code text="npm i crizmas-async-utils" />

  <b>
    <Code text={`
      import {Cancellation} from 'crizmas-async-utils';
      // in ES5, Cancellation is window.crizmas.asyncUtils.Cancellation

      const cancellation = new Cancellation();

      cancellation.cancellable(asyncOperationThatReturnsAPromise()).catch((reason) => {
        console.log(reason.isCancellation); // true
        console.log(reason.message); // 'testing cancellation'
      });

      cancellation.signal.onabort = () => {
        console.log('aborted'); // this is called when the cancel method is called
      };

      const cancellationPromise = cancellation.cancel('testing cancellation');

      cancellationPromise.catch((reason) => {
        console.log(reason.isCancellation); // true
        console.log(reason.message); // 'testing cancellation'
      });
    `} />
  </b>

  <p>The cancellation mechanism can be used in case we decide to ignore the result of an
  async operation at some point, by calling the <Ticks text="cancel" /> method. The same
  cancellation object can be used with as many async operations as we want. The cancellation
  object has an <Ticks text="abort" /> field whose value is a standard <Ticks
  text="AbortSignal" /> object. This can be used to send a signal to the source of the
  async operation promise that we are not interested in the operation any more. This can
  be used together with the standard <Ticks text="fetch" /> API to abort requests to servers.
  The <Ticks text="cancellable" /> method is used to mark the async operation as
  cancellable and its resulted promise will be rejected with the cancellation reason, in case the
  cancellation is triggered before the async operation finished.
  If the async operation finishes before the cancellation
  is triggered, then the cancellable promise is settled with the result of the async operation.
  We can check if the cancellation was triggered by adding event handlers on the signal
  object and by checking its <Ticks text="aborted" /> property. We can also use the cancellation
  promise to check if the cancellation was triggered. This is always rejected with the cancellation
  reason. The cancellation reason is an object with an <Ticks text="isCancellation" /> property
  whose value is true and with a message property whose value will be whatever was passed
  to the <Ticks text="cancel" /> method.</p>

  <p>If you want to create your own cancellation reason objects, you can do so:</p>

  <b>
    <Code text={`
      import {CancellationReason} from 'crizmas-async-utils';
      // in ES5, CancellationReason is window.crizmas.asyncUtils.CancellationReason

      const reason = new CancellationReason('testing cancellation');

      console.log(reason.isCancellation); // true
      console.log(reason.message); // 'testing cancellation'
    `} />
  </b>
</div>;
