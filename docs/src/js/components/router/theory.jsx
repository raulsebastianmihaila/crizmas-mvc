import React from 'react';
import {Link} from 'crizmas-router';

import Logo from 'js/components/logo';
import Code from 'js/components/code';
import Ticks from 'js/components/ticks';

export default () => <div>
  <h2><Logo text="crizmas-router" /> - Theory</h2>

  <p><Logo text="crizmas-router" /> was inspired by <a
  href="https://www.npmjs.com/package/react-router" target="_blank">React Router</a>.</p>

  <h4 id="route-fragments">Route fragments</h4>

  <p>The router is based on route fragments. A route fragment is an object that
  describes what should happen with regard to a path fragment. A path fragment is
  a non-empty part of a URL path (typically delimited by forward slashes).
  A route fragment has an abstract path that typically
  represents an actual path fragment. But it's also possible that the abstract
  path is an empty string, if it doesn't represent an actual path fragment, or the
  * character, in the case of a fallback route fragment which represents any
  possible list of path fragments. An empty abstract path can represent an empty
  URL path.
  Matching a URL path results
  in a tree of route fragments with
  typically multiple possible roads from the root of the tree to the leaves.
  The road with the highest score wins.
  A route fragment must have at least either a component (if it has the role of displaying
  something) or child route fragments. If a route fragment only has children,
  it must also either represent an actual path fragment or have a controller,
  otherwise it would be useless.
  This way we can see that a route fragment with an empty abstract path can also be useful,
  for instance if it's meant to be used as a layout for the child route fragments, or
  if it's used as a default child route (if it has a component), or
  if it has a controller as an intermedium between the root and the child route fragments.
  The leaf of a matching road must always have a component.
  A fallback route cannot have children.</p>

  <h4 id="matching">Matching</h4>

  <p>When matching a route, the abstract path of a route fragment can be used in
  one of five ways:</p>
  <ol className="simple-list">
    <li>exact match - score 3</li>
    <li>param - score 2</li>
    <li>regular expression - score 1</li>
    <li>skipped match (if the abstract path is the empty string) - score 0</li>
    <li>fallback match (if the abstract path is *) - no score</li>
  </ol>

  <p>When matching a URL path, all the possible matching roads are verified
  and are given a score. The score is a string resulted
  from the concatenation of the scores of the matching route fragments. It is possible
  to have more than one matching roads, for instance if two abstract paths
  match a path fragment, and one of them is an exact match, while the other is a
  param match. The highest score wins. Entering a route means entering the route
  fragments that form the matching road, in root to leaf order.</p>

  <h4 id="example">Example</h4>

  <Code text={`
    const router = new Router({
      basePath: 'example-app',
      routes: [
        {
          component: Home
        },
        {
          path: 'todos',
          component: Todos,
          children: [
            {
              component: TodosList
            },
            {
              path: ':todoId',
              controller: TodoController,
              component: Todo,
              children: [
                {
                  path: 'edit',
                  controller: TodoEditController,
                  component: TodoEdit
                },
                {
                  path: '*',
                  component: TodoActionFallback
                }
              ]
            }
          ]
        },
        {
          path: 'todos/deleted',
          component: DeletedTodos
        },
        {
          path: 'rare-route',
          resolve: function () {
            return Promise.resolve({
              component: RareLayout,
              children: [
                {
                  component: RareDefaultPage
                },
                {
                  path: 'child-route',
                  children: [
                    {
                      path: 'grandchild-route',
                      component: GrandchildPage
                    }
                  ]
                },
                {
                  path: 'child-route/grandgrandchild-route',
                  component: GrandgrandchildPage
                }
              ]
            });
          },
          children: [
            {
              controller: RarePageController
            },
            {
              path: 'child-route',
              children: [
                {
                  path: 'grandchild-route'
                },
                {
                  path: 'grandgrandchild-route'
                }
              ]
            }
          ],
        },
        {
          path: '*',
          component: NotFound
        }
      ]
    });
  `} />

  <p>In case the root of the app is served from a URL with a certain path, we can pass a base
  path to the router so that we don't need to add the prefix to all our links (when we
  don't use relative links that don't start with <Ticks text="/" />).</p>

  <p>The configuration for a route fragment can contain a path (that defaults to the
  empty string, extraneous forward slashes being discarded), a controller,
  a component, children and a resolve function.</p>

  <p>The path can be formed of
  multiple path fragments separated by forward slashes, from which a route
  fragment results for each path fragment.
  A compound path cannot represent a route fragment with an empty abstract path.
  So even though <Ticks text="todos" /> has a child route fragment with an empty
  abstract path (whose component is <Ticks text="TodosList" />), the route fragment <Ticks
  text="deleted" /> (represented by the path <Ticks text="todos/deleted" />) is
  a direct child of <Ticks text="todos" />. When matching, the abstract path is first
  checked as an exact match. If that fails, if it starts with <Ticks text=":" />, and the rest
  of it are characters that are part of the <Ticks text="\w" /> regular expression class,
  the abstract path is considered a URL parameter, whose name is the abstract path and
  whose value is the actual decoded (using <Ticks text="decodeURIComponent"/>) URL path fragment.
  If the abstract path doesn't start with
  a colon, the match is tried transforming the abstract path in a regular expression
  that starts with <Ticks text="^" /> and ends with <Ticks text="$" /> (so those shouldn't
  be part of the abstract path). The matching is greedy, which means that as many
  empty abstract paths as possible are matched (skipped). So, having a path like <Ticks
  text="/example-app/todos" /> results in rendering the <Ticks
  text="TodosList" /> component. However, if the route fragment with an empty
  abstract path didn't have a component, it wouldn't be entered. (In this case it would
  need to have children, and it would be entered only when one of its children matched
  the URL path.) A URL path like <Ticks text="/example-app/todos/123/create" /> is
  matched by the route fragment with the <Ticks text="TodoActionFallback" /> component. A path
  that is not matched by any other roads, is matched by the route fragment with
  the <Ticks text="NotFound" /> component.</p>

  <p>The components of child route fragments are passed as <Ticks text="children" /> props
  to the parent React components. In order for child components to be displayed, the parent
  components must render the <Ticks text="children" /> props.</p>

  <p>The controller can be an object or a function,
  which is constructed right before the route fragment is entered. The controller is
  typically an <Ticks text="Mvc.controller" />. If the controller is an observed
  object or if the controller function returns an observed object upon construction,
  the object is rooted and when the route fragment is left, the object is unrooted.
  If you want to reuse a rooted object as a root is some other places, make sure you make it
  a child object of the rooted controller object and not a controller object directly.</p>

  <h4 id="lazy-loading">Lazy loading</h4>

  <p>Modern frameworks allow for code splitting so that parts of the code are downloaded
  on the client only when the user enters the route to which the code is relevant.
  The route fragment configuration can have a <Ticks text="resolve" /> function
  used for configuring the route fragment or its children asynchronously.
  The function must return a promise fulfilled with an object that
  can contain a component, a controller or an array of children configuration
  objects. A child configuration object must also contain the abstract path
  or a compound path, used to identify the child route fragments.</p>

  <h4 id="transitioning">Transitioning</h4>

  <p>The promise returned by the resolve function that is potentially called
  is awaited before the route fragment is entered.
  A route fragment controller function can return a promise that is fulfilled
  with the controller object. The promise is awaited before the route fragment is entered.
  If there is a controller (either an object directly
  passed in the configuration or resulted from calling the controller constructor) and
  if it has an <Ticks text="onEnter" /> method, it is called. This method can return a promise that
  will be awaited before the route is entered. If the method returns false or if the
  promise is fulfilled with false, the route fragment will not be entered, and the
  parent route fragment remains the current route fragment. Also it's possible
  to initiate a new transition from the onEnter method, or from outside while the eventual
  promise returned by onEnter is being settled. In this case, after the
  onEnter method is called (or after the eventual promise returned by it is settled),
  irrespective of the result, the current transition
  is stopped and the new transition begins. If there are multiple transitions
  initiated, the last one wins and the others are discarded.
  If the controller object is an observed object, it's rooted before onEnter is called.
  If onEnter returns false (or the returned promise is fulfilled with false), the
  controller object is unrooted right away.
  The controller can also have an <Ticks text="onLeave" /> method.
  This method is treated similar to onEnter and if it returns false
  (or the promise is fulfilled with false) the route fragment is not left.</p>

  <p>If the controller is an observed constructor and we want to track the pending state
  of the resulted observed controller object and we want to initiate some pending operations
  when entering the route fragment, the recommended way of doing that is to initiate the
  operations in the onEnter method because the controller object becomes observed by default
  only after the constructor call has finished and therefore if the operations are initiated
  in the constructor call, the resulted object will not be pending. Since the onEnter method
  is called after the controller object is obtained, initiating pending operations in it has
  the expected effect. Another more verbose solution would be to observe the controller
  object, as well as the functions, explicitly in the constructor before
  initiating the pending operations.</p>

  <p>It's possible for a route that is intended to be matched based on a regular expression
  to be matched exactely. In this case the match is probably unexpected and so it would
  be a good idea to check in onEnter if the <Ticks text="path" /> and <Ticks
  text="abstractPath" /> properties of the route fragment have the same value.</p>

  <p><Ticks text="router.isTransitioning" /> is true while a transition takes place.</p>

  <p>Head over to the <Link to="/router/api">API</Link> section for more details.</p>
</div>;
