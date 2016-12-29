(() => {
  'use strict';

  const isModule = typeof module === 'object' && typeof module.exports === 'object';

  let React;
  let ReactDOM;
  let observe;

  if (isModule) {
    React = require('react');
    ReactDOM = require('react-dom');
    observe = require('./observe');
  } else {
    React = window.React;
    ReactDOM = window.ReactDOM;
    observe = window.crizmas.observe;
  }

  function Mvc({element, component, domElement, router}) {
    if (!element && !component && !router) {
      throw new Error('An element or a component or a router must be provided');
    }

    if (!domElement) {
      throw new Error('A domElement must be provided');
    }

    if (element && component) {
      throw new Error('Must not provide both element and component');
    }

    const elementRenderFunc = element
      ? React.cloneElement
      : component
        ? React.createElement
        : null;
    const elementRenderBaseArg = element || component;
    const renderElement = elementRenderFunc
      ? router
        ? () => elementRenderFunc(elementRenderBaseArg, {router}, router.getRootElement())
        : () => elementRenderFunc(elementRenderBaseArg)
      : () => router.getRootElement();
    let notify;
    let previousIsTransitioning = false;

    class Root extends React.Component {
      constructor(...args) {
        super(...args);

        notify = this.forceUpdate.bind(this);
      }

      getChildContext() {
        return {router};
      }

      componentDidMount() {
        // jump to hash after rendering dynamically on page load
        if (router) {
          router.jumpToHash();
        }
      }

      componentDidUpdate() {
        if (router) {
          const isTransitioning = router.isTransitioning;

          // if finished route transitioning jump to hash
          if (previousIsTransitioning && !isTransitioning) {
            router.jumpToHash();
          }

          previousIsTransitioning = isTransitioning;
        }
      }

      render() {
        return renderElement();
      }
    }

    Root.childContextTypes = {
      router: React.PropTypes.object
    };

    this.isMounted = false;

    this.mount = () => {
      if (!this.isMounted) {
        if (router) {
          router.mount();
        }

        ReactDOM.render(React.createElement(Root), domElement);
        observe.on(notify);

        this.isMounted = true;
      }
    };

    this.unmount = () => {
      if (this.isMounted) {
        if (router) {
          router.unmount();
        }

        observe.off(notify);
        ReactDOM.unmountComponentAtNode(domElement);

        this.isMounted = false;
      }
    };

    this.mount();
  }

  Mvc.controller = function (controller) {
    if (!observe.isReliablyObservable(controller)) {
      throw new Error('Controller must be either a function or a non-promise object'
        + ' and it must not be ignored.');
    }

    return observe.observe(controller);
  };

  Mvc.observe = function (...args) {
    return observe.observe(...args);
  };

  Mvc.root = function (value) {
    return observe.root(value);
  };

  Mvc.unroot = function (value) {
    return observe.unroot(value);
  };

  Mvc.isObservedObject = function (value) {
    return observe.isObservedObject(value);
  };

  Mvc.ignore = function (func) {
    return observe.ignore(func);
  };

  Mvc.addObservedChild = function (obj, child) {
    return observe.addObservedChild(obj, child);
  };

  Mvc.removeObservedChild = function (obj, child) {
    return observe.removeObservedChild(obj, child);
  };

  const moduleExports = Mvc;

  if (isModule) {
    module.exports = moduleExports;
  } else {
    window.crizmas.Mvc = moduleExports;
  }
})();
