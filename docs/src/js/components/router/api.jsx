import React from 'react';
import {Link} from 'crizmas-router';

import Logo from 'js/components/logo';
import Api from 'js/components/api';
import Ticks from 'js/components/ticks';

export default () => <div>
  <h2><Logo text="crizmas-router" /> - API</h2>

  <p>Make sure you check the <Link to="/router">getting started</Link> and <Link
  to="/router/theory">theory</Link> sections before jumping into API details.</p>

  <Api id="Router" text={`
    import Router from 'crizmas-router';
    // in ES5, Router is window.CrizmasRouter

    const router = new Router({
      basePath: 'base-path',
      routes: [
        {
          path: 'home',
          component: HomeComponent,
          controller: HomeController,
          children: [
            {
              path: 'child/grandchild',
              resolve() {
                return Promise.resolve({
                  component: ChildComponent
                });
              }
            }
          ]
        }
      ]
    });
  `} />

  <ul className="simple-list">
    <li>Creates a new router instance.</li>
    <li>The base path is optional. The links and the paths passed to <Link
    to="#router.transitionTo">transitionTo</Link> will be automatically prefixed with it.</li>
    <li>The path is optional and defaults to the empty string.</li>
    <li>The path can be a compound path.</li>
    <li>If the path starts with a colon and the rest of the characters match the <Ticks
    text="/\w/" /> regular expression class, a param is created.</li>
    <li>The path can be <Ticks text="*" /> in which case it matches anything.</li>
    <li>The controller is optional and can be an object or a function that is constructed to
    create the controller object, before the route fragment is entered.</li>
    <li>The controller function can return a promise that is fulfilled with the controller
    object.</li>
    <li>If the controller object is an observed object, it is rooted before the route fragment
    is entered and unrooted when the route fragment is left.</li>
    <li>The component is a React component. It's optional and it receives <Ticks
    text="controller" /> and <Ticks text="routeFragment" /> as props.</li>
    <li>A route fragment must have either a component or children.</li>
    <li>A route fragment with no component must have either a non-empty
    path or a controller.</li>
    <li>A route fragment can have a resolve function that is used to update its
    configuration or its children's configuration. Check the <Link
    to="/router/theory">theory</Link> for more details.</li>
  </ul>

  <Api id="controllerObject.onEnter" text={`
    controllerObject.onEnter({ router, routeFragment });
  `} />

  <ul className="simple-list">
    <li>The onEnter method is optional.</li>
    <li>It's called before the route fragment is entered.</li>
    <li>It can return a promise that is awaited before entering.</li>
    <li>If it returns false or the promise is fulfilled with false, the route fragment
    is not entered.</li>
  </ul>

  <Api id="controllerObject.onLeave" text={`
    controllerObject.onLeave({ router, routeFragment });
  `} />

  <ul className="simple-list">
    <li>The onLeave method is optional.</li>
    <li>It's called before the route fragment is left.</li>
    <li>It can return a promise that is awaited before leaving.</li>
    <li>If it returns false or the promise is fulfilled with false, the route fragment
    is not left.</li>
  </ul>

  <Api id="router.url" text="router.url" />

  <ul className="simple-list">
    <li>This is a standard URL instance (<Ticks text="new URL()" />) representing
    the current URL.</li>
  </ul>

  <Api id="router.params" text="router.params" />

  <ul className="simple-list">
    <li>This is a standard URLSearchParams instance (<Ticks text="new URLSearchParams()" />)
    representing the URL params resulted from param matching.</li>
  </ul>

  <Api id="router.isTransitioning" text="router.isTransitioning" />

  <ul className="simple-list">
    <li>It's true as long as there is a transition in progress from one route fragment
    to another (starting from before the onLeave method of the current leaf
    route fragment is called, until the onEnter method of the future leaf route
    fragment returns, or its returned promise is settled).</li>
  </ul>

  <Api id="router.currentRouteFragment" text="router.currentRouteFragment" />

  <ul className="simple-list">
    <li>The current leaf route fragment.</li>
    <li>It's updated during the transition process as route fragments are left and entered.</li>
  </ul>

  <Api id="router.currentRouteFragments" text="router.currentRouteFragments" />

  <ul className="simple-list">
    <li>An array of current route fragments, starting from the root to
    router.currentRouteFragment.</li>
    <li>It's updated during the transition process as route fragments are left and entered.</li>
  </ul>

  <Api id="router.targetRouteFragment" text="router.targetRouteFragment" />

  <ul className="simple-list">
    <li>The future leaf route fragment.</li>
    <li>It's set to <Ticks text="null" /> when the transition process ends.</li>
  </ul>

  <Api id="router.transitionTo" text="router.transitionTo(path)" />

  <ul className="simple-list">
    <li>Initiates a transition.</li>
  </ul>

  <Api id="router.mount" text="router.mount()" />

  <ul className="simple-list">
    <li>This is called when the <Ticks text="mvc" /> instance is mounted.</li>
    <li>Can be called after a router has been unmounted.</li>
    <li>When this is called, the router starts listening for URL changes.</li>
  </ul>

  <Api id="router.unmount" text="router.unmount()" />

  <ul className="simple-list">
    <li>This is called when the <Ticks text="mvc" /> instance is unmounted.</li>
    <li>Can be called after a router has been mounted.</li>
    <li>When this is called, the router stops listening for URL changes.</li>
  </ul>

  <Api id="router.onBeforeChange" text="router.onBeforeChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Attaches listeners that are called before transitioning.</li>
    <li>Cb is called with an object <Ticks text={`{
      router, currentRouteFragment, targetRouteFragment
    }`} /></li>
  </ul>

  <Api id="router.offBeforeChange" text="router.offBeforeChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Removes onBeforeChange listeners.</li>
  </ul>

  <Api id="router.onChange" text="router.onChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Attaches listeners that are called after transitioning.</li>
    <li>Cb is called with an object <Ticks text={`{
      router, currentRouteFragment, oldRouteFragment
    }`} /></li>
  </ul>

  <Api id="router.offChange" text="router.offChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Removes onChange listeners.</li>
  </ul>

  <Api id="router.isPathActive" text="router.isPathActive(path)" />

  <ul className="simple-list">
    <li>Returns true if the path is the current path.</li>
    <li>The path is normalized to begin with <Ticks text="/" />.</li>
  </ul>

  <Api id="router.isDescendantPathActive" text="router.isDescendantPathActive(path)" />

  <ul className="simple-list">
    <li>Returns true if the path is a parent path of the current path.</li>
    <li>E.g. <Ticks text="/a/b" /> is the parent of <Ticks text="/a/b/c" />.</li>
    <li>The path is normalized to begin with <Ticks text="/" />.</li>
  </ul>

  <Api id="routeFragment.path" text="routeFragment.path" />

  <ul className="simple-list">
    <li>The actual path that is represented.</li>
  </ul>

  <Api id="routeFragment.abstractPath" text="routeFragment.abstractPath" />

  <ul className="simple-list">
    <li>The abstract path.</li>
  </ul>

  <Api id="routeFragment.urlPath" text="routeFragment.urlPath" />

  <ul className="simple-list">
    <li>The concatenation of the actual paths separated by <Ticks
    text="/" /> starting from the root until the current route fragent.</li>
  </ul>

  <Api id="routeFragment.component" text="routeFragment.component" />

  <ul className="simple-list">
    <li>The React component.</li>
  </ul>

  <Api id="routeFragment.controller" text="routeFragment.controller" />

  <ul className="simple-list">
    <li>The controller as passed in the router configuration.</li>
  </ul>

  <Api id="routeFragment.controllerObject" text="routeFragment.controllerObject" />

  <ul className="simple-list">
    <li>The controller object resulted from calling the controller (if it's a function)
    or the object as passed in the router configuration.</li>
  </ul>

  <Api id="routeFragment.parent" text="routeFragment.parent" />

  <ul className="simple-list">
    <li>The parent route fragment.</li>
  </ul>

  <Api id="Link" text={`
    import {Link} from 'crizmas-router';
    // in ES5, Link is window.CrizmasRouter.Link

    <Link to={path}>link text</Link>
  `} />

  <ul className="simple-list">
    <li>The result is an anchor.</li>
    <li>The anchor is adorned with the <Ticks text="is-active" /> and the <Ticks
    text="is-descendant-active" /> classes based on <Ticks
    text="router.isPathActive" /> and <Ticks text="router.isDescendantPathActive" />.</li>
  </ul>

  <Api id="Router.fallbackRoute" text="Router.fallbackRoute({to: path})" />

  <ul className="simple-list">
    <li>Creates a fallback route that redirects to the path on entering.</li>
  </ul>
</div>;
