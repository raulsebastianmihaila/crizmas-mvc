'use strict';

const React = require('react');
const url = require('url');
const Router = require('crizmas-router');

const Mvc = require('../src/mvc.js');
const observe = require('../src/observe.js');

global.URLSearchParams = url.URLSearchParams;

describe('mvc', () => {
  describe('Mvc', () => {
    test('the result of the Mvc constructor is an mvc instance', () => {
      expect.assertions(2);

      const mvc = new Mvc({
        component: () => false,
        domElement: document.createElement('div')
      });

      expect(typeof mvc).toBe('object');
      expect(typeof mvc.mount).toBe('function');
      mvc.unmount();
    });

    test('the mvc instance is automatically mounted', () => {
      expect.assertions(5);

      const observation = jest.fn();
      const domElement = document.createElement('div');
      const func = observe.observe(() => {});

      expect(!!domElement.innerHTML).toBe(false);

      const mvc = new Mvc({
        component: class extends React.Component {
          render() {
            observation();

            return React.createElement('span');
          }
        },
        domElement
      });
      // automount render
      expect(observation.mock.calls.length).toBe(1);
      expect(mvc.isMounted).toBe(true);
      expect(!!domElement.innerHTML).toBe(true);
      func();
      // automount render and 1 observed function call
      expect(observation.mock.calls.length).toBe(2);
      mvc.unmount();
    });

    test('the router is automatically mounted', () => {
      expect.assertions(4);

      const router = new Router({
        routes: [
          {
            path: '*',
            component: () => React.createElement('span')
          }
        ]
      });
      const domElement = document.createElement('div');

      expect(router.isMounted).toBe(false);

      const mvc = new Mvc({
        router,
        domElement
      });

      expect(router.isMounted).toBe(true);
      expect(mvc.isMounted).toBe(true);
      expect(!!domElement.innerHTML).toBe(true);
      mvc.unmount();
    });

    test('if a domElement option is not passed it throws', () => {
      expect.assertions(2);
      expect(() => {
        new Mvc({
          component: () => {}
        });
      }).toThrowError('A domElement must be provided');
      expect(() => {
        new Mvc({
          component: () => {}
        });
      }).toThrowError(Error);
    });

    test('if no element, no component and no router are passed it throws', () => {
      expect.assertions(2);
      expect(() => {
        new Mvc({});
      }).toThrowError('An element or a component or a router must be provided');
      expect(() => {
        new Mvc({});
      }).toThrowError(Error);
    });

    test('if both an element and a component are passed it throws', () => {
      expect.assertions(2);
      expect(() => {
        new Mvc({
          component: () => {},
          element: React.createElement(() => false),
          domElement: document.createElement('div')
        });
      }).toThrowError('Must not provide both element and component');
      expect(() => {
        new Mvc({
          component: () => {},
          element: React.createElement(() => false),
          domElement: document.createElement('div')
        });
      }).toThrowError(Error);
    });

    test('observation results in rerendering', () => {
      expect.assertions(2);

      const observation = jest.fn();
      const func = observe.observe(() => {});
      const mvc = new Mvc({
        component: class extends React.Component {
          render() {
            observation();

            return false;
          }
        },
        domElement: document.createElement('div')
      });
      // automount render
      expect(observation.mock.calls.length).toBe(1);
      func();
      // automount render and 1 observed function call
      expect(observation.mock.calls.length).toBe(2);
      mvc.unmount();
    });

    test('with element', () => {
      expect.assertions(2);

      const observation = jest.fn();
      const mvc = new Mvc({
        element: React.createElement(() => {
          observation();

          return false;
        }),
        domElement: document.createElement('div')
      });

      expect(mvc.isMounted).toBe(true);
      expect(observation.mock.calls.length).toBe(1);
      mvc.unmount();
    });

    test('with element and router', () => {
      expect.assertions(3);

      const elementObservation = jest.fn();
      const routeComponentObservation = jest.fn();
      const mvc = new Mvc({
        element: React.createElement(({children}) => {
          elementObservation();

          return children;
        }),
        router: new Router({
          routes: [
            {
              path: '*',
              component: () => {
                routeComponentObservation();

                return false;
              }
            }
          ]
        }),
        domElement: document.createElement('div')
      });

      expect(mvc.isMounted).toBe(true);
      expect(elementObservation.mock.calls.length).toBe(1);
      expect(routeComponentObservation.mock.calls.length).toBe(1);
      mvc.unmount();
    });

    test('with component and router', () => {
      expect.assertions(3);

      const componentObservation = jest.fn();
      const routeComponentObservation = jest.fn();
      const mvc = new Mvc({
        component: ({children}) => {
          componentObservation();

          return children;
        },
        router: new Router({
          routes: [
            {
              path: '*',
              component: () => {
                routeComponentObservation();

                return false;
              }
            }
          ]
        }),
        domElement: document.createElement('div')
      });

      expect(mvc.isMounted).toBe(true);
      expect(componentObservation.mock.calls.length).toBe(1);
      expect(routeComponentObservation.mock.calls.length).toBe(1);
      mvc.unmount();
    });

    test('if the url hash changes the element\'s scrollIntoView is called', () => {
      expect.assertions(4);

      const observation = jest.fn();
      const domElement = document.createElement('div');

      domElement.scrollIntoView = () => { observation(); };

      domElement.setAttribute('id', 'test');
      document.body.appendChild(domElement);

      const router = new Router({
        routes: [
          {
            path: '*',
            component: () => false
          }
        ]
      });
      const mvc = new Mvc({
        router,
        domElement
      });

      expect(window.location.hash).toBe('');
      expect(observation.mock.calls.length).toBe(0);
      router.transitionTo('#test');
      expect(window.location.hash).toBe('#test');
      // observation direct call
      expect(observation.mock.calls.length).toBe(1);
      mvc.unmount();

      window.location.hash = '';
      document.body.innerHTML = '';
    });

    test('if the page url already has a hash the element\'s scrollIntoView is called', () => {
      expect.assertions(3);
      window.history.pushState(null, '', '#test');

      const observation = jest.fn();
      const domElement = document.createElement('div');

      domElement.scrollIntoView = () => { observation(); };

      domElement.setAttribute('id', 'test');
      document.body.appendChild(domElement);
      expect(window.location.hash).toBe('#test');
      expect(observation.mock.calls.length).toBe(0);

      const router = new Router({
        routes: [
          {
            path: '*',
            component: () => false
          }
        ]
      });
      const mvc = new Mvc({
        router,
        domElement
      });

      // observation direct call
      expect(observation.mock.calls.length).toBe(1);
      mvc.unmount();

      window.location.hash = '';
      document.body.innerHTML = '';
    });
  });

  describe('mount', () => {
    test('mounting already mounted instance doesn\'t throw', () => {
      expect.assertions(2);

      const mvc = new Mvc({
        component: () => false,
        domElement: document.createElement('div')
      });

      expect(mvc.isMounted).toBe(true);
      mvc.mount();
      expect(mvc.isMounted).toBe(true);
      mvc.unmount();
    });

    test('mount remounts unmounted instance', () => {
      expect.assertions(10);

      const observation = jest.fn();
      const domElement = document.createElement('div');
      const func = observe.observe(() => {});
      const mvc = new Mvc({
        component: class extends React.Component {
          render() {
            observation();

            return React.createElement('span');
          }
        },
        domElement
      });

      expect(mvc.isMounted).toBe(true);
      expect(!!domElement.innerHTML).toBe(true);
      // automount render
      expect(observation.mock.calls.length).toBe(1);
      mvc.unmount();
      func();
      expect(mvc.isMounted).toBe(false);
      expect(!!domElement.innerHTML).toBe(false);
      // automount render
      expect(observation.mock.calls.length).toBe(1);
      mvc.mount();
      expect(mvc.isMounted).toBe(true);
      expect(!!domElement.innerHTML).toBe(true);
      // automount render and remount render
      expect(observation.mock.calls.length).toBe(2);
      func();
      // automount render and remount render and 1 observed function call
      expect(observation.mock.calls.length).toBe(3);
      mvc.unmount();
    });

    test('the router is mounted', () => {
      expect.assertions(6);

      const router = new Router({
        routes: [
          {
            path: '*',
            component: () => false
          }
        ]
      });
      const mvc = new Mvc({
        router,
        domElement: document.createElement('div')
      });

      expect(router.isMounted).toBe(true);
      expect(mvc.isMounted).toBe(true);

      mvc.unmount();

      expect(router.isMounted).toBe(false);
      expect(mvc.isMounted).toBe(false);

      mvc.mount();

      expect(router.isMounted).toBe(true);
      expect(mvc.isMounted).toBe(true);
      mvc.unmount();
    });

    test('if the page url already has a hash the element\'s scrollIntoView is called', () => {
      expect.assertions(10);

      const observation = jest.fn();
      const domElement = document.createElement('div');

      domElement.scrollIntoView = () => { observation(); };

      domElement.setAttribute('id', 'test');
      document.body.appendChild(domElement);
      expect(window.location.hash).toBe('');

      const router = new Router({
        routes: [
          {
            path: '*',
            component: () => false
          }
        ]
      });
      const mvc = new Mvc({
        router,
        domElement
      });

      expect(router.isMounted).toBe(true);
      expect(mvc.isMounted).toBe(true);

      mvc.unmount();
      window.history.pushState(null, '', '#test');

      expect(router.isMounted).toBe(false);
      expect(mvc.isMounted).toBe(false);
      expect(window.location.hash).toBe('#test');
      expect(observation.mock.calls.length).toBe(0);

      mvc.mount();

      expect(router.isMounted).toBe(true);
      expect(mvc.isMounted).toBe(true);

      // observation direct call
      expect(observation.mock.calls.length).toBe(1);
      mvc.unmount();

      window.location.hash = '';
      document.body.innerHTML = '';
    });

    test('the router is passed through the context', () => {
      expect.assertions(1);

      const router = new Router({
        routes: [
          {
            path: '*',
            component: () => {
              return React.createElement(Mvc.routerContext.Consumer,
                null,
                (router_) => {
                  expect(router_).toBe(router);
                });
            }
          }
        ]
      });
      const mvc = new Mvc({
        router,
        domElement: document.createElement('div')
      });

      mvc.unmount();
    });

    test('each mvc instance passes its own router through the context', () => {
      expect.assertions(6);

      const router1 = new Router({
        routes: [
          {
            path: '*',
            component: () => {
              return React.createElement(Mvc.routerContext.Consumer,
                null,
                (router_) => {
                  // called twice because the second router is mounted
                  // and it does an observed transition
                  expect(router_).toBe(router1);
                  expect(router_).not.toBe(router2);
                });
            }
          }
        ]
      });
      const router2 = new Router({
        routes: [
          {
            path: '*',
            component: () => {
              return React.createElement(Mvc.routerContext.Consumer,
                null,
                (router_) => {
                  expect(router_).toBe(router2);
                  expect(router_).not.toBe(router1);
                });
            }
          }
        ]
      });
      const mvc1 = new Mvc({
        router: router1,
        domElement: document.createElement('div')
      });
      const mvc2 = new Mvc({
        router: router2,
        domElement: document.createElement('div')
      });

      mvc1.unmount();
      mvc2.unmount();
    });

    test('two mvc instances can pass the same router through the context', () => {
      expect.assertions(2);

      const router = new Router({
        routes: [
          {
            path: '*',
            component: () => false
          }
        ]
      });
      const mvc1 = new Mvc({
        router,
        domElement: document.createElement('div'),
        component: () => {
          return React.createElement(Mvc.routerContext.Consumer,
            null,
            (router_) => {
              expect(router_).toBe(router);
            });
        }
      });
      const mvc2 = new Mvc({
        router,
        domElement: document.createElement('div'),
        component: () => {
          return React.createElement(Mvc.routerContext.Consumer,
            null,
            (router_) => {
              expect(router_).toBe(router);
            });
        }
      });

      mvc1.unmount();
      mvc2.unmount();
    });
  });

  describe('unmount', () => {
    test('unmounting an already unmounted instance doesn\'t throw', () => {
      expect.assertions(3);

      const mvc = new Mvc({
        component: () => false,
        domElement: document.createElement('div')
      });

      expect(mvc.isMounted).toBe(true);
      mvc.unmount();
      expect(mvc.isMounted).toBe(false);
      mvc.unmount();
      expect(mvc.isMounted).toBe(false);
    });

    test('unmounting', () => {
      expect.assertions(6);

      const observation = jest.fn();
      const domElement = document.createElement('div');
      const func = observe.observe(() => {});
      const mvc = new Mvc({
        component: class extends React.Component {
          render() {
            observation();

            return React.createElement('span');
          }
        },
        domElement
      });

      expect(mvc.isMounted).toBe(true);
      expect(!!domElement.innerHTML).toBe(true);
      func();
      // automount render and 1 observed function call
      expect(observation.mock.calls.length).toBe(2);
      mvc.unmount();
      expect(mvc.isMounted).toBe(false);
      expect(!!domElement.innerHTML).toBe(false);
      func();
      // automount render and 1 observed function call
      expect(observation.mock.calls.length).toBe(2);
    });

    test('the router is automatically unmounted', () => {
      expect.assertions(4);

      const router = new Router({
        routes: [
          {
            path: '*',
            component: () => false
          }
        ]
      });
      const mvc = new Mvc({
        router,
        domElement: document.createElement('div')
      });

      expect(router.isMounted).toBe(true);
      expect(mvc.isMounted).toBe(true);

      mvc.unmount();

      expect(router.isMounted).toBe(false);
      expect(mvc.isMounted).toBe(false);
    });

    test('unmounting an mvc instance doesn\'t affect other instances', () => {
      expect.assertions(7);

      const observation = jest.fn();
      const observedFunc = Mvc.observe(() => {});
      const mvc1 = new Mvc({
        domElement: document.createElement('div'),
        component: () => {
          observation();

          return false;
        }
      });
      const mvc2 = new Mvc({
        domElement: document.createElement('div'),
        component: () => false
      });

      expect(mvc1.isMounted).toBe(true);
      expect(mvc2.isMounted).toBe(true);
      expect(observation.mock.calls.length).toBe(1);

      mvc2.unmount();

      expect(mvc1.isMounted).toBe(true);
      expect(mvc2.isMounted).toBe(false);
      expect(observation.mock.calls.length).toBe(1);
      observedFunc();
      expect(observation.mock.calls.length).toBe(2);

      mvc1.unmount();
    });
  });

  describe('controller', () => {
    test('marking as controller a not reliably observable value throws', () => {
      expect.assertions(8);

      expect(() => {
        Mvc.controller(1);
      }).toThrowError('Controller must be either a function or a non-promise object'
        + ' and it must not be ignored.');
      expect(() => {
        Mvc.controller(1);
      }).toThrowError(Error);
      expect(() => {
        Mvc.controller(Promise.resolve());
      }).toThrowError('Controller must be either a function or a non-promise object'
        + ' and it must not be ignored.');
      expect(() => {
        Mvc.controller(Promise.resolve());
      }).toThrowError(Error);
      expect(() => {
        Mvc.controller({then(r) { r(); }});
      }).toThrowError('Controller must be either a function or a non-promise object'
        + ' and it must not be ignored.');
      expect(() => {
        Mvc.controller({then(r) { r(); }});
      }).toThrowError(Error);
      expect(() => {
        Mvc.controller(observe.ignore({}));
      }).toThrowError('Controller must be either a function or a non-promise object'
        + ' and it must not be ignored.');
      expect(() => {
        Mvc.controller(observe.ignore({}));
      }).toThrowError(Error);
    });

    test('controller object is an observed object', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      Mvc.controller({method(){}}).method();
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('controller constructor is observed', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);

      const Constructor = Mvc.controller(class {});

      new Constructor();
      // 1 observed construction
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });

    test('object returned from controller constructor is a controller object', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);

      const Constructor = Mvc.controller(class {
        func() {}
      });

      new Constructor().func();
      // 1 observed construction and 1 observed function call
      expect(observation.mock.calls.length).toBe(2);
      observe.off(observation);
    });

    test('controller constructor can not be applied', () => {
      expect.assertions(2);
      expect(Mvc.controller(function () {}))
        .toThrowError('The observed constructor must be invoked with \'new\'.');
      expect(Mvc.controller(function () {})).toThrowError(Error);
    });

    test('function returned from controller constructor can be applied', () => {
      expect.assertions(3);

      const observation = jest.fn();

      observe.on(observation);

      const Func = Mvc.controller(function () {
        return function () {};
      });
      const newFunc = new Func();
      // 1 observed construction
      expect(observation.mock.calls.length).toBe(1);
      newFunc();
      // 1 observed construction and 1 observed function call
      expect(observation.mock.calls.length).toBe(2);
      expect(Func).toThrowError('The observed constructor must be invoked with \'new\'.');
      observe.off(observation);
    });
  });

  describe('observe', () => {
    test('observe a value', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      Mvc.observe({method(){}}).method();
      // 1 observed function call
      expect(observation.mock.calls.length).toBe(1);
      observe.off(observation);
    });
  });

  describe('root', () => {
    test('root a value', () => {
      expect.assertions(3);

      const root = Mvc.root({startAsyncOperation: () => Promise.resolve()});

      expect(root.isPending).toBe(false);

      const promise = root.startAsyncOperation().then(() => {
        expect(root.isPending).toBe(false);
      });

      expect(root.isPending).toBe(true);

      return promise;
    });
  });

  describe('unroot', () => {
    test('unroot a value', () => {
      expect.assertions(2);

      const root = Mvc.root({startAsyncOperation: () => Promise.resolve()});
      const finalPromise = root.startAsyncOperation().then(() => {
        Mvc.unroot(root);

        const promise = root.startAsyncOperation();

        expect(root.isPending).toBe(false);

        return promise;
      });

      expect(root.isPending).toBe(true);

      return finalPromise;
    });
  });

  describe('isObservedObject', () => {
    test('observed object is an observed object', () => {
      expect.assertions(1);
      expect(Mvc.isObservedObject(Mvc.observe({}))).toBe(true);
    });
  });

  describe('ignore', () => {
    test('ignore value', () => {
      expect.assertions(1);

      const observation = jest.fn();

      observe.on(observation);
      Mvc.observe(Mvc.ignore({method(){}})).method();
      expect(observation.mock.calls.length).toBe(0);
      observe.off(observation);
    });
  });

  describe('addObservedChild', () => {
    test('add observed child', () => {
      expect.assertions(6);

      const root = Mvc.root({obj: Mvc.observe({})});
      const child = Mvc.observe({startAsyncOperation: () => Promise.resolve()});

      Mvc.addObservedChild(root.obj, child);

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
  });

  describe('removeObservedChild', () => {
    test('remove observed child', () => {
      expect.assertions(19);

      const child = Mvc.observe({startAsyncOperation: () => Promise.resolve()});
      const obj = Mvc.observe({child, startAsyncOperation: () => Promise.resolve()});
      const root = Mvc.root({obj});

      Mvc.removeObservedChild(obj, child);

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
  });
});
