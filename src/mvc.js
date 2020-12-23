import React from 'react';
import ReactDom from 'react-dom';

import {on, off, isReliablyObservable, observe} from './observe.js';

const {createElement, cloneElement} = React;
const {render, unmountComponentAtNode} = ReactDom;

export default function Mvc({element, component, domElement, router}) {
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
      on(notify);
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
      return createElement(routerContext.Provider,
        {value: router},
        renderElement());
    }
  }

  const init = () => {
    const elementRenderFunc = element
      ? cloneElement
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

      render(createElement(Root), domElement);

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

      off(notify);
      unmountComponentAtNode(domElement);

      mvc.isMounted = false;
    }
  };

  init();
  mvc.mount();

  return mvc;
}

export const routerContext = React.createContext();

export const controller = (controller) => {
  if (!isReliablyObservable(controller)) {
    throw new Error('Controller must be either a function or a non-promise object'
      + ' and it must not be ignored.');
  }

  return observe(controller, {preventApply: true});
};
