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
    ({React, ReactDOM, crizmas: {observe}} = window);
  }

  const {createElement} = React;

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

    const mvc = {
      isMounted: false
    };

    let notify;
    let handledUrl = false;
    let renderElement;

    class Root extends React.Component {
      constructor(...args) {
        super(...args);

        notify = this.forceUpdate.bind(this);

        // make sure that we're observing early so that a new rendering process can be
        // initiated if needed (for instance if an observed function is called in
        // componentDidMount)
        observe.on(notify);
      }

      componentDidMount() {
        // jump to hash after rendering dynamically on page load
        if (router) {
          router.jumpToHash();
        }
      }

      componentDidUpdate() {
        if (handledUrl) {
          handledUrl = false;

          router.jumpToHash();
        }
      }

      render() {
        return createElement(Mvc.routerContext.Provider,
          {value: router},
          renderElement());
      }
    }

    const init = () => {
      const elementRenderFunc = element
        ? React.cloneElement
        : component
          ? createElement
          : null;
      const elementRenderBaseArg = element || component;

      renderElement = elementRenderFunc
        ? router
          ? () => elementRenderFunc(elementRenderBaseArg, {router}, router.getRootElement())
          : () => elementRenderFunc(elementRenderBaseArg)
        : () => router.getRootElement();
    };

    mvc.mount = () => {
      if (!mvc.isMounted) {
        if (router) {
          router.mount();
          router.onUrlHandle(handleUrl);
        }

        ReactDOM.render(createElement(Root), domElement);

        mvc.isMounted = true;
      }
    };

    const handleUrl = () => {
      handledUrl = true;
    };

    mvc.unmount = () => {
      if (mvc.isMounted) {
        if (router) {
          router.unmount();
          router.offUrlHandle(handleUrl);
        }

        observe.off(notify);
        ReactDOM.unmountComponentAtNode(domElement);

        mvc.isMounted = false;
      }
    };

    init();
    mvc.mount();

    return mvc;
  }

  Mvc.routerContext = React.createContext();

  Mvc.controller = (controller) => {
    if (!observe.isReliablyObservable(controller)) {
      throw new Error('Controller must be either a function or a non-promise object'
        + ' and it must not be ignored.');
    }

    return observe.observe(controller, {preventApply: true});
  };

  Mvc.observe = (...args) => {
    return observe.observe(...args);
  };

  Mvc.root = (value) => {
    return observe.root(value);
  };

  Mvc.unroot = (value) => {
    return observe.unroot(value);
  };

  Mvc.isObservedObject = (value) => {
    return observe.isObservedObject(value);
  };

  Mvc.ignore = (value) => {
    return observe.ignore(value);
  };

  Mvc.addObservedChild = (obj, child) => {
    return observe.addObservedChild(obj, child);
  };

  Mvc.removeObservedChild = (obj, child) => {
    return observe.removeObservedChild(obj, child);
  };

  const moduleExports = Mvc;

  if (isModule) {
    module.exports = moduleExports;
  } else {
    window.crizmas.Mvc = moduleExports;
  }
})();
