import React from 'react';

import Logo from 'js/components/logo';
import Code from 'js/components/code';

export default () => <div>
  <h2>Tools</h2>

  <h4><Logo text="crizmas-promise-queue" /> - Promise queue</h4>

  <Code text="npm i crizmas-promise-queue" />

  <b>
    <Code text={`
      import PromiseQueue from 'crizmas-promise-queue';
      // in ES5, PromiseQueue is CrizmasPromiseQueue

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
  the update callback is called. If a previous promise is rejected before
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
</div>;
