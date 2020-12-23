import {jest} from '@jest/globals';

import {isVal, isObj, isFunc, isThenable, resolveThenable, awaitFor, awaitAll, PromiseQueue,
  Cancellation, CancellationReason} from '../src/utils.js';

describe('utils', () => {
  describe('isVal', () => {
    test('null is not a val', () => {
      expect(isVal(null)).toBe(false);
    });

    test('undefined is not a val', () => {
      expect(isVal(undefined)).toBe(false);
    });

    test('a number is a val', () => {
      expect(isVal(3)).toBe(true);
    });

    test('0 is a val', () => {
      expect(isVal(0)).toBe(true);
    });

    test('NaN is a val', () => {
      expect(isVal(NaN)).toBe(true);
    });

    test('a string is a val', () => {
      expect(isVal('str')).toBe(true);
    });

    test('the empty string is a val', () => {
      expect(isVal('')).toBe(true);
    });

    test('true is a val', () => {
      expect(isVal(true)).toBe(true);
    });

    test('false is a val', () => {
      expect(isVal(false)).toBe(true);
    });

    test('a symbol is a val', () => {
      expect(isVal(Symbol())).toBe(true);
    });

    test('an object is a val', () => {
      expect(isVal({})).toBe(true);
    });

    test('a function is a val', () => {
      expect(isVal(() => {})).toBe(true);
    });
  });

  describe('isObj', () => {
    test('an object is an obj', () => {
      expect(isObj({})).toBe(true);
    });

    test('an object proxy is an obj', () => {
      expect(isObj(new Proxy({}, {}))).toBe(true);
    });

    test('an array is an obj', () => {
      expect(isObj([])).toBe(true);
    });

    test('null is not an obj', () => {
      expect(isObj(null)).toBe(false);
    });

    test('undefined is not an obj', () => {
      expect(isObj(undefined)).toBe(false);
    });

    test('a number is not an obj', () => {
      expect(isObj(3)).toBe(false);
    });

    test('a string is not an obj', () => {
      expect(isObj('str')).toBe(false);
    });

    test('a boolean is not an obj', () => {
      expect(isObj(true)).toBe(false);
    });

    test('a symbol is not an obj', () => {
      expect(isObj(Symbol())).toBe(false);
    });

    test('a function is not an obj', () => {
      expect(isObj(() => {})).toBe(false);
    });
  });

  describe('isFunc', () => {
    test('a traditional function is a func', () => {
      expect(isFunc(function () {})).toBe(true);
    });

    test('a function proxy is a func', () => {
      expect(isFunc(new Proxy(function () {}, {}))).toBe(true);
    });

    test('an arrow function is a func', () => {
      expect(isFunc(() => {})).toBe(true);
    });

    test('a class is a func', () => {
      expect(isFunc(class {})).toBe(true);
    });

    test('an async function is a func', () => {
      expect(isFunc(async () => {})).toBe(true);
    });

    test('a generator is a func', () => {
      expect(isFunc(function* () {})).toBe(true);
    });

    test('null is not a func', () => {
      expect(isFunc(null)).toBe(false);
    });

    test('undefined is not a func', () => {
      expect(isFunc(undefined)).toBe(false);
    });

    test('a number is not a func', () => {
      expect(isFunc(3)).toBe(false);
    });

    test('a string is not a func', () => {
      expect(isFunc('str')).toBe(false);
    });

    test('a boolean is not a func', () => {
      expect(isFunc(true)).toBe(false);
    });

    test('a symbol is not a func', () => {
      expect(isFunc(Symbol())).toBe(false);
    });

    test('an obj is not a func', () => {
      expect(isFunc({})).toBe(false);
    });
  });

  describe('isThenable', () => {
    test('a promise is a promise', () => {
      expect(isThenable(Promise.resolve())).toBe(true);
    });

    test('a promise proxy is a promise', () => {
      expect(isThenable(new Proxy(Promise.resolve(), {}))).toBe(true);
    });

    test('a Promise subclass instance is a promise', () => {
      expect(isThenable(new class SubPromise extends Promise {}(() => {}))).toBe(true);
    });

    test('a thenable is a promise', () => {
      expect(isThenable({ then() {} })).toBe(true);
    });

    test('null is not a promise', () => {
      expect(isThenable(null)).toBe(false);
    });

    test('undefined is not a promise', () => {
      expect(isThenable(undefined)).toBe(false);
    });

    test('a number is not a promise', () => {
      expect(isThenable(3)).toBe(false);
    });

    test('a string is not a promise', () => {
      expect(isThenable('str')).toBe(false);
    });

    test('a boolean is not a promise', () => {
      expect(isThenable(true)).toBe(false);
    });

    test('a symbol is not a promise', () => {
      expect(isThenable(Symbol())).toBe(false);
    });

    test('an obj is not a promise', () => {
      expect(isThenable({})).toBe(false);
    });

    test('a function is not a promise', () => {
      expect(isThenable(() => {})).toBe(false);
    });
  });

  describe('resolveThenable', () => {
    test('a promise is the same as the result', () => {
      const promise = Promise.resolve();

      expect(resolveThenable(promise)).toBe(promise);
    });

    test('a promise proxy is the same as the result', () => {
      const promiseProxy = new Proxy(Promise.resolve(), {});

      expect(resolveThenable(promiseProxy)).toBe(promiseProxy);
    });

    test('an instance of a Promise subclass is the same as the result', () => {
      const subPromise = new class SubPromise extends Promise {}(() => {});

      expect(resolveThenable(subPromise)).toBe(subPromise);
    });

    test('a thenable is converted to a promise', () => {
      const thenable = { then() {} };
      const resolvedThenable = resolveThenable(thenable);

      expect(isThenable(resolvedThenable)).toBe(true);
      expect(resolvedThenable).not.toBe(thenable);
    });

    test('a thenable\'s conversion resolution is decided by the thenable', () => {
      expect.assertions(1);

      const resolutionValue = 200;

      return resolveThenable({ then(r) { r(resolutionValue); } }).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('null is resolved', () => {
      expect.assertions(1);

      const resolutionValue = null;

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('undefined is resolved', () => {
      expect.assertions(1);

      const resolutionValue = undefined;

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a number is resolved', () => {
      expect.assertions(1);

      const resolutionValue = 3;

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a string is resolved', () => {
      expect.assertions(1);

      const resolutionValue = 'str';

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a boolean is resolved', () => {
      expect.assertions(1);

      const resolutionValue = true;

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a symbol is resolved', () => {
      expect.assertions(1);

      const resolutionValue = Symbol();

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('an obj is resolved', () => {
      expect.assertions(1);

      const resolutionValue = {};

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a function is resolved', () => {
      expect.assertions(1);

      const resolutionValue = () => {};

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });
  });

  describe('awaitFor', () => {
    test('await synchronous value', () => {
      expect.assertions(1);

      awaitFor(3, (value) => {
        expect(value).toBe(3);
      });
    });

    test('awaiting synchronous value is synchronous', () => {
      expect.assertions(1);

      let step = 0;

      awaitFor(3, () => {
        expect(step).toBe(0);
      });

      step = 1;
    });

    test('await promise', () => {
      expect.assertions(1);

      return awaitFor(Promise.resolve(3), (value) => {
        expect(value).toBe(3);
      });
    });

    test('await rejected promise', () => {
      expect.assertions(1);

      return awaitFor(
        Promise.reject(3),
        null,
        (reason) => {
          expect(reason).toBe(3);
        }
      );
    });

    test('awaiting promise is asynchronous', () => {
      expect.assertions(1);

      let step = 0;
      const result = awaitFor(Promise.resolve(), () => {
        expect(step).toBe(1);
      });

      step = 1;

      return result;
    });

    test('success callback modifies the result', () => {
      expect(awaitFor(3, () => 10)).toBe(10);
    });

    test('await awaited promise with success callback with different result', () => {
      expect.assertions(1);

      awaitFor(
        awaitFor(Promise.resolve(3), () => 10),
        (value) => {
          expect(value).toBe(10);
        }
      );
    });

    test('await awaited promise with rejecting success callback', () => {
      expect.assertions(1);

      return awaitFor(
        awaitFor(Promise.resolve(), () => Promise.reject(3)),
        null,
        (reason) => {
          expect(reason).toBe(3);
        }
      );
    });

    test('await awaited promise with rejecting error callback', () => {
      expect.assertions(1);

      return awaitFor(
        awaitFor(Promise.reject(), () => {}, () => Promise.reject(3)),
        null,
        (reason) => {
          expect(reason).toBe(3);
        }
      );
    });

    test('awaited thenable is converted to promise', () => {
      expect.assertions(1);

      return awaitFor({ then(r) { r(3); } }).then((value) => {
        expect(value).toBe(3);
      });
    });

    test('await synchronous value with no callback', () => {
      expect(awaitFor(1)).toBe(1);
    });
  });

  describe('awaitAll', () => {
    test('await no values with no callback', () => {
      expect(awaitAll(0)).toBe(0);
    });

    test('await no values with callback', () => {
      expect(awaitAll(0, () => 3)).toBe(3);
    });

    test('await synchronous values', () => {
      expect.assertions(1);

      awaitAll([1, 2], (values) => {
        expect(values).toEqual([1, 2]);
      });
    });

    test('awaiting synchronous values is synchronous', () => {
      expect.assertions(1);

      let step = 0;

      awaitAll([1, 2], () => {
        expect(step).toBe(0);
      });

      step = 1;
    });

    test('await promises', () => {
      expect.assertions(1);

      return awaitAll([
        Promise.resolve(1),
        2,
        Promise.resolve(3)
      ], (values) => {
        expect(values).toEqual([1, 2, 3]);
      });
    });

    test('await promises that include a rejection', () => {
      expect.assertions(1);

      const rejectionReasons = [, 2];

      rejectionReasons.success = [1, , 3];

      return awaitAll(
        [
          Promise.resolve(1),
          Promise.reject(2),
          Promise.resolve(3)
        ],
        null,
        (reasons) => {
          expect(reasons).toEqual(rejectionReasons);
        }
      );
    });

    test('awaiting promises is asynchronous', () => {
      expect.assertions(1);

      let step = 0;
      const result = awaitAll([1, Promise.resolve()], () => {
        expect(step).toBe(1);
      });

      step = 1;

      return result;
    });

    test('success callback modifies the result', () => {
      expect(awaitAll([1, 2], () => 10)).toBe(10);
    });

    test('await values with no callback', () => {
      expect(awaitAll([1, 2])).toEqual([1, 2]);
    });

    test('await awaited promises with success callback with different result', () => {
      expect.assertions(1);

      awaitFor(
        awaitAll([1, Promise.resolve(3)], () => 10),
        (value) => {
          expect(value).toBe(10);
        }
      );
    });

    test('await awaited promises with rejecting success callback', () => {
      expect.assertions(1);

      return awaitFor(
        awaitAll([1, Promise.resolve()], () => Promise.reject(2)),
        null,
        (reason) => {
          expect(reason).toBe(2);
        }
      );
    });

    test('await awaited promises with rejecting error callback', () => {
      expect.assertions(1);

      return awaitFor(
        awaitAll([1, Promise.reject()], () => {}, () => Promise.reject(2)),
        null,
        (reason) => {
          expect(reason).toBe(2);
        }
      );
    });

    test('await thenables', () => {
      expect.assertions(1);

      return awaitAll(
        [
          { then(r) { r(1); } },
          Promise.resolve(2)
        ],
        (values) => {
          expect(values).toEqual([1, 2]);
        });
    });

    test('returns a promise when awaiting a promise', () => {
      expect.assertions(1);

      return awaitAll([
        Promise.resolve(1),
        2
      ]).then((values) => {
        expect(values).toEqual([1, 2]);
      });
    });
  });

  describe('PromiseQueue', () => {
    test('throws if add input is not a promise', () => {
      expect.assertions(1);

      const promiseQueue = new PromiseQueue();

      expect(() => {
        promiseQueue.add(1);
      }).toThrowError(Error);
    });

    test('end result promise with no options', () => {
      expect.assertions(1);

      const promiseQueue = new PromiseQueue();

      return promiseQueue.add(Promise.resolve(1)).then((value) => {
        expect(value).toBe(1);
      });
    });

    test('end result promise is rejected', () => {
      expect.assertions(1);

      const promiseQueue = new PromiseQueue();

      return promiseQueue.add(Promise.reject(1)).catch((reason) => {
        expect(reason).toBe(1);
      });
    });

    test('end result', () => {
      expect.assertions(1);

      const promiseQueue = new PromiseQueue({
        done: (value) => {
          expect(value).toBe(1);
        }
      });

      promiseQueue.add(Promise.resolve(4));

      return promiseQueue.add(Promise.resolve(1));
    });

    test('later result', () => {
      expect.assertions(1);

      const promiseQueue = new PromiseQueue({
        done: (value) => {
          expect(value).toBe(4);
        }
      });

      promiseQueue.add(Promise.resolve().then(() => 1));

      return promiseQueue.add(Promise.resolve(4));
    });

    test('update', () => {
      expect.assertions(2);

      const resolutionValues = [1, 2];
      let resolutionIndex = 0;

      const promiseQueue = new PromiseQueue({
        update: (value) => {
          expect(value).toBe(resolutionValues[resolutionIndex]);

          resolutionIndex += 1;
        }
      });

      promiseQueue.add(Promise.resolve(1));

      return promiseQueue.add(Promise.resolve(2));
    });

    test('reverse update', () => {
      expect.assertions(1);

      const promiseQueue = new PromiseQueue({
        update: (value) => {
          expect(value).toBe(1);
        }
      });

      promiseQueue.add(Promise.resolve().then(() => 555));

      return promiseQueue.add(Promise.resolve(1));
    });

    test('later update with ignored fulfilled promise', () => {
      expect.assertions(2);

      const resolutionValues = [1, 2, 3];
      const resolutionIndeces = [0, 2];
      let resolutionStep = 0;

      const promiseQueue = new PromiseQueue({
        update: (value) => {
          expect(value).toBe(resolutionValues[resolutionIndeces[resolutionStep]]);

          resolutionStep += 1;
        }
      });

      promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(() => 1)));

      promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(
          () => Promise.resolve().then(() => 2))));

      return promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(() => 3)));
    });

    test('two later updates with ignored earlier fulfilled promise', () => {
      expect.assertions(2);

      const resolutionValues = [1, 2, 3];
      const resolutionIndeces = [1, 2];
      let resolutionStep = 0;

      const promiseQueue = new PromiseQueue({
        update: (value) => {
          expect(value).toBe(resolutionValues[resolutionIndeces[resolutionStep]]);

          resolutionStep += 1;
        }
      });

      promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(
          () => Promise.resolve().then(() => 1))));

      promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(() => 2)));

      return promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(
          () => Promise.resolve().then(() => 3))));
    });

    test('catch', () => {
      expect.assertions(2);

      const promiseQueue = new PromiseQueue({
        catch: (reason) => {
          expect(reason).toBe(1);
        }
      });

      promiseQueue.add(Promise.reject(1));

      return promiseQueue.add(Promise.resolve(2)).catch((reason) => {
        expect(reason).toBe(1);
      });
    });

    test('later update with ignored rejected promise', () => {
      expect.assertions(3);

      const resolutionValues = [1, 2, 3];
      const resolutionIndeces = [0, 2];
      let resolutionStep = 0;

      const promiseQueue = new PromiseQueue({
        update: (value) => {
          expect(value).toBe(resolutionValues[resolutionIndeces[resolutionStep]]);

          resolutionStep += 1;
        }
      });

      promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(() => 1)));

      promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(
          () => Promise.resolve().then(() => Promise.reject(2)))));

      return promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(() => 3))).then((result) => {
          expect(result).toBe(3);
        });
    });

    test('later update with ignored rejected promise and uncalled catch callback', () => {
      expect.assertions(4);

      const resolutionValues = [1, 2, 3];
      const resolutionIndeces = [0, 2];
      let resolutionStep = 0;
      const observation = jest.fn();

      const promiseQueue = new PromiseQueue({
        update: (value) => {
          expect(value).toBe(resolutionValues[resolutionIndeces[resolutionStep]]);

          resolutionStep += 1;
        },

        catch: () => {
          observation();
        }
      });

      promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(() => 1)));

      promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(
          () => Promise.resolve().then(() => Promise.reject(2)))));

      return promiseQueue.add(Promise.resolve().then(
        () => Promise.resolve().then(() => 3))).then((result) => {
          expect(result).toBe(3);
          expect(observation.mock.calls.length).toBe(0);
        });
    });

    test('superseded rejected promise rejects the queue while the queue is pending', () => {
      expect.assertions(3);

      const observation = jest.fn();
      const promiseQueue = new PromiseQueue({
        catch: () => {
          observation();
        }
      });

      const promise1 = promiseQueue.add(Promise.resolve().then(() => Promise.reject(1)));

      promiseQueue.add(Promise.resolve(2));

      const promise2 = promiseQueue.add(Promise.resolve().then(() => Promise.resolve(3)));

      return promise2.catch((reason) => {
        expect(reason).toBe(1);
        expect(observation.mock.calls.length).toBe(1);
        expect(promise1).toBe(promise2);
      });
    });

    test('slower intermediate promises are not awaited', () => {
      expect.assertions(1);

      let number = 1;
      const promiseQueue = new PromiseQueue();

      promiseQueue.add(new Promise((r) => setTimeout(r, 1000)).then(() => {
        number += 100;
      }));

      return promiseQueue.add(Promise.resolve(4)).then(() => {
        expect(number).toBe(1);
      });
    });

    test('add returns the same promise', () => {
      expect.assertions(2);

      const promiseQueue = new PromiseQueue();

      expect(promiseQueue.add(Promise.resolve())).toBe(promiseQueue.add(Promise.resolve()));
      expect(typeof promiseQueue.add(Promise.resolve()).then).toBe('function');
    });

    test('add returns a new promise if the old one is settled', () => {
      expect.assertions(1);

      const promiseQueue = new PromiseQueue();
      const promise = promiseQueue.add(Promise.resolve());

      return promise.then(() => {
        expect(promiseQueue.add(Promise.resolve()) === promise).toBe(false);
      });
    });

    test('fulfilled queue can still be used', () => {
      expect.assertions(2);

      const promiseQueue = new PromiseQueue();

      return promiseQueue.add(Promise.resolve(4)).then((result) => {
        expect(result).toBe(4);

        return promiseQueue.add(Promise.resolve(6)).then((result) => {
          expect(result).toBe(6);
        });
      });
    });

    test('rejected queue can still be used', () => {
      expect.assertions(2);

      const promiseQueue = new PromiseQueue();

      return promiseQueue.add(Promise.reject(4)).catch((reason) => {
        expect(reason).toBe(4);

        return promiseQueue.add(Promise.resolve(6)).then((result) => {
          expect(result).toBe(6);
        });
      });
    });
  });

  describe('Cancellation', () => {
    test('cancellable returns a promise', () => {
      const cancellation = new Cancellation();
      const promise = cancellation.cancellable(Promise.resolve());

      expect(isThenable(promise)).toBe(true);

      return promise;
    });

    test('cancel returns a promise that rejects with the cancellation reason', () => {
      expect.assertions(3);

      const cancellation = new Cancellation();
      const promise1 = cancellation.cancellable(1).then((value) => expect(value).toBe(1));
      const promise2 = cancellation.cancel('testing cancellation').catch((reason) => {
        expect(reason.isCancellation).toBe(true);
        expect(reason.message).toBe('testing cancellation');
      });

      cancellation.cancel('cancelled');

      return Promise.all([promise1, promise2]);
    });

    test('rejects with a cancellation reason with the provided message', () => {
      expect.assertions(2);

      const cancellation = new Cancellation();
      const promise = cancellation.cancellable(Promise.resolve().then()).catch((reason) => {
        expect(reason.isCancellation).toBe(true);
        expect(reason.message).toBe('testing cancellation');
      });

      cancellation.cancel('testing cancellation');

      return promise;
    });

    test('an abort event is dispatched on the abort signal', () => {
      expect.assertions(2);

      const abortHandler = jest.fn();
      const cancellation = new Cancellation();
      const promise = cancellation.cancellable(Promise.resolve().then()).catch((reason) => {
        expect(reason.isCancellation).toBe(true);
      });

      cancellation.signal.onabort = abortHandler;

      cancellation.cancel('testing cancellation');

      expect(abortHandler.mock.calls.length).toBe(1);

      return promise;
    });

    test('can cancel multiple operations', () => {
      expect.assertions(5);

      const abortHandler = jest.fn();
      const cancellation = new Cancellation();
      const promise1 = cancellation.cancellable(Promise.resolve().then()).catch((reason) => {
        expect(reason.isCancellation).toBe(true);
        expect(reason.message).toBe('testing cancellation');
      });
      const promise2 = cancellation.cancellable(Promise.resolve().then()).catch((reason) => {
        expect(reason.isCancellation).toBe(true);
        expect(reason.message).toBe('testing cancellation');
      });

      cancellation.signal.onabort = abortHandler;

      cancellation.cancel('testing cancellation');

      expect(abortHandler.mock.calls.length).toBe(1);

      return Promise.all([promise1, promise2]);
    });

    test('cancelling with no associated operation doesn\'t throw', () => {
      expect.assertions(3);

      let promise;

      expect(() => {
        promise = new Cancellation().cancel('cancelled');
      }).not.toThrow();

      return promise.catch((reason) => {
        expect(reason.isCancellation).toBe(true);
        expect(reason.message).toBe('cancelled');
      });
    });

    test('cancelling twice doesn\'t throw', () => {
      expect.assertions(3);

      const cancellation = new Cancellation();
      const promise = cancellation.cancellable(Promise.resolve().then()).catch((reason) => {
        expect(reason.isCancellation).toBe(true);
        expect(reason.message).toBe('testing cancellation');
      });

      expect(() => {
        cancellation.cancel('testing cancellation');
        cancellation.cancel('testing cancellation2');
      }).not.toThrow();

      return promise;
    });

    test('cancelling already finished operation doesn\'t throw and operation is successful', () => {
      expect.assertions(2);

      const cancellation = new Cancellation();
      const operation = Promise.resolve('success');

      return operation.then(() => {
        const promise = cancellation.cancellable(operation).then((val) => {
          expect(val).toBe('success');
        });

        expect(() => {
          cancellation.cancel('testing cancellation');
          cancellation.cancel('testing cancellation2');
        }).not.toThrow();

        return promise;
      });
    });

    test('marking non-promise as cancellable doesn\'t throw', () => {
      expect(() => {
        const cancellation = new Cancellation();

        cancellation.cancellable(3);
        cancellation.cancel();
      }).not.toThrow();
    });
  });

  describe('CancellationReason', () => {
    test('has the mandatory fields', () => {
      const cancellationReason = new CancellationReason('test');

      expect(cancellationReason.isCancellation).toBe(true);
      expect(cancellationReason.message).toBe('test');
    });
  });
});
