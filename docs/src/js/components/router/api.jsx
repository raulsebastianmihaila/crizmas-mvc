import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../logo';
import Api from '../api';
import Ticks from '../ticks';

export default () => <div>
  <h2><Logo text="crizmas-router" /> - API</h2>

  <p>Make sure you check the <Link to="/router">getting started</Link> and <Link
  to="/router/theory">theory</Link> sections before jumping into API details.</p>

  <Api
    id="Router"
    text={`
      import Router from 'crizmas-router';
      // in ES5, Router is window.crizmas.Router

      const router = new Router({
        basePath: 'base-path',
        isCaseInsensitive: true,
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
    <li>The isCaseInsensitive property is optional and it defaults to false. It can be
    overwritten at an input route fragment level.</li>
    <li>The router is also a router manager for the top level of the configuration.</li>
    <li>The path is optional and defaults to the empty string.</li>
    <li>The path can be a compound path.</li>
    <li>If the path starts with a colon and the rest of the characters match the <Ticks
    text="/\w/" /> regular expression class, a param is created.</li>
    <li>If the path has a length greater than 2 and it starts with <Ticks text="^" /> and
    ends with <Ticks text="$" />, then it will be used as a regexp when matching.</li>
    <li>The path can be <Ticks text="*" /> in which case it matches anything.</li>
    <li>The controller is optional and can be an object or a function that is constructed to
    create the controller object, before the route fragment is entered.</li>
    <li>The controller function can return a promise that is fulfilled with the controller
    object.</li>
    <li>If the controller object is an observed object, it is rooted before the route fragment
    is entered and unrooted when the route fragment is left.</li>
    <li>The component is a React component. It's optional and it receives <Ticks
    text="controller" /> and <Ticks text="routeFragment" /> as props.</li>
    <li>An input route fragment must have either a component or children.</li>
    <li>An input route fragment with no component must have either a non-empty
    path or a controller.</li>
    <li>An input route fragment can have a resolve function that is used to update its
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

  <Api id="router.basePath" text="router.basePath" />

  <ul className="simple-list">
    <li>The router's base path.</li>
  </ul>

  <Api id="router.isCaseInsensitive" text="router.isCaseInsensitive" />

  <ul className="simple-list">
    <li>The router's isCaseInsensitive option.</li>
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
    <li>The values are decoded using <Ticks text="decodeURIComponent"/>.</li>
  </ul>

  <Api id="router.isTransitioning" text="router.isTransitioning" />

  <ul className="simple-list">
    <li>It's true as long as there is a transition in progress.</li>
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

  <Api id="router.isMounted" text="router.isMounted" />

  <ul className="simple-list">
    <li>It's true if the router is mounted (it's listening for URL changes).</li>
  </ul>

  <Api id="router.transitionTo" text="router.transitionTo(path, { replace })" />

  <ul className="simple-list">
    <li>Initiates a transition.</li>
    <li>The second argument is optional.</li>
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

  <Api id="router.refresh" text={'router.refresh({ routeFragment = router.currentRouteFragments[0],'
    + ' replace })'} />

  <ul className="simple-list">
    <li>Initiates a refresh starting with the specified route fragment.</li>
    <li>The argument is optional (the default route fragment is
    router.currentRouteFragments[0]).</li>
    <li>The route fragment must be part of router.currentRouteFragments.</li>
    <li>The router must be mounted.</li>
  </ul>

  <Api id="router.onBeforeChange" text="router.onBeforeChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Attaches listeners that are called before transitioning (if at least one route
    fragment will be left or entered).</li>
    <li>Cb is called with an object <Ticks text={`{
      router, currentRouteFragment, targetRouteFragment
    }`} /></li>
  </ul>

  <Api id="router.offBeforeChange" text="router.offBeforeChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Removes onBeforeChange listeners.</li>
  </ul>

  <Api id="router.onSearchChange" text="router.onSearchChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Attaches listeners that are called when the search params are changed.</li>
    <li><Ticks text="x=1&y=2" /> is equal to <Ticks text="y=2&x=1" /> but <Ticks
    text="x=1&x=2" /> is different from <Ticks text="x=2&x=1" />.</li>
    <li>Cb is called with an object <Ticks text={`{
      router, currentRouteFragment, targetRouteFragment, oldSearchParams, newSearchParams
    }`} /></li>
    <li>In case of a route transition, the callbacks are called after the
    onBeforeChange callbacks and before any route fragments are left or entered.</li>
    <li>If an asynchronous transition is interrupted while the input route fragments
    are being resolved, the callbacks are not called.</li>
  </ul>

  <Api id="router.offSearchChange" text="router.offSearchChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Removes onSearchChange listeners.</li>
  </ul>

  <Api id="router.onChange" text="router.onChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Attaches listeners that are called after transitioning (if at least one route
    fragment will be left or entered).</li>
    <li>Cb is called with an object <Ticks text={`{
      router, currentRouteFragment, oldRouteFragment
    }`} /></li>
  </ul>

  <Api id="router.offChange" text="router.offChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Removes onChange listeners.</li>
  </ul>

  <Api id="router.onUrlHandle" text="router.onUrlHandle(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Attaches listeners that are called after a url is handled.</li>
    <li>If at least one route fragment is entered or left, the callbacks are called
    after the onChange callbacks.</li>
    <li>Cb is called with an object <Ticks text={`{
      oldUrl, newUrl, router
    }`} /></li>
    <li>If an asynchronous transition is interrupted while the input route fragments
    are being resolved, the callbacks are not called.</li>
  </ul>

  <Api id="router.offUrlHandle" text="router.offUrlHandle(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Removes onUrlHandle listeners.</li>
  </ul>

  <Api id="router.onAsyncError" text="router.onAsyncError(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Attaches listeners that are called when an error is caught during an async transition
    (caused by any means, for instance an async route controller constructor, a resolve function,
    an async onEnter hook etc.).</li>
    <li>The router is unstable at this point.</li>
    <li>The promises that are involved are considered handled (so there won't be any
    'unhandledrejection' events). Also the error is not propagated any further.</li>
  </ul>

  <Api id="router.offAsyncError" text="router.offAsyncError(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Removes onAsyncError listeners.</li>
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

  <Api id="router.list" text="router.list()" />

  <ul className="simple-list">
    <li>See <a href="#routerManager.list">routerManager.list()</a></li>
  </ul>

  <Api id="router.get" text="router.get(path)" />

  <ul className="simple-list">
    <li>See <a href="#routerManager.get">routerManager.get(path)</a></li>
  </ul>

  <Api id="router.has" text="router.has(path)" />

  <ul className="simple-list">
    <li>See <a href="#routerManager.has">routerManager.has(path)</a></li>
  </ul>

  <Api id="router.add" text="router.add([path,] inputRouteFragment)" />

  <ul className="simple-list">
    <li>See <a href="#routerManager.add">routerManager.add([path,] inputRouteFragment)</a></li>
  </ul>

  <Api id="router.remove" text="router.remove(path)" />

  <ul className="simple-list">
    <li>See <a href="#routerManager.remove">routerManager.remove(path)</a></li>
  </ul>

  <Api id="routeFragment.path" text="routeFragment.path" />

  <ul className="simple-list">
    <li>The actual path that is represented.</li>
    <li>If canCaseVary is true and the route fragment matches a new path that differs by case,
    the path is updated.</li>
  </ul>

  <Api id="routeFragment.normalizedPath" text="routeFragment.normalizedPath" />

  <ul className="simple-list">
    <li>It's the same as routeFragment.path if routeFragment.canCaseVary is false and
    routeFragment.path.toLowerCase() otherwise.</li>
  </ul>

  <Api id="routeFragment.abstractPath" text="routeFragment.abstractPath" />

  <ul className="simple-list">
    <li>The abstract path.</li>
  </ul>

  <Api id="routeFragment.urlPath" text="routeFragment.urlPath" />

  <ul className="simple-list">
    <li>The concatenation of the actual paths separated by <Ticks
    text="/" /> starting from the root until the route fragment.</li>
    <li>If canCaseVary is true and the route fragment matches a new path that differs by case,
    the urlPath is updated. Or if any of its ascendants have canCaseVary true and their
    urlPaths are updated, the urlPath is updated.</li>
  </ul>

  <Api id="routeFragment.normalizedUrlPath" text="routeFragment.normalizedUrlPath" />

  <ul className="simple-list">
    <li>The concatenation of the normalized paths separated by <Ticks
    text="/" /> starting from the root until the route fragment.</li>
  </ul>

  <Api id="routeFragment.canCaseVary" text="routeFragment.canCaseVary" />

  <ul className="simple-list">
    <li>It's the same as the isCaseInsensitive option on the input route fragment. If the
    isCaseInsensitive at the input route fragment level is missing, then it's the same as
    the isCaseInsensitive option at the router level.</li>
    <li>If the route fragment is a param fragment, then canCaseVary is always false.</li>
    <li>If canCaseVary is true, it means that the route fragment can match over time paths
    that differ only by case.</li>
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

  <Api id="routeFragment.router" text="routeFragment.router" />

  <ul className="simple-list">
    <li>The router used to create the route fragment.</li>
  </ul>

  <Api id="routeFragment.onSearchChange" text="routeFragment.onSearchChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Attaches listeners that are called when the search params are changed, but only
    after the route fragment was entered and until the route fragment is left (if the
    route fragment is going to be left in the current transition the callbacks
    are not called).</li>
    <li><Ticks text="x=1&y=2" /> is equal to <Ticks text="y=2&x=1" /> but <Ticks
    text="x=1&x=2" /> is different from <Ticks text="x=2&x=1" />.</li>
    <li>Cb is called with an object <Ticks text={`{
      router, currentRouteFragment, targetRouteFragment, oldSearchParams, newSearchParams
    }`} /></li>
    <li>The callbacks are called after the router.onSearchChange callbacks and before
    any route fragments are left or entered, in the router.currentRouteFragments order.</li>
    <li>If an asynchronous transition is interrupted while the input route fragments are being
    resolved, the callbacks are not called.</li>
  </ul>

  <Api id="routeFragment.offSearchChange" text="routeFragment.offSearchChange(cb)" />

  <ul className="simple-list">
    <li>The cb must be a function.</li>
    <li>Removes onSearchChange listeners.</li>
  </ul>

  <Api id="routeFragment.refresh" text="routeFragment.refresh({ replace })" />

  <ul className="simple-list">
    <li>The argument is optional.</li>
    <li>
      Equivalent to <Ticks text="routeFragment.router.refresh({ routeFragment, replace })" />.
    </li>
  </ul>

  <Api id="routerManager.list" text="routerManager.list()" />

  <ul className="simple-list">
    <li>Returns a list of paths of the input route fragments at the current level.</li>
  </ul>

  <Api id="routerManager.get" text="routerManager.get(path)" />

  <ul className="simple-list">
    <li>Returns a router manager for the specified path level.</li>
    <li>The path can be compound.</li>
    <li>If the path doesn't exist it returns undefined.</li>
  </ul>

  <Api id="routerManager.has" text="routerManager.has(path)" />

  <ul className="simple-list">
    <li>Returns true if the path exists and false otherwise.</li>
    <li>The path can be compound.</li>
  </ul>

  <Api id="routerManager.add" text="routerManager.add([path,] inputRouteFragment)" />

  <ul className="simple-list">
    <li>If a path is not passed, adds a new input route fragment at the current level.</li>
    <li>If the path is passed, adds a new input route fragment at the specified path level.</li>
    <li>If the path is passed it must exist.</li>
    <li>The path can be compound.</li>
    <li>Returns the router manager at the current level.</li>
  </ul>

  <Api id="routerManager.remove" text="routerManager.remove(path)" />

  <ul className="simple-list">
    <li>Removes the input route fragment found at the specified path.</li>
    <li>The path must exist.</li>
    <li>The path can be compound.</li>
    <li>Returns the router manager at the current level.</li>
  </ul>

  <Api id="Link" text={`
    import {Link} from 'crizmas-router';
    // in ES5, Link is window.crizmas.Router.Link

    <Link to={path} replace>link text</Link>
  `} />

  <ul className="simple-list">
    <li>The result is an anchor.</li>
    <li>The anchor is adorned with the <Ticks text="is-active" /> and the <Ticks
    text="is-descendant-active" /> classes based on <Ticks
    text="router.isPathActive" /> and <Ticks text="router.isDescendantPathActive" />.</li>
    <li>The <Ticks text="to" /> prop should contain only the path, search and hash of a URL.</li>
    <li>The <Ticks text="replace" /> prop is optional.</li>
    <li>Accepts a <Ticks text="className" /> prop.</li>
  </ul>

  <Api
    id="Router.fallbackRoute"
    text="Router.fallbackRoute({ path: matchingPath, to: path, replace })" />

  <ul className="simple-list">
    <li>Creates a fallback route that redirects to the path on entering.</li>
    <li>The (matching) path is optional and defaults to the fallback path.</li>
    <li>The <Ticks text="replace" /> property is optional.</li>
  </ul>
</div>;
