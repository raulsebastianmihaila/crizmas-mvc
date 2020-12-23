import {jest} from '@jest/globals';

import * as observe from '../src/observe.js';

describe('observe', () => {
  describe('observe', () => {
    test('if falsy input is passed or no input, it\'s returned', () => {
      expect.assertions(6);
      expect(observe.observe()).toBe(undefined);
      expect(observe.observe(undefined)).toBe(undefined);
      expect(observe.observe(null)).toBe(null);
      expect(observe.observe(0)).toBe(0);
      expect(observe.observe('')).toBe('');
      expect(observe.observe(false)).toBe(false);
    });

    test('observing ignored value returns the value', () => {
      expect.assertions(3);

      const obj = observe.ignore({});
      const func = observe.ignore(() => {});
      const promise = observe.ignore(Promise.resolve());

      expect(observe.observe(obj)).toBe(obj);
      expect(observe.observe(func)).toBe(func);
      expect(observe.observe(promise)).toBe(promise);

      return promise;
    });

    describe('with promises', () => {
      test('observe promise', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        let resolve;
        const promise = new Promise((r) => { resolve = r; });
        // the promise is observed before it's resolved
        const finalPromise = observe.observe(promise).then(() => {
          // the promise is observed after it's resolved
          return observe.observe(Promise.resolve()).then(() => {
            // 2 settled observed promises
            expect(observation.mock.calls.length).toBe(2);
            observe.off(observation);
          });
        });
        resolve();
        expect(observation.mock.calls.length).toBe(0);

        return finalPromise;
      });

      test('observe rejected promise', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const promise = observe.observe(new Promise((resolve, reject) => reject())).catch(() => {
          expect(observation.mock.calls.length).toBe(1);
          observe.off(observation);
        });

        expect(observation.mock.calls.length).toBe(0);

        return promise;
      });

      test('promise\'s methods are not observed', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const promise = Promise.resolve();

        promise.method = () => {};

        const wrapperPromise = observe.observe(promise);

        return wrapperPromise.then(() => {
          expect(wrapperPromise.method).toBe(undefined);
          promise.method();
          // 1 settled observed promise
          expect(observation.mock.calls.length).toBe(1);
          observe.off(observation);
        });
      });

      test('observed promise reports the same fulfilment value', () => {
        expect.assertions(1);

        const val = {};

        return observe.observe(Promise.resolve(val)).then((fulfilment) => {
          expect(fulfilment).toBe(val);
        });
      });

      test('observed promise reports the same rejection reason', () => {
        expect.assertions(1);

        const val = {};

        return observe.observe(Promise.reject(val)).catch((reason) => {
          expect(reason).toBe(val);
        });
      });

      test('observed promise is ignored', () => {
        expect.assertions(3);

        const observation = jest.fn();

        observe.on(observation);

        const promise = Promise.resolve();

        expect(observe.observe(promise) === promise).toBe(false);
        expect(observe.observe(promise) === promise).toBe(true);

        return promise.then(() => {
          // 1 settled observed promise
          expect(observation.mock.calls.length).toBe(1);
          observe.off(observation);
        });
      });

      test('the result of observing a promise is ignored', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const promise = Promise.resolve();
        const wrapperPromise = observe.observe(promise);

        expect(observe.observe(wrapperPromise) === wrapperPromise).toBe(true);

        return wrapperPromise.then(() => {
          // 1 settled observed promise
          expect(observation.mock.calls.length).toBe(1);
          observe.off(observation);
        });
      });

      test('observe thenable', () => {
        expect.assertions(6);

        const observation = jest.fn();

        observe.on(observation);

        let x = 0;
        const thenable = {then(r) { r(++x); }};
        // the thenable is observed before it's resolved
        const wrapperPromise = observe.observe(thenable);

        expect(wrapperPromise === thenable).toBe(false);

        return wrapperPromise.then((value) => {
          expect(value).toBe(1);
          expect(observe.observe(thenable) === thenable).toBe(true);
          // the thenable is observed after it's resolved
          const thenable2 = {then(r) { r(++x); }};

          return Promise.resolve(thenable2).then((value) => {
            expect(value).toBe(2);

            return observe.observe(thenable2).then((value) => {
              expect(value).toBe(3);
              // 2 settled observed thenables
              expect(observation.mock.calls.length).toBe(2);
              observe.off(observation);
            });
          });
        });
      });
    });

    describe('with functions', () => {
      test('observe function', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);
        observe.observe(() => {})();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('observed function is a transparent proxy', () => {
        expect.assertions(3);

        const func = () => {};
        const proxy = observe.observe(func);

        func.x = 1;
        proxy.y = 2;

        expect(func === proxy).toBe(false);
        expect(proxy.x).toBe(1);
        expect(func.y).toBe(2);
      });

      test('observed function target is called', () => {
        expect.assertions(2);

        const observation = jest.fn();
        const result = {};
        const func = () => {
          observation();

          return result;
        };
        const proxy = observe.observe(func);

        expect(proxy() === result).toBe(true);
        // observation is called directly
        expect(observation.mock.calls.length).toBe(1);
      });

      test('observed function target is constructed', () => {
        expect.assertions(2);

        const observation = jest.fn();
        const result = {};
        const func = function () {
          observation();

          return result;
        };
        const Proxy = observe.observe(func);

        expect(new Proxy() === result).toBe(true);
        // observation is called directly
        expect(observation.mock.calls.length).toBe(1);
      });

      test('observe function\'s resulted promise', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const func = observe.observe(() => Promise.resolve());

        return func().then(() => {
          // 1 observed function call and 1 settled observed promise
          expect(observation.mock.calls.length).toBe(2);
          observe.off(observation);
        });
      });

      test('observed function call causes rerendering even if it returns an ignored'
        + ' promise', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const promise = observe.observe(() => observe.ignore(Promise.resolve()))();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);

        return promise;
      });

      test('settling ignored promise returned from observed function call doesn\'t cause'
        + ' rerendering', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const promise = observe.observe(() => observe.ignore(Promise.resolve()))();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);

        return promise;
      });

      test('observed function is reused for the same input function', () => {
        expect.assertions(1);

        const func = () => {};

        expect(observe.observe(func) === observe.observe(func)).toBe(true);
      });

      test('observed function is not reobserved, i.e. no new function is created', () => {
        expect.assertions(1);

        const func = () => {};

        expect(observe.observe(observe.observe(func)) === observe.observe(func)).toBe(true);
      });

      test('returned observed promise from different observed functions is observed'
        + ' only once', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const promise = Promise.resolve();
        const func1 = observe.observe(() => promise);
        const func2 = observe.observe(() => promise);

        func1();

        return func2().then(() => {
          // 1 settled observed promise and 2 observed function calls
          expect(observation.mock.calls.length).toBe(3);
          observe.off(observation);
        });
      });

      test('returned thenable from observed method is always converted to a promise', () => {
        expect.assertions(3);

        const thenable = {then(r) { r(); }};
        const observedObject = observe.observe({
          asyncOperation: () => thenable
        });
        expect(observedObject.asyncOperation() === thenable).toBe(false);
        expect(observedObject.asyncOperation() === thenable).toBe(false);

        const finalPromise = observedObject.asyncOperation().then(() => {});

        expect(typeof finalPromise.then).toBe('function');

        return finalPromise;
      });

      test('observe constructor call', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const Constructor = observe.observe(class {});

        new Constructor();
        // 1 observed construction
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('observe object resulted from constructor call', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const Constructor = observe.observe(class {
          func() {}
        });

        new Constructor().func();
        // 1 observed construction and 1 observed function call
        expect(observation.mock.calls.length).toBe(2);
        observe.off(observation);
      });

      test('observe promise resulted from constructor call', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const Constructor = observe.observe(class {
          constructor() {
            return Promise.resolve(3);
          }
        });

        return new Constructor().then((value) => {
          expect(value).toBe(3);
          // 1 settled observed promise and 1 observed construction
          expect(observation.mock.calls.length).toBe(2);
          observe.off(observation);
        });
      });

      test('observe object after fulfilling the returned promise from constructor call', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const Constructor = observe.observe(class {
          constructor() {
            this.func = () => {};

            return Promise.resolve(this);
          }
        });

        return new Constructor().then((obj) => {
          obj.func();
          // 1 settled observed promise, 1 observed construction and 1 observed function call
          expect(observation.mock.calls.length).toBe(3);
          observe.off(observation);
        });
      });

      test('observe function after fulfilling the returned promise from constructor call', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const Constructor = observe.observe(class {
          constructor() {
            return Promise.resolve(() => {});
          }
        });

        return new Constructor().then((func) => {
          func();
          // 1 settled observed promise, 1 observed construction and 1 observed function call
          expect(observation.mock.calls.length).toBe(3);
          observe.off(observation);
        });
      });

      test('already observed object produced by constructor is reobserved', () => {
        expect.assertions(4);

        const observation = jest.fn();

        observe.on(observation);

        const obj = observe.observe({});

        obj.method = () => {};

        obj.method();
        expect(observation.mock.calls.length).toBe(0);

        let Constructor = observe.observe(class {
          constructor() { return obj; }
        });

        new Constructor().method();
        // 1 observed construction and 1 observed function call
        expect(observation.mock.calls.length).toBe(2);

        obj.method2 = () => {};

        obj.method2();
        // 1 observed construction and 1 observed function call
        expect(observation.mock.calls.length).toBe(2);

        Constructor = observe.observe(class {
          constructor() {
            return Promise.resolve(obj);
          }
        });

        return new Constructor().then((obj) => {
          obj.method2();
          // 1 settled observed promise, 2 observed constructions and 2 observed function calls
          expect(observation.mock.calls.length).toBe(5);
          observe.off(observation);
        });
      });

      test('observed function\'s prototype object property is observed', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const func = function () {};

        func.prototype.method = () => {};

        const observedObj = new (observe.observe(class {
          method() {}
        }));

        observe.observe(func);
        func.prototype.method();
        observedObj.method();
        // 1 observed construction and 2 observed function calls
        expect(observation.mock.calls.length).toBe(3);
        observe.off(observation);
      });

      test('observed function\'s prototype function is observed', () => {
        // the function is observed as an object as well and therefore the
        // prototype is a method
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const func = function () {};

        func.prototype = () => {};

        observe.observe(func);
        func.prototype();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('observed function\'s prototype thenable property is not observed', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const func = function () {};

        func.prototype = Promise.resolve();
        func.prototype.func = () => {};

        observe.observe(func);
        func.prototype.func();

        return func.prototype.then(() => {
          expect(observation.mock.calls.length).toBe(0);
          observe.off(observation);
        });
      });

      test('observed function that doesn\'t have an associated key is not pending in'
        + ' relation to an observed object', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const obj = observe.root({});
        const func = observe.observe(() => Promise.resolve());
        const promise = func.call(obj);

        expect(obj.isPending).toBe(false);

        return promise.then(() => {
          // 1 settled observed promise and 1 observed function call
          expect(observation.mock.calls.length).toBe(2);
          observe.off(observation);
        });
      });

      test('if an observed function is called and it calls other observed functions,'
        + ' only one rendering occurs', () => {
          expect.assertions(1);

          const observation = jest.fn();

          observe.on(observation);

          const func1 = observe.observe(() => {
            func2();
          });
          const func2 = observe.observe(() => {});

          func1();
          // 1 observed function call
          expect(observation.mock.calls.length).toBe(1);
          observe.off(observation);
      });

      test('if the preventApply option is used, the observed function throws when applied', () => {
        expect.assertions(2);

        const func = observe.observe(() => {}, {preventApply: true});

        expect(func).toThrowError('The observed constructor must be invoked with \'new\'.');
        expect(func).toThrowError(Error);
      });

      test('if the preventApply option is used but the function was already observed'
        + ' without the preventApply option, it can still be applied', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);
        observe.observe(
          observe.observe(() => {
            observation();
          }),
          {preventApply: true})();

        // 1 observation direct call and 1 observed function call
        expect(observation.mock.calls.length).toBe(2);
        observe.off(observation);
      });

      test('when the preventApply option is used, the observed function is constructible', () => {
        expect.assertions(1);

        const Func = observe.observe(function () {}, {preventApply: true});
        const observation = jest.fn();

        observe.on(observation);
        new Func();
        // 1 observed construction
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('function returned from observed constructor is observed', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const Func = observe.observe(function () {
          return function () {};
        });
        const newFunc = new Func();
        // 1 observed construction
        expect(observation.mock.calls.length).toBe(1);
        newFunc();
        // 1 observed construction and 1 observed function call
        expect(observation.mock.calls.length).toBe(2);
        observe.off(observation);
      });

      test('function returned from observed constructor can be an observed constructor', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const Func = observe.observe(function () {
          return function () {};
        });
        const NewFunc = new Func();
        // 1 observed construction
        expect(observation.mock.calls.length).toBe(1);
        new NewFunc();
        // 1 observed construction and 1 observed function call
        expect(observation.mock.calls.length).toBe(2);
        observe.off(observation);
      });

      test('function can be applied even if it was returned from observed constructor'
        + ' that can not be applied', () => {
        expect.assertions(3);

        const observation = jest.fn();

        observe.on(observation);

        const Func = observe.observe(function () {
          return function () {};
        }, {preventApply: true});
        const newFunc = new Func();
        // 1 observed construction
        expect(observation.mock.calls.length).toBe(1);
        newFunc();
        // 1 observed construction and 1 observed function call
        expect(observation.mock.calls.length).toBe(2);
        expect(Func).toThrowError('The observed constructor must be invoked with \'new\'.');
        observe.off(observation);
      });

      test('observed function rethrows error from target function', () => {
        expect.assertions(2);

        const func = observe.observe(() => {
          throw new Error('custom error');
        });

        expect(func).toThrowError('custom error');
        expect(func).toThrowError(Error);
      });

      test('observed constructor function rethrows error from target constructor function', () => {
        expect.assertions(2);

        const Func = observe.observe(function () {
          throw new Error('custom error');
        });

        expect(() => {
          new Func();
        }).toThrowError('custom error');
        expect(() => {
          new Func();
        }).toThrowError(Error);
      });

      test('if an observed function throws it doesn\'t cause rendering', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const func = observe.observe(() => { throw new Error(); });

        expect(func).toThrow();
        expect(observation.mock.calls.length).toBe(0);
        observe.off(observation);
      });

      test('after throwing from observe function, rerendering is possible', () => {
        expect.assertions(3);

        const observation = jest.fn();

        observe.on(observation);

        const func = observe.observe(() => { throw new Error(); });
        const func2 = observe.observe(() => {});

        expect(func).toThrow();
        expect(observation.mock.calls.length).toBe(0);
        func2();
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('observed function\'s static methods are observed', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const func = function () {};

        func.method = () => {};

        observe.observe(func);
        func.method();
        expect(observe.observe(func).method === func.method).toBe(true);
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('reobserving function observes new methods on itself', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const func = observe.observe(function () {});

        func.method = () => {};

        func.method();
        expect(observation.mock.calls.length).toBe(0);
        observe.observe(func);
        func.method();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('reobserving function observes new methods on its prototype object property', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const func = observe.observe(function () {});

        func.prototype.method = () => {};

        func.prototype.method();
        expect(observation.mock.calls.length).toBe(0);
        observe.observe(func);
        func.prototype.method();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });
    });

    describe('with objects', () => {
      test('observed object\'s methods are observed', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);
        observe.observe({method() {}}).method();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('observed object\'s methods returned from getters are not observed', () => {
        expect.assertions(1);

        const observation = jest.fn();
        const method = () => {};

        observe.on(observation);
        observe.observe({get method() { return method; }}).method();
        expect(observation.mock.calls.length).toBe(0);
        observe.off(observation);
      });

      test('observed object\'s methods can be constructors', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);
        new (observe.observe({method: function () {}}).method);
        // 1 observed construction
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('observed object is the same value as the input', () => {
        expect.assertions(1);

        const obj = {};

        expect(observe.observe(obj) === obj).toBe(true);
      });

      test('observed object\'s prototype is not observed', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const obj = {};
        const proto = Object.setPrototypeOf(obj, {
          method() {}
        });

        observe.observe(obj);
        proto.method();
        expect(observation.mock.calls.length).toBe(0);
        observe.off(observation);
      });

      test('observed object\'s descendant objects are not observed', () => {
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const obj = observe.observe({
          child: {
            method: () => {}
          }
        });

        obj.child.method();
        expect(observation.mock.calls.length).toBe(0);
        observe.off(observation);
      });

      test('observed object has a \'pending\' object property with a \'has\' method'
        + ' which is non-enumerable, non-writable and configurable', () => {
        expect.assertions(4);

        const desc = Reflect.getOwnPropertyDescriptor(observe.observe({}), 'pending');

        expect(typeof desc.value.has).toBe('function');
        expect(desc.enumerable).toBe(false);
        expect(desc.writable).toBe(false);
        expect(desc.configurable).toBe(true);
      });

      test('observed object has an \'isPending\' property which is non-enumerable,'
        + ' writable and configurable', () => {
        expect.assertions(3);

        const desc = Reflect.getOwnPropertyDescriptor(observe.observe({}), 'isPending');

        expect(desc.enumerable).toBe(false);
        expect(desc.writable).toBe(true);
        expect(desc.configurable).toBe(true);
      });

      test('observing an object that already has a pending property throws', () => {
        expect.assertions(2);

        expect(() => { observe.observe({pending: true}); })
          .toThrowError('Observed object or function must not have an \'isPending\''
            + ' or \'pending\' property.');
        expect(() => { observe.observe({pending: true}); }).toThrowError(Error);
      });

      test('observing an object that already has an isPending property throws', () => {
        expect.assertions(2);

        expect(() => { observe.observe({isPending: true}); })
          .toThrowError('Observed object or function must not have an \'isPending\''
            + ' or \'pending\' property.');
        expect(() => { observe.observe({isPending: true}); }).toThrowError(Error);
      });

      test('not being able to create the isPending or pending properties throws', () => {
        expect.assertions(4);
        expect(() => {
          observe.observe(new Proxy({}, {
            defineProperty(target, prop, desc) {
              if (prop === 'pending' || prop === 'isPending') {
                return false;
              }

              return Reflect.defineProperty(target, prop, desc);
            }
          }));
        }).toThrowError('Cannot define property');
        expect(() => {
          observe.observe(new Proxy({}, {
            defineProperty(target, prop, desc) {
              if (prop === 'pending' || prop === 'isPending') {
                return false;
              }

              return Reflect.defineProperty(target, prop, desc);
            }
          }));
        }).toThrowError(Error);
        expect(() => {
          observe.observe(new Proxy(() => {}, {
            defineProperty(target, prop, desc) {
              if (prop === 'pending' || prop === 'isPending') {
                return false;
              }

              return Reflect.defineProperty(target, prop, desc);
            }
          }));
        }).toThrowError('Cannot define property');
        expect(() => {
          observe.observe(new Proxy(() => {}, {
            defineProperty(target, prop, desc) {
              if (prop === 'pending' || prop === 'isPending') {
                return false;
              }

              return Reflect.defineProperty(target, prop, desc);
            }
          }));
        }).toThrowError(Error);
      });

      test('non-writable and non-configurable method is not observed', () => {
        expect.assertions(4);

        const observation = jest.fn();

        observe.on(observation);

        const method = function () {};
        const method2 = function () {};
        const obj = {
          method2
        };

        Reflect.defineProperty(obj, 'method', {
          value: method,
          writable: false,
          configurable: false
        });

        observe.observe(obj);

        obj.method();
        expect(observation.mock.calls.length).toBe(0);
        obj.method2();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        expect(obj.method).toBe(method);
        expect(obj.method2 === method2).toBe(false);
        observe.off(observation);
      });

      test('observed object under a root is pending while it has associated pending'
        + ' operations', () => {
        expect.assertions(3);

        const root = observe.root({
          obj: observe.observe({
            startAsyncOperation: () => Promise.resolve()
          })
        });

        expect(root.obj.isPending).toBe(false);

        const promise = root.obj.startAsyncOperation().then(() => {
          expect(root.obj.isPending).toBe(false);
        });

        expect(root.obj.isPending).toBe(true);

        return promise;
      });

      test('observed object not under a root is not pending while it has associated pending'
        + ' operations', () => {
        expect.assertions(3);

        const root = observe.observe({
          obj: observe.observe({
            startAsyncOperation: () => Promise.resolve()
          })
        });

        expect(root.obj.isPending).toBe(false);

        const promise = root.obj.startAsyncOperation().then(() => {
          expect(root.obj.isPending).toBe(false);
        });

        expect(root.obj.isPending).toBe(false);

        return promise;
      });

      test('observed function under a root is not pending while it has associated pending'
        + ' operations', () => {
        expect.assertions(3);

        const func = () => {};

        func.startAsyncOperation = () => Promise.resolve();

        const observedFunc = observe.observe(func);

        observe.root({observedFunc});
        expect(observedFunc.isPending).toBe(false);

        const finalPromise = observedFunc.startAsyncOperation().then(() => {
          expect(observedFunc.isPending).toBe(false);
        });

        expect(observedFunc.isPending).toBe(false);

        return finalPromise;
      });

      test('observed object\'s pending object reports the pending operation associated'
        + ' with it when the object is not under a root', () => {
        expect.assertions(6);

        const Constructor = observe.observe(class {
          constructor() {
            this.startAsyncOperation = () => Promise.resolve();
          }

          startInheritedAsyncOperation() { return Promise.resolve(); }
        });

        const obj = new Constructor();

        expect(obj.pending.has('startAsyncOperation')).toBe(false);

        const finalPromise = obj.startAsyncOperation().then(() => {
          expect(obj.pending.has('startAsyncOperation')).toBe(false);
          expect(obj.pending.has('startInheritedAsyncOperation')).toBe(false);

          const promise = obj.startInheritedAsyncOperation().then(() => {
            expect(obj.pending.has('startInheritedAsyncOperation')).toBe(false);
          });

          expect(obj.pending.has('startInheritedAsyncOperation')).toBe(true);

          return promise;
        });

        expect(obj.pending.has('startAsyncOperation')).toBe(true);

        return finalPromise;
      });

      test('observed object\'s pending object reports the pending operation associated'
        + ' with it even if the operation function is not its method', () => {
        expect.assertions(4);

        const obj = observe.observe({});
        const func = observe.observe(() => Promise.resolve(), {key: 'some-func'});

        expect(obj.pending.has('some-func')).toBe(false);

        const promise = func.call(obj).then(() => {
          expect(obj.pending.has('some-func')).toBe(false);
        });

        expect(obj.pending.has('some-func')).toBe(true);
        expect(obj.pending.has('func')).toBe(false);

        return promise;
      });

      test('observed object can have two different pending operations with the same key'
        + ' associated with it', () => {
        expect.assertions(4);

        const obj = observe.observe({
          startAsyncOperation: () => Promise.resolve()
        });
        const secondAsyncOperation = observe.observe(() => {
          return Promise.resolve().then(() => Promise.resolve()).then(() => Promise.resolve());
        }, {key: 'startAsyncOperation'});

        expect(obj.pending.has('startAsyncOperation')).toBe(false);

        obj.startAsyncOperation().then(() => {
          expect(obj.pending.has('startAsyncOperation')).toBe(true);
        });

        expect(obj.pending.has('startAsyncOperation')).toBe(true);

        return secondAsyncOperation.call(obj).then(() => {
          expect(obj.pending.has('startAsyncOperation')).toBe(false);
        });
      });

      test('observed object\'s pending object reports the pending operation associated'
        + ' with it when the object is under a root', () => {
        expect.assertions(6);

        const Constructor = observe.observe(class {
          constructor() {
            this.startAsyncOperation = () => Promise.resolve();
          }

          startInheritedAsyncOperation() { return Promise.resolve(); }
        });

        const obj = new Constructor();

        observe.root({obj});
        expect(obj.pending.has('startAsyncOperation')).toBe(false);

        const finalPromise = obj.startAsyncOperation().then(() => {
          expect(obj.pending.has('startAsyncOperation')).toBe(false);
          expect(obj.pending.has('startInheritedAsyncOperation')).toBe(false);

          const promise = obj.startInheritedAsyncOperation().then(() => {
            expect(obj.pending.has('startInheritedAsyncOperation')).toBe(false);
          });

          expect(obj.pending.has('startInheritedAsyncOperation')).toBe(true);

          return promise;
        });

        expect(obj.pending.has('startAsyncOperation')).toBe(true);

        return finalPromise;
      });

      test('observed function\' pending object reports the pending operation associated'
        + ' with it', () => {
        expect.assertions(3);

        const func = () => {};

        func.startAsyncOperation = () => Promise.resolve();

        const observedFunc = observe.observe(func);

        expect(observedFunc.pending.has('startAsyncOperation')).toBe(false);

        const finalPromise = observedFunc.startAsyncOperation().then(() => {
          expect(observedFunc.pending.has('startAsyncOperation')).toBe(false);
        });

        expect(observedFunc.pending.has('startAsyncOperation')).toBe(true);

        return finalPromise;
      });

      test('observed object that is the value of an object (obj) property becomes a child'
        + ' observed object of obj when obj is observed', () => {
        expect.assertions(3);

        const obj = observe.observe({
          child: observe.observe({
            startAsyncOperation: () => Promise.resolve()
          })
        });

        observe.root({obj});
        expect(obj.isPending).toBe(false);

        const finalPromise = obj.child.startAsyncOperation().then(() => {
          expect(obj.isPending).toBe(false);
        });

        expect(obj.isPending).toBe(true);

        return finalPromise;
      });

      test('observed promise that is the value of an object (obj) property doesn\'t become'
        + ' a child observed object of obj when obj is observed', () => {
        expect.assertions(6);

        const observation = jest.fn();

        observe.on(observation);

        const promise = observe.observe(Promise.resolve());

        // the method needs to be observed separately because observing a promise
        // doesn't observe its methods
        promise.startAsyncOperation = observe.observe(() => Promise.resolve());

        const obj = observe.observe({
          child: promise
        });

        observe.root({obj});
        expect(obj.isPending).toBe(false);

        const finalPromise = obj.child.startAsyncOperation().then(() => {
          expect(obj.isPending).toBe(false);
          // 2 settled observed promises and 1 observed function call
          expect(observation.mock.calls.length).toBe(3);
          observe.off(observation);
        });

        expect(obj.isPending).toBe(false);
        expect(promise.isPending).toBe(undefined);
        expect(promise.pending).toBe(undefined);

        return finalPromise;
      });

      test('observed function that is the value of an object (obj) property doesn\'t'
        + ' become a child observed object of obj when obj is observed', () => {
        expect.assertions(6);

        const func = () => {};

        func.startAsyncOperation = () => Promise.resolve();

        const obj = observe.observe({child: func});

        observe.root({obj});
        expect(obj.isPending).toBe(false);
        expect(obj.child.pending.has('startAsyncOperation')).toBe(false);

        const finalPromise = obj.child.startAsyncOperation().then(() => {
          expect(obj.isPending).toBe(false);
          expect(obj.child.pending.has('startAsyncOperation')).toBe(false);
        });

        expect(obj.isPending).toBe(false);
        expect(obj.child.pending.has('startAsyncOperation')).toBe(true);

        return finalPromise;
      });

      test('object that is a getter value is not considered when searching observed'
        + ' children', () => {
        expect.assertions(9);

        const child = observe.observe({
          startAsyncOperation: () => Promise.resolve()
        });
        const root = observe.root({
          get child() {
            return child;
          }
        });

        expect(root.isPending).toBe(false);
        expect(root.child.isPending).toBe(false);
        expect(root.child.pending.has('startAsyncOperation')).toBe(false);

        const promise = root.child.startAsyncOperation().then(() => {
          expect(root.isPending).toBe(false);
          expect(root.child.isPending).toBe(false);
          expect(root.child.pending.has('startAsyncOperation')).toBe(false);
        });

        expect(root.isPending).toBe(false);
        expect(root.child.isPending).toBe(false);
        expect(root.child.pending.has('startAsyncOperation')).toBe(true);

        return promise;
      });

      test('observed object under a root becomes pending if child observed object already has'
        + ' pending operations associated with it when the object is observed', () => {
        expect.assertions(12);

        const child = observe.observe({startAsyncOperation: () => Promise.resolve()});

        expect(child.isPending).toBe(false);
        expect(child.pending.has('startAsyncOperation')).toBe(false);

        const promise = child.startAsyncOperation().then(() => {
          expect(root.obj.isPending).toBe(false);
          expect(root.isPending).toBe(false);
          expect(child.isPending).toBe(false);
          expect(child.pending.has('startAsyncOperation')).toBe(false);
        });

        expect(child.isPending).toBe(false);
        expect(child.pending.has('startAsyncOperation')).toBe(true);

        const root = observe.root({obj: observe.observe({child})});

        expect(root.obj.isPending).toBe(true);
        expect(root.isPending).toBe(true);
        expect(child.isPending).toBe(true);
        expect(child.pending.has('startAsyncOperation')).toBe(true);

        return promise;
      });

      test('observed object under a root is pending while child observed objects are'
        + ' pending', () => {
        expect.assertions(6);

        const root = observe.root({
          child: observe.observe({
            grandChild: observe.observe({
              startAsyncOperation: () => Promise.resolve()
            })
          })
        });

        expect(root.child.isPending).toBe(false);
        expect(root.child.grandChild.isPending).toBe(false);

        const promise = root.child.grandChild.startAsyncOperation().then(() => {
          expect(root.child.isPending).toBe(false);
          expect(root.child.grandChild.isPending).toBe(false);
        });

        expect(root.child.isPending).toBe(true);
        expect(root.child.grandChild.isPending).toBe(true);

        return promise;
      });

      test('observed child object under an observed parent object is still a child'
        + ' observed object of that parent object even if it\'s not a value of a property'
        + ' of that object', () => {
        expect.assertions(8);

        const root = observe.root({
          child: observe.observe({
            grandChild: observe.observe({
              startAsyncOperation: () => Promise.resolve()
            })
          })
        });

        const grandChild = root.child.grandChild;

        expect(root.child.hasOwnProperty('grandChild')).toBe(true);

        delete root.child.grandChild;

        expect(root.child.hasOwnProperty('grandChild')).toBe(false);

        expect(root.child.isPending).toBe(false);
        expect(grandChild.isPending).toBe(false);

        const promise = grandChild.startAsyncOperation().then(() => {
          expect(root.child.isPending).toBe(false);
          expect(grandChild.isPending).toBe(false);
        });

        expect(root.child.isPending).toBe(true);
        expect(grandChild.isPending).toBe(true);

        return promise;
      });

      test('observed object under an object that is the value of a property'
        + ' becomes observed child', () => {
        expect.assertions(9);

        const root = observe.root({
          child: {
            grandChild: observe.observe({
              startAsyncOperation: () => Promise.resolve()
            })
          }
        });

        expect(root.child.grandChild.isPending).toBe(false);
        expect(root.child.isPending).toBe(undefined);
        expect(root.isPending).toBe(false);

        const promise = root.child.grandChild.startAsyncOperation().then(() => {
          expect(root.child.grandChild.isPending).toBe(false);
          expect(root.child.isPending).toBe(undefined);
          expect(root.isPending).toBe(false);
        });

        expect(root.child.grandChild.isPending).toBe(true);
        expect(root.child.isPending).toBe(undefined);
        expect(root.isPending).toBe(true);

        return promise;
      });

      test('observed object under an ignored object that is the value of a property'
        + ' becomes observed child', () => {
        expect.assertions(9);

        const root = observe.root({
          child: observe.ignore({
            grandChild: observe.observe({
              startAsyncOperation: () => Promise.resolve()
            })
          })
        });

        expect(root.child.grandChild.isPending).toBe(false);
        expect(root.child.isPending).toBe(undefined);
        expect(root.isPending).toBe(false);

        const promise = root.child.grandChild.startAsyncOperation().then(() => {
          expect(root.child.grandChild.isPending).toBe(false);
          expect(root.child.isPending).toBe(undefined);
          expect(root.isPending).toBe(false);
        });

        expect(root.child.grandChild.isPending).toBe(true);
        expect(root.child.isPending).toBe(undefined);
        expect(root.isPending).toBe(true);

        return promise;
      });

      test('observed child can be the value of two different keys of observed object', () => {
        expect.assertions(6);

        const child = observe.observe({startAsyncOperation: () => Promise.resolve()});
        const root = observe.root({child, child2: child});

        expect(child.isPending).toBe(false);
        expect(root.isPending).toBe(false);

        const promise = child.startAsyncOperation().then(() => {
          expect(child.isPending).toBe(false);
          expect(root.isPending).toBe(false);
        });

        expect(child.isPending).toBe(true);
        expect(root.isPending).toBe(true);

        return promise;
      });

      test('observed object that is not part of a managed tree is not pending while'
        + ' any of its children observed objects is pending while part of a managed tree', () => {
        expect.assertions(6);

        const child = observe.observe({
          startAsyncOperation: () => Promise.resolve()
        });

        observe.root({child});

        const obj = observe.observe({child});

        expect(obj.isPending).toBe(false);
        expect(child.isPending).toBe(false);

        const promise = child.startAsyncOperation().then(() => {
          expect(obj.isPending).toBe(false);
          expect(child.isPending).toBe(false);
        });

        expect(obj.isPending).toBe(false);
        expect(child.isPending).toBe(true);

        return promise;
      });

      test('reobserving object doesn\'t make new observed objects under it observed'
        + ' children', () => {
        expect.assertions(8);

        const child = observe.observe({startAsyncOperation: () => Promise.resolve()});
        const observedObject = observe.root({});

        observedObject.child = child;

        observe.observe(observedObject);

        expect(child.isPending).toBe(false);
        expect(observedObject.isPending).toBe(false);

        const promise = child.startAsyncOperation().then(() => {
          expect(child.pending.has('startAsyncOperation')).toBe(false);
          expect(child.isPending).toBe(false);
          expect(observedObject.isPending).toBe(false);
        });

        expect(child.pending.has('startAsyncOperation')).toBe(true);
        expect(child.isPending).toBe(false);
        expect(observedObject.isPending).toBe(false);

        return promise;
      });

      test('if observed object (A) under the object (B) is not an observed child, its observed'
        + ' children are also not observed children of the object (B)', () => {
        expect.assertions(10);

        const observedChild = observe.observe({
          observedGrandChild: observe.observe({startAsyncOperation: () => Promise.resolve()})
        });

        const root = observe.root({});

        root.observedChild = observedChild;

        expect(root.isPending).toBe(false);
        expect(observedChild.isPending).toBe(false);
        expect(observedChild.observedGrandChild.isPending).toBe(false);

        const promise = observedChild.observedGrandChild.startAsyncOperation().then(() => {
          expect(root.isPending).toBe(false);
          expect(observedChild.isPending).toBe(false);
          expect(observedChild.observedGrandChild.isPending).toBe(false);
        });

        expect(observedChild.observedGrandChild.pending.has('startAsyncOperation')).toBe(true);
        expect(root.isPending).toBe(false);
        expect(observedChild.isPending).toBe(false);
        expect(observedChild.observedGrandChild.isPending).toBe(false);

        return promise;
      });

      test('if observed object (A) under the object (B) is not an observed child, its observed'
        + ' children can be positioned so that they are observed children of the object (B)',
        () => {
          expect.assertions(10);

          const observedChild = observe.observe({
            observedGrandChild: observe.observe({startAsyncOperation: () => Promise.resolve()})
          });

          const root = observe.root({observedGrandChild: observedChild.observedGrandChild});

          root.observedChild = observedChild;

          expect(root.isPending).toBe(false);
          expect(observedChild.isPending).toBe(false);
          expect(observedChild.observedGrandChild.isPending).toBe(false);

          const promise = observedChild.observedGrandChild.startAsyncOperation().then(() => {
            expect(root.isPending).toBe(false);
            expect(observedChild.isPending).toBe(false);
            expect(observedChild.observedGrandChild.isPending).toBe(false);
          });

          expect(observedChild.observedGrandChild.pending.has('startAsyncOperation')).toBe(true);
          expect(root.isPending).toBe(true);
          expect(observedChild.isPending).toBe(false);
          expect(observedChild.observedGrandChild.isPending).toBe(true);

          return promise;
        });

      test('already settled promises returned from methods of observed objects cause the'
        + ' object to be pending', () => {
        expect.assertions(6);

        const promise = Promise.resolve();
        const obj = observe.root({
          startAsyncOperation: () => promise
        });

        expect(obj.isPending).toBe(false);
        expect(obj.pending.has('startAsyncOperation')).toBe(false);

        const finalPromise = obj.startAsyncOperation().then(() => {
          expect(obj.isPending).toBe(false);
          expect(obj.pending.has('startAsyncOperation')).toBe(false);
        });

        expect(obj.isPending).toBe(true);
        expect(obj.pending.has('startAsyncOperation')).toBe(true);

        return finalPromise;
      });

      test('already settled promises returned from methods of observed objects cause'
        + ' rerendering', () => {
        // because they are wrapped in order to observe their settlement and until the then
        // callback is called, the object is pending
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const promise = Promise.resolve();
        const obj = observe.observe({
          startAsyncOperation: () => promise
        });

        return obj.startAsyncOperation().then(() => {
          // 1 settled observed promise and 1 observed function call
          expect(observation.mock.calls.length).toBe(2);
          observe.off(observation);
        });
      });

      test('ignored promises returned from methods of observed objects cause the object'
        + ' to be pending', () => {
        expect.assertions(6);

        const promise = observe.ignore(Promise.resolve());
        const obj = observe.root({
          startAsyncOperation: () => promise
        });

        expect(obj.isPending).toBe(false);
        expect(obj.pending.has('startAsyncOperation')).toBe(false);

        const finalPromise = obj.startAsyncOperation().then(() => {
          expect(obj.isPending).toBe(false);
          expect(obj.pending.has('startAsyncOperation')).toBe(false);
        });

        expect(obj.isPending).toBe(true);
        expect(obj.pending.has('startAsyncOperation')).toBe(true);

        return finalPromise;
      });

      test('ignored promises returned from methods of observed objects cause rerendering', () => {
        // because they are wrapped in order to observe their settlement and until the then
        // callback is called, the object is pending
        expect.assertions(1);

        const observation = jest.fn();

        observe.on(observation);

        const promise = observe.ignore(Promise.resolve());
        const obj = observe.observe({
          startAsyncOperation: () => promise
        });

        return obj.startAsyncOperation().then(() => {
          // 1 settled promise and 1 observed function call
          expect(observation.mock.calls.length).toBe(2);
          observe.off(observation);
        });
      });

      test('reobserving object observes new methods on itself', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const obj = observe.observe({});

        obj.method = () => {};

        obj.method();
        expect(observation.mock.calls.length).toBe(0);
        observe.observe(obj);
        obj.method();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('reobserving object observes new methods on its methods', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const obj = observe.observe({
          method: () => {}
        });

        obj.method.staticMethod = () => {};

        obj.method.staticMethod();
        expect(observation.mock.calls.length).toBe(0);
        observe.observe(obj);
        obj.method.staticMethod();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('reobserving object observes new methods on its methods\' prototype object'
        + ' properties', () => {
        expect.assertions(2);

        const observation = jest.fn();

        observe.on(observation);

        const obj = observe.observe({
          method: function () {}
        });

        obj.method.prototype.prototypeMethod = () => {};

        obj.method.prototype.prototypeMethod();
        expect(observation.mock.calls.length).toBe(0);
        observe.observe(obj);
        obj.method.prototype.prototypeMethod();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      test('the observed wrapper promise is reused for updating the pending state'
        + ' of the object', () => {
        expect.assertions(6);

        const observation = jest.fn();

        observe.on(observation);

        const promise = observe.observe(Promise.resolve());
        const obj = observe.observe({method() { return promise; }});
        const wrapperPromise = obj.method();
        // 1 observed function call
        expect(observation.mock.calls.length).toBe(1);
        expect(wrapperPromise).toBe(promise);
        expect(observe.observe(wrapperPromise) === wrapperPromise).toBe(true);
        expect(obj.method() === wrapperPromise).toBe(true);
        expect(observe.observe(obj.method()) === wrapperPromise).toBe(true);

        return wrapperPromise.then(() => {
          // 1 settled observed promise and 3 observed function calls
          expect(observation.mock.calls.length).toBe(4);
          observe.off(observation);
        });
      });
    });
  });

  describe('root', () => {
    test('rooting a not reliably observable value throws', () => {
      expect.assertions(8);

      expect(() => {
        observe.root(1);
      }).toThrowError('Root must be either a function or a non-promise object and it must'
        + ' not be ignored.');
      expect(() => {
        observe.root(1);
      }).toThrowError(Error);
      expect(() => {
        observe.root(Promise.resolve());
      }).toThrowError('Root must be either a function or a non-promise object and it must'
        + ' not be ignored.');
      expect(() => {
        observe.root(Promise.resolve());
      }).toThrowError(Error);
      expect(() => {
        observe.root({then(r) { r(); }});
      }).toThrowError('Root must be either a function or a non-promise object and it must'
        + ' not be ignored.');
      expect(() => {
        observe.root({then(r) { r(); }});
      }).toThrowError(Error);
      expect(() => {
        observe.root(observe.ignore({}));
      }).toThrowError('Root must be either a function or a non-promise object and it must'
        + ' not be ignored.');
      expect(() => {
        observe.root(observe.ignore({}));
      }).toThrowError(Error);
    });

    test('rooting not observed value, observes the value', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      observe.root({method() {}}).method();
      new (observe.root(function () {}));
      // 1 observed function call and 1 construction
      expect(observation.mock.calls.length).toBe(2);
      observe.off(observation);
    });

    test('root an object', () => {
      expect.assertions(3);

      const root = observe.root({startAsyncOperation: () => Promise.resolve()});

      expect(root.isPending).toBe(false);

      const promise = root.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
      });

      expect(root.isPending).toBe(true);

      return promise;
    });

    test('returning a not reliably observable value from the root constructor throws', () => {
      expect.assertions(2);

      expect(() => {
        new (observe.root(function () { return observe.ignore({}); }));
      }).toThrowError('Root must be either a function or a non-promise object and it must'
        + ' not be ignored.');
      expect(() => {
        new (observe.root(function () { return observe.ignore({}); }));
      }).toThrowError(Error);
    });

    test('fulfilling the promise returned from the root constructor with a not reliably observable'
      + ' value throws', () => {
      expect.assertions(4);

      (new (observe.root(function () {
        return Promise.resolve(observe.ignore({}));
      }))).catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Root must be either a function or a non-promise object and'
          + ' it must not be ignored.');
      });

      return (new (observe.root(function () {
          return {then(r) { r(1); }};
        }))).catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBe('Root must be either a function or a non-promise object and'
            + ' it must not be ignored.');
        });
    });

    test('object resulted from constructing rooted function is a root', () => {
      expect.assertions(3);

      const root = new (observe.root(class {
        startAsyncOperation() { return Promise.resolve(); }
      }));

      expect(root.isPending).toBe(false);

      const promise = root.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
      });

      expect(root.isPending).toBe(true);

      return promise;
    });

    test('function resulted from constructing rooted function is a rooted function', () => {
      expect.assertions(3);

      const root = new (new (observe.root(class {
        constructor() {
          return class {
            startAsyncOperation() { return Promise.resolve(); }
          };
        }
      })));

      expect(root.isPending).toBe(false);

      const promise = root.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
      });

      expect(root.isPending).toBe(true);

      return promise;
    });

    test('function resulted from constructing rooted function can not be applied', () => {
      expect.assertions(1);

      const func = new (observe.root(class {
        constructor() {
          return function () {};
        }
      }));

      expect(func).toThrowError('The observed constructor must be invoked with \'new\'.');
    });

    test('object resulted from fulfilling the promise resulted from constructing rooted'
      + ' function is a root', () => {
      expect.assertions(3);

      return (new (observe.root(class {
        constructor() {
          return Promise.resolve({startAsyncOperation() { return Promise.resolve(); }});
        }
      }))).then((root) => {
        expect(root.isPending).toBe(false);

        const promise = root.startAsyncOperation().then(() => {
          expect(root.isPending).toBe(false);
        });

        expect(root.isPending).toBe(true);

        return promise;
      });
    });

    test('function resulted from fulfilling the promise resulted from constructing rooted'
      + ' function is a rooted function', () => {
      expect.assertions(3);

      return (new (observe.root(class {
        constructor() {
          return Promise.resolve(class {startAsyncOperation() { return Promise.resolve(); }});
        }
      }))).then((RootFunc) => {
        const root = new RootFunc();

        expect(root.isPending).toBe(false);

        const promise = root.startAsyncOperation().then(() => {
          expect(root.isPending).toBe(false);
        });

        expect(root.isPending).toBe(true);

        return promise;
      });
    });

    test('rooted function can not be applied', () => {
      expect.assertions(2);
      expect(observe.root(function () {}))
        .toThrowError('The observed constructor must be invoked with \'new\'.');
      expect(observe.root(function () {})).toThrowError(Error);
    });

    test('rooted already observed appliable function can be applied', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      observe.root(observe.observe(() => {
        observation();
      }))();

      // 1 observation direct call and 1 observed function call
      expect(observation.mock.calls.length).toBe(2);
      observe.off(observation);
    });

    test('rooted object that is a retained unrooted object is not unrooted during the next'
      + ' pending state update', () => {
      expect.assertions(5);

      const root = observe.root({startAsyncOperation: () => Promise.resolve()});

      expect(root.isPending).toBe(false);

      const promise = root.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);

        const promise = root.startAsyncOperation().then(() => {
          expect(root.isPending).toBe(false);
        });

        expect(root.isPending).toBe(true);

        return promise;
      });

      observe.unroot(root);
      expect(root.isPending).toBe(true);
      observe.root(root);

      return promise;
    });

    test('rooted object that has pending operations associated with it becomes pending', () => {
      expect.assertions(4);

      const root = observe.observe({
        startAsyncOperation: () => Promise.resolve()
      });

      expect(root.isPending).toBe(false);

      const promise = root.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
      });

      expect(root.isPending).toBe(false);

      observe.root(root);

      expect(root.isPending).toBe(true);

      return promise;
    });

    test('rooted object that has observed children with pending operations associated with them'
      + ' becomes pending', () => {
      expect.assertions(8);

      const child = observe.observe({
        startAsyncOperation: () => Promise.resolve()
      });
      const obj = observe.observe({child});

      expect(obj.isPending).toBe(false);
      expect(child.isPending).toBe(false);

      const promise = child.startAsyncOperation().then(() => {
        expect(obj.isPending).toBe(false);
        expect(child.isPending).toBe(false);
      });

      expect(obj.isPending).toBe(false);
      expect(child.isPending).toBe(false);

      observe.root(obj);

      expect(obj.isPending).toBe(true);
      expect(child.isPending).toBe(true);

      return promise;
    });

    test('rooted object that has already pending observed children becomes pending', () => {
      expect.assertions(8);

      const child = observe.observe({
        startAsyncOperation: () => Promise.resolve()
      });
      const obj = observe.observe({child});

      observe.root({child});

      expect(obj.isPending).toBe(false);
      expect(child.isPending).toBe(false);

      const promise = child.startAsyncOperation().then(() => {
        expect(obj.isPending).toBe(false);
        expect(child.isPending).toBe(false);
      });

      expect(obj.isPending).toBe(false);
      expect(child.isPending).toBe(true);

      observe.root(obj);

      expect(obj.isPending).toBe(true);
      expect(child.isPending).toBe(true);

      return promise;
    });

    test('observed object that is a child of the rooted object and has pending observed'
      + ' children becomes pending', () => {
      expect.assertions(8);

      const child = observe.observe({
        startAsyncOperation: () => Promise.resolve()
      });
      const obj = observe.observe({child});

      expect(obj.isPending).toBe(false);
      expect(child.isPending).toBe(false);

      const promise = child.startAsyncOperation().then(() => {
        expect(obj.isPending).toBe(false);
        expect(child.isPending).toBe(false);
      });

      expect(obj.isPending).toBe(false);
      expect(child.isPending).toBe(false);

      observe.root({obj});

      expect(obj.isPending).toBe(true);
      expect(child.isPending).toBe(true);

      return promise;
    });

    test('the result equals the already rooted input', () => {
      expect.assertions(2);

      const root = observe.root({});
      const rootFunc = observe.root(() => {});

      expect(observe.root(root)).toBe(root);
      expect(observe.root(rootFunc)).toBe(rootFunc);
    });

    test('rooting doesn\'t reobserve', () => {
      expect.assertions(4);

      const observation = jest.fn();

      observe.on(observation);

      const root = observe.root({
        child: observe.observe({method() {}}),
        func: observe.observe(() => {})
      });
      const reusedConstructedObj = observe.observe({method() {}});
      const RootFunc = observe.root(function () {
        return reusedConstructedObj;
      });
      const RootFuncWithPromise = observe.root(function () {
        return Promise.resolve(reusedConstructedObj);
      });

      let constructedObject = new RootFunc();

      root.child.method();
      root.func();
      constructedObject.method();
      expect(constructedObject).toBe(reusedConstructedObj);
      // 3 observed function calls and 1 construction
      expect(observation.mock.calls.length).toBe(4);

      root.child.method2 = () => {};
      root.func.staticMethod = () => {};
      RootFunc.staticMethod = () => {};
      reusedConstructedObj.method2 = () => {};

      observe.root(root);
      observe.root(RootFunc);

      constructedObject = new RootFunc();

      root.child.method2();
      root.func.staticMethod();
      RootFunc.staticMethod();
      constructedObject.method2();
      // 3 observed function calls and 2 constructions
      expect(observation.mock.calls.length).toBe(5);

      return new RootFuncWithPromise().then((constructedObject) => {
        constructedObject.method2();
        // 3 observed function calls, 3 constructions and 1 settled observed promise
        expect(observation.mock.calls.length).toBe(7);
        observe.off(observation);
      });
    });

    test('a root can be the observed descendant of another root', () => {
      expect.assertions(6);

      const parentRoot = observe.root({
        childRoot: observe.root({
          startAsyncOperation: () => Promise.resolve()
        })
      });

      expect(parentRoot.isPending).toBe(false);
      expect(parentRoot.childRoot.isPending).toBe(false);

      const promise = parentRoot.childRoot.startAsyncOperation().then(() => {
        expect(parentRoot.isPending).toBe(false);
        expect(parentRoot.childRoot.isPending).toBe(false);
      });

      expect(parentRoot.isPending).toBe(true);
      expect(parentRoot.childRoot.isPending).toBe(true);

      return promise;
    });
  });

  describe('unroot', () => {
    test('unrooting non rooted value doesn\'t throw', () => {
      observe.unroot(1);
      observe.unroot(observe.observe({}));
    });

    test('rooted function becomes unrooted', () => {
      expect.assertions(2);

      const RootConstructor = observe.root(function () {
        return {startAsyncOperation: () => Promise.resolve()};
      });

      const obj = new RootConstructor();

      obj.startAsyncOperation();

      expect(obj.isPending).toBe(true);
      observe.unroot(RootConstructor);

      const obj2 = new RootConstructor();
      const finalPromise = obj2.startAsyncOperation();

      expect(obj2.isPending).toBe(false);

      return finalPromise;
    });

    test('unrooted object stops being a root', () => {
      expect.assertions(2);

      const root = observe.root({startAsyncOperation: () => Promise.resolve()});
      const finalPromise = root.startAsyncOperation().then(() => {
        observe.unroot(root);

        const promise = root.startAsyncOperation();

        expect(root.isPending).toBe(false);

        return promise;
      });

      expect(root.isPending).toBe(true);

      return finalPromise;
    });

    test('unrooted object\'s child that had only one root stops being managed', () => {
      expect.assertions(2);

      const root = observe.root({
        child: observe.observe({startAsyncOperation: () => Promise.resolve()})
      });
      const finalPromise = root.child.startAsyncOperation().then(() => {
        observe.unroot(root);

        const promise = root.child.startAsyncOperation();

        expect(root.child.isPending).toBe(false);

        return promise;
      });

      expect(root.child.isPending).toBe(true);

      return finalPromise;
    });

    test('unrooted object\'s child that had more roots continues to be managed', () => {
      expect.assertions(2);

      const child = observe.observe({startAsyncOperation: () => Promise.resolve()});
      const root = observe.root({child});

      observe.root({child});

      const finalPromise = root.child.startAsyncOperation().then(() => {
        observe.unroot(root);

        const promise = root.child.startAsyncOperation();

        expect(root.child.isPending).toBe(true);

        return promise;
      });

      expect(root.child.isPending).toBe(true);

      return finalPromise;
    });

    test('unrooted object continues to be observed', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);

      const root = observe.root({method() {}});

      root.method();
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);

      observe.unroot(root);

      root.method();
      // 2 observed function calls
      expect(observation.mock.calls.length).toBe(2);
      observe.off(observation);
    });

    test('unrooted function continues to be observed', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);

      const Root = observe.root(function () {});

      new Root();
      // 1 observed construction
      expect(observation.mock.calls.length).toBe(1);

      observe.unroot(Root);

      new Root();
      // 2 observed constructions
      expect(observation.mock.calls.length).toBe(2);
      observe.off(observation);
    });

    test('unrooted pending object is retained', () => {
      expect.assertions(4);

      const root = observe.root({startAsyncOperation: () => Promise.resolve()});

      expect(root.isPending).toBe(false);

      const promise = root.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);

        const promise = root.startAsyncOperation();

        expect(root.isPending).toBe(false);

        return promise;
      });

      observe.unroot(root);
      expect(root.isPending).toBe(true);

      return promise;
    });

    test('unrooted pending object with child is retained', () => {
      expect.assertions(12);

      const root = observe.root({
        child: observe.observe({startAsyncOperation: () => Promise.resolve()}),
        // needs a small delay so that when the child startAsyncPromise callback is called
        // the root is still pending
        startAsyncOperation: () => Promise.resolve().then(() => Promise.resolve())
      });

      expect(root.isPending).toBe(false);
      expect(root.child.isPending).toBe(false);

      root.child.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(true);
        expect(root.child.isPending).toBe(false);
      });

      observe.unroot(root);
      expect(root.isPending).toBe(true);
      expect(root.child.isPending).toBe(true);

      const promise = root.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
        expect(root.child.isPending).toBe(false);

        const promise = root.child.startAsyncOperation();

        expect(root.isPending).toBe(false);
        expect(root.child.isPending).toBe(false);

        return promise;
      });

      expect(root.isPending).toBe(true);
      expect(root.child.isPending).toBe(true);

      return promise;
    });
  });

  describe('ignore', () => {
    test('ignoring observed object throws', () => {
      expect.assertions(2);
      expect(() => {
        observe.ignore(observe.observe({}));
      }).toThrowError('Observed non-promise object or function cannot be ignored.');
      expect(() => {
        observe.ignore(observe.observe({}));
      }).toThrowError(Error);
    });

    test('ignoring observed function throws', () => {
      expect.assertions(2);
      expect(() => {
        observe.ignore(observe.observe(() => {}));
      }).toThrowError('Observed non-promise object or function cannot be ignored.');
      expect(() => {
        observe.ignore(observe.observe(() => {}));
      }).toThrowError(Error);
    });

    test('ignoring primitive value doesn\'t throw', () => {
      observe.ignore(1);
    });

    test('ignore object', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      observe.observe(observe.ignore({method() {}})).method();
      expect(observation.mock.calls.length).toBe(0);
      observe.off(observation);
    });

    test('ignore function', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      observe.observe(observe.ignore(() => {}))();
      expect(observation.mock.calls.length).toBe(0);
      observe.off(observation);
    });

    test('ignore promise', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      observe.observe(observe.ignore(Promise.resolve()));

      return observe.observe(() => observe.ignore(Promise.resolve()))()
        .then(() => {
          // 1 observed function call
          expect(observation.mock.calls.length).toBe(1);
          observe.off(observation);
        });
    });

    test('ignore thenable', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      observe.observe(observe.ignore({then(r) { r(); }}));

      return observe.observe(() => observe.ignore({then(r) { r(); }}))()
        .then(() => {
          // 1 observed function call
          expect(observation.mock.calls.length).toBe(1);
          observe.off(observation);
        });
    });

    test('the returned value equals the input', () => {
      expect.assertions(2);
      expect(observe.ignore(1)).toBe(1);

      const obj = {};

      expect(observe.ignore(obj)).toBe(obj);
    });
  });

  describe('apply', () => {
    test('observe function call', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);
      expect(observe.apply((a, b) => a + b, null, [1, 2])).toBe(3);
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('arguments are optional', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);
      observe.apply((...args) => {
        expect(args).toEqual([]);
      });
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('the this arg can be provided', () => {
      expect.assertions(2);

      const observation = jest.fn();

      const obj = {};

      observe.on(observation);
      observe.apply(
        function () {
          expect(this).toBe(obj);
        },
        obj);
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('doesn\'t observe the function', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);

      const func = () => {};

      observe.apply(func);
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      func();
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('applying an already observed function may result in two different keys', () => {
      expect.assertions(7);

      const observation = jest.fn();

      observe.on(observation);

      const obj = observe.observe({
        method() { return Promise.resolve(); }
      });

      expect(obj.pending.has('method')).toBe(false);
      expect(obj.pending.has('apply')).toBe(false);

      const promises = Promise.all([
        obj.method(),
        observe.apply(obj.method, obj, null, {key: 'apply'})
      ]);

      expect(obj.pending.has('method')).toBe(true);
      expect(obj.pending.has('apply')).toBe(true);

      return promises.then(() => {
        expect(obj.pending.has('method')).toBe(false);
        expect(obj.pending.has('apply')).toBe(false);
        // 2 observed function calls and 2 settled observed promises
        expect(observation.mock.calls.length).toBe(4);
        observe.off(observation);
      });
    });
  });

  describe('construct', () => {
    test('observe constructor call', () => {
      expect.assertions(3);

      const observation = jest.fn();

      observe.on(observation);

      const obj = {x: null};

      expect(observe.construct(
        class {
          constructor(x) {
            obj.x = x;

            return obj;
          }
        },

        [5])).toBe(obj);
      expect(obj.x).toBe(5);
      // 1 observed construction
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('the arguments are optional', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);

      observe.construct(class {
        constructor(...args) {
          expect(args).toEqual([]);
        }
      });
      // 1 observed construction
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('a new target can be provided', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);

      function F() {}

      observe.construct(
        class A {
          constructor() {
            expect(new.target).toBe(F);
          }
        },
        null,
        F);
      // 1 observed construction
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('if new target is missing it\'s set to target', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);

      observe.construct(class A {
        constructor() {
          expect(new.target).toBe(A);
        }
      });
      // 1 observed construction
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('doesn\'t observe the constructor', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);

      class A {}

      observe.construct(A);
      // 1 observed construction
      expect(observation.mock.calls.length).toBe(1);
      new A();
      // 1 observed construction
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });
  });

  describe('isObservedObject', () => {
    test('an observed regular object is an observed object', () => {
      expect.assertions(1);
      expect(observe.isObservedObject(observe.observe({}))).toBe(true);
    });

    test('a regular object is not an observed object', () => {
      expect.assertions(1);
      expect(observe.isObservedObject({})).toBe(false);
    });

    test('an observed function is not an observed object', () => {
      expect.assertions(1);
      expect(observe.isObservedObject(observe.observe(() => {}))).toBe(false);
    });

    test('an observed promise is not an observed object', () => {
      expect.assertions(1);

      const promise = observe.observe(Promise.resolve());

      expect(observe.isObservedObject(promise)).toBe(false);

      return promise;
    });

    test('a primitive is not an observed object', () => {
      expect.assertions(1);
      expect(observe.isObservedObject(1)).toBe(false);
    });
  });

  describe('isReliablyObservable', () => {
    test('null is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(null)).toBe(false);
    });

    test('undefined is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(undefined)).toBe(false);
    });

    test('a number is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(1)).toBe(false);
    });

    test('a boolean is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(true)).toBe(false);
    });

    test('a string is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable('string')).toBe(false);
    });

    test('a symbol is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(Symbol())).toBe(false);
    });

    test('a promise is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(Promise.resolve())).toBe(false);
    });

    test('a thenable is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable({then(r) { r(); }})).toBe(false);
    });

    test('a regular object is reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable({})).toBe(true);
    });

    test('an observed regular object is reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(observe.observe({}))).toBe(true);
    });

    test('an ignored regular object is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(observe.ignore({}))).toBe(false);
    });

    test('a function is reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(() => {})).toBe(true);
    });

    test('an observed function is reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(observe.observe(() => {}))).toBe(true);
    });

    test('an ignored function is not reliably observable', () => {
      expect.assertions(1);
      expect(observe.isReliablyObservable(observe.ignore(() => {}))).toBe(false);
    });
  });

  describe('addObservedChild', () => {
    test('child can not be added to value that is not observed object', () => {
      expect.assertions(4);
      expect(() => {
        observe.addObservedChild(observe.observe(() => {}), observe.observe({}));
      }).toThrowError('Trying to add child to non-observed object.');
      expect(() => {
        observe.addObservedChild({}, observe.observe({}));
      }).toThrowError(Error);
      expect(() => {
        observe.addObservedChild(1, observe.observe({}));
      }).toThrowError('Trying to add child to non-observed object.');

      const promise = observe.observe(Promise.resolve());

      expect(() => {
        observe.addObservedChild(promise, observe.observe({}));
      }).toThrowError(Error);

      return promise;
    });

    test('value that is not observed object can not be added', () => {
      expect.assertions(4);
      expect(() => {
        observe.addObservedChild(observe.observe({}), {});
      }).toThrowError('Trying to add non-observed child.');
      expect(() => {
        observe.addObservedChild(observe.observe({}), observe.observe(() => {}));
      }).toThrowError(Error);
      expect(() => {
        observe.addObservedChild(observe.observe({}), 1);
      }).toThrowError('Trying to add non-observed child.');

      const promise = observe.observe(Promise.resolve());

      expect(() => {
        observe.addObservedChild(observe.observe({}), promise);
      }).toThrowError('Trying to add non-observed child.');

      return promise;
    });

    test('observed child object argument becomes observed child object of the observed object',
      () => {
        expect.assertions(6);

        const root = observe.root({obj: observe.observe({})});
        const child = observe.observe({startAsyncOperation: () => Promise.resolve()});

        observe.addObservedChild(root.obj, child);

        expect(child.isPending).toBe(false);
        expect(root.obj.isPending).toBe(false);

        const promise = child.startAsyncOperation().then(() => {
          expect(child.isPending).toBe(false);
          expect(root.obj.isPending).toBe(false);
        });

        expect(child.isPending).toBe(true);
        expect(root.obj.isPending).toBe(true);

        return promise;
      });

    test('the child can not be the same as the destination', () => {
      expect.assertions(2);

      const obj = observe.observe({});

      expect(() => { observe.addObservedChild(obj, obj); })
        .toThrowError('The child is an ascendant of the object or is the same object.');
      expect(() => { observe.addObservedChild(obj, obj); }).toThrowError(Error);
    });

    test('the child can not be an ascendant of the destination', () => {
      expect.assertions(2);

      const obj = observe.observe({child: observe.observe({})});

      expect(() => { observe.addObservedChild(obj.child, obj); })
        .toThrowError('The child is an ascendant of the object or is the same object.');
      expect(() => { observe.addObservedChild(obj.child, obj); }).toThrowError(Error);
    });

    test('if child is already descendant nothing happens', () => {
      const obj = observe.observe({child: observe.observe({})});

      observe.addObservedChild(obj, obj.child);
    });

    test('if the child has pending operations associated with it and now it has'
      + ' a root it becomes pending', () => {
      expect.assertions(12);

      const child = observe.observe({startAsyncOperation: () => Promise.resolve()});
      const root = observe.root({});

      expect(child.isPending).toBe(false);
      expect(child.pending.has('startAsyncOperation')).toBe(false);
      expect(root.isPending).toBe(false);

      const promise = child.startAsyncOperation().then(() => {
        expect(child.isPending).toBe(false);
        expect(child.pending.has('startAsyncOperation')).toBe(false);
        expect(root.isPending).toBe(false);
      });

      expect(child.isPending).toBe(false);
      expect(child.pending.has('startAsyncOperation')).toBe(true);
      expect(root.isPending).toBe(false);

      observe.addObservedChild(root, child);

      expect(child.isPending).toBe(true);
      expect(child.pending.has('startAsyncOperation')).toBe(true);
      expect(root.isPending).toBe(true);

      return promise;
    });

    test('if the child has pending operations associated with it and the object is rooted,'
      + ' the object becomes pending', () => {
      expect.assertions(16);

      const obj = observe.observe({
        child: observe.observe({startAsyncOperation: () => Promise.resolve()})
      });
      const root = observe.root({});

      expect(obj.child.isPending).toBe(false);
      expect(obj.child.pending.has('startAsyncOperation')).toBe(false);
      expect(obj.isPending).toBe(false);
      expect(root.isPending).toBe(false);

      const promise = obj.child.startAsyncOperation().then(() => {
        expect(obj.child.isPending).toBe(false);
        expect(obj.child.pending.has('startAsyncOperation')).toBe(false);
        expect(obj.isPending).toBe(false);
        expect(root.isPending).toBe(false);
      });

      expect(obj.child.isPending).toBe(false);
      expect(obj.child.pending.has('startAsyncOperation')).toBe(true);
      expect(obj.isPending).toBe(false);
      expect(root.isPending).toBe(false);

      observe.addObservedChild(root, obj);

      expect(obj.child.isPending).toBe(true);
      expect(obj.child.pending.has('startAsyncOperation')).toBe(true);
      expect(obj.isPending).toBe(true);
      expect(root.isPending).toBe(true);

      return promise;
    });
  });

  describe('removeObservedChild', () => {
    test('child can not be removed from value that is not observed object', () => {
      expect.assertions(4);
      expect(() => {
        observe.removeObservedChild(observe.observe(() => {}), observe.observe({}));
      }).toThrowError('Trying to remove child of non-observed object.');
      expect(() => {
        observe.removeObservedChild({}, observe.observe({}));
      }).toThrowError(Error);
      expect(() => {
        observe.removeObservedChild(1, observe.observe({}));
      }).toThrowError('Trying to remove child of non-observed object.');

      const promise = observe.observe(Promise.resolve());

      expect(() => {
        observe.removeObservedChild(promise, observe.observe({}));
      }).toThrowError(Error);

      return promise;
    });

    test('value that is not observed object can not be removed', () => {
      expect.assertions(4);
      expect(() => {
        observe.removeObservedChild(observe.observe({}), {});
      }).toThrowError('Trying to remove non-observed child.');
      expect(() => {
        observe.removeObservedChild(observe.observe({}), observe.observe(() => {}));
      }).toThrowError(Error);
      expect(() => {
        observe.removeObservedChild(observe.observe({}), 1);
      }).toThrowError('Trying to remove non-observed child.');

      const promise = observe.observe(Promise.resolve());

      expect(() => {
        observe.removeObservedChild(observe.observe({}), promise);
      }).toThrowError(Error);

      return promise;
    });

    test('non-child can not be removed', () => {
      expect.assertions(2);
      expect(() => {
        observe.removeObservedChild(observe.observe({}), observe.observe({}));
      }).toThrowError('Trying to remove non-child.');
      expect(() => {
        observe.removeObservedChild(observe.observe({}), observe.observe({}));
      }).toThrowError(Error);
    });

    test('remove child from object not under root', () => {
      expect.assertions(6);

      const obj = observe.observe({
        child: observe.observe({
          startAsyncOperation: () => Promise.resolve()
        })
      });

      observe.removeObservedChild(obj, obj.child);
      observe.root(obj);

      expect(obj.isPending).toBe(false);
      expect(obj.child.isPending).toBe(false);

      const promise = obj.child.startAsyncOperation().then(() => {
        expect(obj.isPending).toBe(false);
        expect(obj.child.isPending).toBe(false);
      });

      expect(obj.isPending).toBe(false);
      expect(obj.child.isPending).toBe(false);

      return promise;
    });

    test('remove child from object under root', () => {
      expect.assertions(19);

      const child = observe.observe({startAsyncOperation: () => Promise.resolve()});
      const obj = observe.observe({child, startAsyncOperation: () => Promise.resolve()});
      const root = observe.root({obj});

      observe.removeObservedChild(obj, child);

      expect(child.pending.has('startAsyncOperation')).toBe(false);
      expect(child.isPending).toBe(false);
      expect(obj.isPending).toBe(false);
      expect(root.isPending).toBe(false);

      const promise = child.startAsyncOperation().then(() => {
        expect(child.pending.has('startAsyncOperation')).toBe(false);
        expect(child.isPending).toBe(false);
        expect(obj.pending.has('startAsyncOperation')).toBe(false);
        expect(obj.isPending).toBe(false);
        expect(root.isPending).toBe(false);

        const promise = obj.startAsyncOperation().then(() => {
          expect(obj.pending.has('startAsyncOperation')).toBe(false);
          expect(obj.isPending).toBe(false);
          expect(root.isPending).toBe(false);
        });

        expect(obj.pending.has('startAsyncOperation')).toBe(true);
        expect(obj.isPending).toBe(true);
        expect(root.isPending).toBe(true);

        return promise;
      });

      expect(child.pending.has('startAsyncOperation')).toBe(true);
      expect(child.isPending).toBe(false);
      expect(obj.isPending).toBe(false);
      expect(root.isPending).toBe(false);

      return promise;
    });

    test('remove child from object in managed tree A when it\'s in managed'
      + ' tree B as well', () => {
      expect.assertions(9);

      const child = observe.observe({
        startAsyncOperation: () => Promise.resolve()
      });
      const root1 = observe.root({child});
      const root2 = observe.root({child});

      expect(root1.isPending).toBe(false);
      expect(root2.isPending).toBe(false);
      expect(child.isPending).toBe(false);

      const promise = child.startAsyncOperation().then(() => {
        expect(root1.isPending).toBe(false);
        expect(root2.isPending).toBe(false);
        expect(child.isPending).toBe(false);
      });

      observe.removeObservedChild(root1, child);
      expect(root1.isPending).toBe(false);
      expect(root2.isPending).toBe(true);
      expect(child.isPending).toBe(true);

      return promise;
    });

    test('root is removed from the child as well', () => {
      expect.assertions(12);

      const root = observe.root({
        obj: observe.observe({
          child: observe.observe({startAsyncOperation: () => Promise.resolve()})
        })
      });

      observe.removeObservedChild(root, root.obj);

      expect(root.obj.child.pending.has('startAsyncOperation')).toBe(false);
      expect(root.obj.child.isPending).toBe(false);
      expect(root.obj.isPending).toBe(false);
      expect(root.isPending).toBe(false);

      const promise = root.obj.child.startAsyncOperation().then(() => {
        expect(root.obj.child.pending.has('startAsyncOperation')).toBe(false);
        expect(root.obj.child.isPending).toBe(false);
        expect(root.obj.isPending).toBe(false);
        expect(root.isPending).toBe(false);
      });

      expect(root.obj.child.pending.has('startAsyncOperation')).toBe(true);
      expect(root.obj.child.isPending).toBe(false);
      expect(root.obj.isPending).toBe(false);
      expect(root.isPending).toBe(false);

      return promise;
    });

    test('same root from a different source remains', () => {
      expect.assertions(9);

      const child = observe.observe({startAsyncOperation: () => Promise.resolve()});

      const root = observe.root({
        obj: observe.observe({child}),
        child
      });

      observe.removeObservedChild(root, root.obj);

      expect(root.obj.child.isPending).toBe(false);
      expect(root.obj.isPending).toBe(false);
      expect(root.isPending).toBe(false);

      const promise = root.obj.child.startAsyncOperation().then(() => {
        expect(root.obj.child.isPending).toBe(false);
        expect(root.obj.isPending).toBe(false);
        expect(root.isPending).toBe(false);
      });

      expect(root.obj.child.isPending).toBe(true);
      expect(root.obj.isPending).toBe(false);
      expect(root.isPending).toBe(true);

      return promise;
    });

    test('object stops being pending when pending observed child object is removed', () => {
      expect.assertions(16);

      const root = observe.root({
        obj: observe.observe({
          child: observe.observe({startAsyncOperation: () => Promise.resolve()})
        })
      });

      expect(root.isPending).toBe(false);
      expect(root.obj.isPending).toBe(false);
      expect(root.obj.child.isPending).toBe(false);
      expect(root.obj.child.pending.has('startAsyncOperation')).toBe(false);

      const promise = root.obj.child.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
        expect(root.obj.isPending).toBe(false);
        expect(root.obj.child.isPending).toBe(false);
        expect(root.obj.child.pending.has('startAsyncOperation')).toBe(false);
      });

      expect(root.isPending).toBe(true);
      expect(root.obj.isPending).toBe(true);
      expect(root.obj.child.isPending).toBe(true);
      expect(root.obj.child.pending.has('startAsyncOperation')).toBe(true);

      observe.removeObservedChild(root.obj, root.obj.child);

      expect(root.isPending).toBe(false);
      expect(root.obj.isPending).toBe(false);
      expect(root.obj.child.isPending).toBe(true);
      expect(root.obj.child.pending.has('startAsyncOperation')).toBe(true);

      return promise;
    });

    test('removed child is retained if it\'s pending', () => {
      expect.assertions(16);

      const root = observe.root({
        obj: observe.observe({
          child: observe.observe({startAsyncOperation: () => Promise.resolve()})
        })
      });

      expect(root.isPending).toBe(false);
      expect(root.obj.isPending).toBe(false);
      expect(root.obj.child.isPending).toBe(false);
      expect(root.obj.child.pending.has('startAsyncOperation')).toBe(false);

      const promise = root.obj.child.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
        expect(root.obj.isPending).toBe(false);
        expect(root.obj.child.isPending).toBe(false);
        expect(root.obj.child.pending.has('startAsyncOperation')).toBe(false);
      });

      expect(root.isPending).toBe(true);
      expect(root.obj.isPending).toBe(true);
      expect(root.obj.child.isPending).toBe(true);
      expect(root.obj.child.pending.has('startAsyncOperation')).toBe(true);

      observe.removeObservedChild(root.obj, root.obj.child);

      expect(root.isPending).toBe(false);
      expect(root.obj.isPending).toBe(false);
      expect(root.obj.child.isPending).toBe(true);
      expect(root.obj.child.pending.has('startAsyncOperation')).toBe(true);

      return promise;
    });

    test('retained pending object can receive root later and become pending again', () => {
      expect.assertions(12);

      const root = observe.root({
        child: observe.observe({startAsyncOperation: () => Promise.resolve()})
      });

      expect(root.isPending).toBe(false);
      expect(root.child.isPending).toBe(false);

      const promise = root.child.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
        expect(root.child.isPending).toBe(false);

        const promise = root.child.startAsyncOperation().then(() => {
          expect(root.isPending).toBe(false);
          expect(root.child.isPending).toBe(false);
        });

        expect(root.isPending).toBe(true);
        expect(root.child.isPending).toBe(true);

        return promise;
      });

      observe.removeObservedChild(root, root.child);
      expect(root.isPending).toBe(false);
      expect(root.child.isPending).toBe(true);
      observe.addObservedChild(root, root.child);
      expect(root.isPending).toBe(true);
      expect(root.child.isPending).toBe(true);

      return promise;
    });

    test('removed root continues to be root', () => {
      expect.assertions(8);

      const root = observe.root({
        childRoot: observe.root({
          startAsyncOperation: () => Promise.resolve()
        })
      });

      expect(root.isPending).toBe(false);
      expect(root.childRoot.isPending).toBe(false);

      const promise = root.childRoot.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
        expect(root.childRoot.isPending).toBe(false);
      });

      expect(root.isPending).toBe(true);
      expect(root.childRoot.isPending).toBe(true);
      observe.removeObservedChild(root, root.childRoot);
      expect(root.isPending).toBe(false);
      expect(root.childRoot.isPending).toBe(true);

      return promise;
    });
  });

  describe('on', () => {
    test('throws if the argument is not a function', () => {
      expect.assertions(2);
      expect(() => {
        observe.on(1);
      }).toThrowError('Notify argument must be a function');
      expect(() => {
        observe.on({});
      }).toThrowError(Error);
    });

    test('observed function triggers observation', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      observe.observe(() => {})();
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('observed promise triggers observation', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);

      return observe.observe(Promise.resolve()).then(() => {
        // 1 settled observed promise
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });
    });

    test('notification callback is called even if it\'s added after the function'
      + ' is observed', () => {
      expect.assertions(1);

      const observation = jest.fn();
      const func = observe.observe(() => {});

      observe.on(observation);
      func();
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('notification callback is called even if it\'s added after the promise is observed'
      + ' and settled', () => {
      expect.assertions(1);

      const observation = jest.fn();
      const promise = Promise.resolve();
      const finalPromise = observe.observe(promise).then(() => {
        // 1 settled observed promise
        expect(observation.mock.calls.length).toBe(1);
        observe.off(observation);
      });

      observe.on(observation);

      return finalPromise;
    });
  });

  describe('off', () => {
    test('throws if the argument is not a function', () => {
      expect.assertions(2);
      expect(() => {
        observe.off(1);
      }).toThrowError('Notify argument must be a function');
      expect(() => {
        observe.off({});
      }).toThrowError(Error);
    });

    test('removed callback is not called anymore', () => {
      expect.assertions(2);

      const observation = jest.fn();

      observe.on(observation);

      const func = observe.observe(() => {});

      func();

      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
      func();
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
    });

    test('if callback wasn\'t added, nothing happens', () => {
      observe.off(() => {});
    });
  });
});
