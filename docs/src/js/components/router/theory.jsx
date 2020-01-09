import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../logo';
import Code from '../code';
import Ticks from '../ticks';

export default () => <div>
  <h2><Logo text="crizmas-router" /> - Theory</h2>

  <h4 id="the-router">The router</h4>

  <p>The router helps us react to url changes. More exactely, it allows us to react to each
  url fragment. The router is based on a configuration like this:</p>

  <Code text={`
    new Router({
      routes: [
        {
          controller: AppController,
          children: [
            {
              component: Home // empty path
            },
            {
              path: 'todos',
              component: Todos,
              children: [
                {
                  component: TodosList
                },
                {
                  path: ':todoId', // param path
                  controller: TodoController,
                  component: Todo,
                  children: [
                    {
                      path: 'edit',
                      controller: TodoEditController,
                      component: TodoEdit
                    },
                    {
                      path: '^(remove)|(delete)$', // regexp path
                      controller: TodoDeleteController,
                      component: TodoDelete // a weird view with a delete button
                    }
                  ]
                }
              ]
            },
            {
              path: '*', // fallback path
              component: TodoActionFallback
            }
          ]
        }
      ]
    });
  `} />

  <p>The objects in the router configuration are called input route fragments.
  When successfully matching a url based on the router configuration, a list of route
  fragments results. A route fragment represents an input route fragment that
  typically (but not necessarily) matches a url fragment. For instance, if the current
  url was <Ticks text="/todos" />, the list of route fragments would be:</p>

  <Code text={`
    [
      {
        path: '',
        controller: AppController
      },
      {
        path: 'todos',
        component: Todos
      },
      {
        path: '',
        component: TodosList
      }
    ]
  `} />

  <p>These three route fragments correspond to the first input route fragment in the configuration
  (with the AppController controller), its second child input route fragment (with the
  'todos' path) and its first grandchild (with the TodosList component).
  The route fragment with the 'todos' path and the one with the TodosList component would also have
  a <Ticks text="parent" /> property that would point to the previous route fragment
  in the list. This list of route fragments represents a road from a top level input
  route fragment, to an input route fragment with a component, that successfully
  matched the url.</p>

  <h4 id="input-route-fragments-paths">Input route fragments paths</h4>

  <p>There are multiple kinds of paths that input route fragments may have. First, it can
  be undefined (or the property can simply miss from the configuration). An undefined path
  is equivalent to an empty string path (empty path). The path can also be a non-empty string
  of characters (except the / character). This would be a simple path. An input route fragment
  may instead have a compound path made of multiple simple paths separated by /. A path
  that consists only of / is equivalent to an empty path. Adjacent / characters are equivalent
  to a single /. The path can also be *. This is called a fallback path.
  An input route fragment may also have a param path, if the path starts
  with : and the rest of it are characters that are part of the \w regular expression class.
  Finally, a path can start with ^ and end with $, in which case it's a regexp path. A compound
  path can also be made of param, regexp or fallback parts. Two input route fragments
  can implicitly refer to the same thing:</p>

  <Code text={`
    new Router({
      routes: [
        {
          path: 'a',
          children: [
            {
              path: 'b',
              component: () => false
            }
          ]
        },
        {
          path: 'a/b/c',
          component: () => false
        }
      ]
    });
  `} />

  <p>In this example the input route fragment with path 'a/b/c' basically says that the
  input route fragment with path 'b' has a child with path 'c'. Care must be taken when using
  empty paths:</p>

  <Code text={`
    new Router({
      routes: [
        {
          component: App,
          children: [
            {
              path: 'x',
              component: () => false
            }
          ]
        },
        {
          path: 'x/y',
          component: () => false
        }
      ]
    });
  `} />

  <p>In this example the input route fragment with path 'x/y' doesn't create a grandchild
  for the input route fragment with component App; instead, it creates a new top level input
  route fragment with path 'x' (sibling of the fragment with component App) and a child for it
  with path 'y'. This means that compound paths can not refer to input route fragments with empty
  paths.</p>

  <h4 id="input-route-fragments">Input route fragments</h4>

  <p>An input route fragment can contain a path, a component, a controller, a resolve
  function, an isCaseInsensitive option and children.
  An input route fragment must have at least either a component
  (if it has the role of displaying something) or child input route fragments.
  If an input route fragment only has children, it must also either represent an actual
  path fragment (can not be empty) or have a controller, otherwise it would be
  useless. This way we can see that a route fragment with an empty path can
  also be useful, for instance if it's meant to be used as a layout for the child
  route fragments, or if it's used as a default child route fragment
  (if it has a component), or if it has a controller as an intermedium
  between the top level route fragment and the child route fragments. The end of a matching
  road must always have a component. A fallback input route fragment cannot have children.</p>

  <h4 id="route-fragments">Route fragments</h4>

  <p>While input route framgents are just for configuration, route fragments are objects
  that are created during the matching process and which we can directly use in our
  application. A route fragment contains a path wich is the url fragment that it matched,
  or an empty string in case it didn't match a url fragment. It also contains an abstractPath,
  which is the path of the corresponding input route fragment. A parent property that points
  to the previous route fragment in the list of route fragments resulted from the matching process.
  A component which is the component from the input route fragment. A controller from the
  input route fragment. A controller object that is either the controller, in case the controller
  is an object, or an object that is created by calling the controller as a constructor.
  A router property which is the router instance that was used to create the route fragment.
  A canCaseVary property which is true if the isCaseInsensitive option from the
  input route fragment is true.
  This property can also be true even if the isCaseInsensitive option is absent in the input
  route fragment, in case it's present as a router option and it's true. In other words the
  isCaseInsensitive option at the input route fragment level overwrites the one at the router
  level. For param fragments, isCaseInsensitive is ignored, so canCaseVary is always false.
  If canCaseVary is true, it means that the route fragment can match over time paths
  that differ only by case. The path is updated every time the case of the matched path changes.
  The normalizedPath property is equal to the path if canCaseVary is false, and if canCaseVary
  is true, the normalizedPath will be the lowercase path. The urlPath will be a path made
  of all the paths of the previous route fragments and the route fragment's path itself separated
  by /. The urlPath will also be updated if the case differs over time.
  The normalizedUrlPath will be a path made of all the normalized paths of the previous
  route fragments and the route fragment's normalizedPath itself separated by /.</p>

  <h4 id="matching">Matching</h4>

  <p>When matching a URL path, all the possible matching roads are verified
  and are given a score. The score is a string resulted
  from the concatenation of the scores of the matching input route fragments. It is possible
  to have more than one matching road, for instance if two input route fragment paths
  match a url fragment, and one of them is an exact match, while the other is a
  param match. The last input route fragment in the matching road has a component (otherwise
  there is no matching road). The highest score wins.</p>

  <p>There are five possible scores per input route fragment:</p>
  <ol className="simple-list">
    <li>exact match - score 3</li>
    <li>param - score 2</li>
    <li>regular expression - score 1</li>
    <li>skipped match (if the path is the empty string) - score 0</li>
    <li>fallback match (if the path is *) - no score</li>
  </ol>

  <p>The result of the matching process is a list of route fragments. The path of a
  route fragment is either the url fragment that it matched or an empty path. If it's not
  empty it's usually a simple path with the exception of a fallback route fragment that
  can have a compound path (in case it matches a compound rest of a url).
  Matching is greedy, which means that in the matching process as many input route fragments
  as possible will be used. This means that route fragments with empty paths are
  automatically included in the result if their parent route fragment is included in the
  result (or if it doesn't have a parent). Param fragments, regexp fragments and
  fallback fragments can not be used for exact matching (e.g. a fallback fragment
  doesn't match a url fragment * with score '3', but with '').</p>

  <p>In case the root of the app is served from a URL with a certain path, we can pass a base
  path to the router so that we don't need to add the prefix to all our links (when we
  use links that start with /).</p>

  <Code text={`
    new Router({
      basePath: 'base',
      routes: [
        {
          controller: ctrl1,
          children: [
            {
              path: 'x',
              isCaseInsensitive: true,
              controller: ctrl2,
              children: [
                {
                  path: 'y',
                  controller: ctrl3,
                  component: () => false
                }
              ]
            }
          ]
        },
        {
          path: 'x/y',
          isCaseInsensitive: true,
          controller: ctrl4,
          component: () => false
        },
        {
          path: 'x/:y',
          controller: ctrl5,
          component: () => false
        },
        {
          path: '*',
          controller: ctrl6,
          component: () => false
        }
      ]
    });
  `} />

  <p>In the above example, if the url path was /base/x/y, the result would be:</p>

  <Code text={`
    [
      {
        path: 'x',
        urlPath: '/x',
        normalizedPath: 'x',
        normalizedUrlPath: '/x',
        abstractPath: 'x',
        canCaseVary: false,
        parent: null
        router: ...,
        component: undefined,
        controller: undefined,
        controllerObject: null
      },
      {
        path: 'y',
        urlPath: '/x/y',
        normalizedPath: 'y',
        normalizedUrlPath: '/x/y',
        abstractPath: 'y',
        canCaseVary: true,
        parent: ...,
        router: ...,
        component: () => false,
        controller: ctrl4,
        controllerObject: ...
      }
    ]
  `} />

  <p>The matching score would be '33'. Other candidate scores would be '033', '32' and '' (for
  the fallback input route fragment). Since '33' is the biggest score, it wins.</p>

  <p>If the url path was /base/X/y (note the uppercase X), the result would be:</p>

  <Code text={`
    [
      {
        path: '',
        urlPath: '/',
        normalizedPath: '',
        normalizedUrlPath: '/',
        abstractPath: '',
        canCaseVary: false,
        parent: null
        router: ...,
        component: undefined,
        controller: ctrl1,
        controllerObject: null
      },
      {
        path: 'X',
        urlPath: '/X',
        normalizedPath: 'x',
        normalizedUrlPath: '/x',
        abstractPath: 'x',
        canCaseVary: true,
        parent: ...
        router: ...,
        component: undefined,
        controller: ctrl2,
        controllerObject: ...
      },
      {
        path: 'y',
        urlPath: '/X/y',
        normalizedPath: 'y',
        normalizedUrlPath: '/x/y',
        abstractPath: 'y',
        canCaseVary: false,
        parent: ...,
        router: ...,
        component: () => false,
        controller: ctrl3,
        controllerObject: ...
      }
    ]
  `} />

  <p>The matching score would be '033', becase of the isCaseInsensitive option.
  The other candidate score would be ''.</p>

  <h4 id="transitioning">Transitioning</h4>

  <p>The transition process starts with the matching process. Before the best match is
  calculated, the input route fragments that are part of the candidate matching roads are
  resolved. See the <a href="#lazy-loading">Lazy loading</a> section
  for more details regarding resolving input
  route fragments. Once an input route fragment is resolved, it will never be resolved again.
  Resolving the input route fragments in the matching process is needed because if
  an input route fragment is resolvable it's possible to configure a component for it
  at a later point in time, and it's mandatory for the ends of the matching roads to have
  a component.</p>

  <p>After matching, if the new route fragments are different from the existing
  route fragments, the existing route fragments are left and are replaced by the new
  route fragments, which are entered. The route fragments that are similar to the new
  route fragments, are not replaced (and are not left). From the first route fragment that
  is replaced onwards, the route fragments are replaced. If the new route fragment is
  case insensitive and differs from an existing route fragment only by the case, then
  it's kept. Once a route fragment is left, if in the future there is a similar match,
  there will be a new route fragment created (left route fragments are never reused).</p>

  <p>Leaving/entering a route fragment involves a few steps. First, a route fragment
  can have a controller object associated. If the corresponding input route has a controller
  property, that route fragment will have the same controller property.
  This is typically an <Ticks text="Mvc.controller()" />. If the controller
  is an object, the controller object will be that object. If the controller is a function,
  it will be called as a constructor in the first step of the entering process to obtain
  the controller object. The constructor can also return a promise that will be resolved
  with the controller object. If the controller object is an observed object, it's rooted.
  After the controller object is obtained, if it has an onEnter
  method, it will be called. The onEnter method can also return a promise. While entering
  the route fragment the optional promise returned by the controller constructor and the
  optional promise returned by the onEnter method are awaited. After these optional promises
  are settled, the route fragment is pushed to the router.currentRouteFragments array.
  At this point it is said that the route fragment is entered. Leaving is the same as
  entering, except that there is no constructor involved, and the controller method that is
  called is named onLeave. This can also return a promise that will be awaited in the leaving
  process. Afterwards, the route fragment is removed from the currentRouteFragments array.
  Once the list of route fragments that will be left and the list of route fragments that
  will be entered are calculated, the route fragments are processed one by one (each of which
  waits for the previous route fragment in case there is a promise involved). The
  route fragments in the currentRouteFragments array are left from end to start and the
  new route fragments are entered from start to end. Once a
  route fragment is left, its view is unmounted. Once a route fragment is entered, its view
  is mounted. The components of child route fragments are passed as children props to the
  parent React component. In order for child components to be displayed,
  the parent components must render the children props.
  Once a route fragment is left, if its controller object is an observed
  object, it's unrooted. If you want to reuse a rooted object as a root in some other places,
  make sure you make it a child object of the rooted controller object and
  not a controller object directly.</p>

  <Code text={`
    new Router({
      routes: [
        {
          path: 'x',
          isCaseInsensitive: true,
          controller: {
            onEnter() { console.log('enter x'); },
            onLeave() { console.log('leave x'); }
          },
          children: [
            {
              path: ':y',
              controller: {
                onEnter({routeFragment}) { console.log(\`enter y \${routeFragment.path}\`); },
                onLeave({routeFragment}) { console.log(\`leave y \${routeFragment.path}\`); }
              },
              component: () => false
            }
          ]
        }
      ]
    });
  `} />

  <p>Let's assume the current url path is /x/2, which means the current route fragments look
  as follows (not all the properties are displayed):</p>

  <Code text={`
    [
      {
        path: 'x',
        normalizedPath: 'x'
        abstractPath: 'x',
        canCaseVary: true
      },
      {
        path: '2',
        normalizedPath: 2,
        abstractPath: ':y',
        canCaseVary: false
      }
    ]
  `} />

  <p>This means that the current output is:</p>

  <Code text={`
    enter x
    enter y 2
  `} />

  <p>If the url path is now changed to /X/3, the output will be:</p>

  <Code text={`
    leave y 2
    enter y 3
  `} />

  <p>Even if the case of the 'X' fragment changed, the first route fragment is not left.
  The current route fragments look like this:</p>

  <Code text={`
    [
      {
        path: 'X',
        normalizedPath: 'x'
        abstractPath: 'x',
        canCaseVary: true
      },
      {
        path: '3',
        normalizedPath: 3,
        abstractPath: ':y',
        canCaseVary: false
      }
    ]
  `} />

  <p>The transition can also be interrupted. For instance, a route fragment can refuse
  to enter if its controller either returns false from its onEnter method or it returns
  a promise fulfilled with false. In this case, if the controller object is an observed
  object, it's unrooted right away. At this point the browser URL is also updated to match the
  last route fragment's urlPath. Similarly, a route fragment can refuse to leave. A transition
  can also be interrupted by initiating a new transition, either synchronously from a
  controller constructor or an onEnter
  or onLeave hook, or if the transition is asynchronous (it involves at least a promise),
  from outside a route fragment, for instance by clicking a new link in the
  view. While often an application displays an overlay while transitioning so that the transition
  can not be interrupted, the router must have a predictable and consistent behavior even
  when interruptions occur. Beside the controller constructor, the onEnter and onLeave hooks,
  there is another point in an asynchronous transition that allows for interruptions,
  namely when resolving input route fragments. After handling a transition, the router
  triggers a urlHandle event. However, since the router doesn't change its state (except for
  its isTransitioning property) while resolving input route fragments, if the transition is
  interrupted at that point the urlHandle event is not triggered. It is certain that
  the next transition will start after the current promise that is awaited in the
  current transition is settled (in other words the next transition is put on hold).
  If more transitions are initiated while the router is transitioning,
  only the last transition will happen.</p>

  <p><Ticks text="router.isTransitioning" /> is true while a transition takes place.</p>

  <p>A transition can be made with a boolean replace option. If replace is true,
  the current entry in the browser history is replaced with the new URL. Note that
  if the browser URL is the same as the transition URL when the transition is initiated,
  there won't be a new entry in the history (and therefore, if the replace option
  is passed, the current entry will not be replaced). This option is especially
  useful when the URL is changed, but one of the route fragments refuses to leave/enter.
  If at this point the currentRouteFragment.urlPath is different from the current
  browser URL path, there will be a new transition initiated so that the browser
  URL is updated (to match the current state of the router). This means that a new entry
  in the history is created. However we might not want to keep the previous URL
  (for which the transition was interrupted) in the history. In this case, we can initiate
  a new transition from the onLeave/onEnter method of the route fragment that refused
  to leave/enter, with the currentRouteFragment.urlPath (which is the most recently
  entered route fragment) and pass the replace option. In other words, the transition
  for updating the browser URL (when a route fragment refuses to leave/enter and the
  currentRouteFragment.urlPath is different from the browser URL path) is initiated
  only if there is no other transition put on hold. Note that if the transition is
  interrupted by refusing to leave/enter and a new transition is initiated to
  update the browser URL, the same replace option that was used for the initial
  transition will be used. The refresh (see below) can also receive a replace option,
  but in that case it's only useful if during a transition there is a new
  transition initiated with a different URL, which is put on hold, and then there
  is a refresh. The refresh URL will be the current transition's URL, but if we
  want to replace the history entry for the transition that was put on hold, we have
  to use the replace option. However it's possible for multiple transitions
  to be initiated in between and so to have more entries in the history.
  The replace option can be used to replace a single entry in the history.
  This means that most of the time it would be wiser to display an overlay
  to prevent creating more entries in the history during an async transition
  by clicking multiple links.</p>

  <h4 id="refresh">Refresh</h4>

  <p>The refresh is a special kind of transition. Both the router and route fragments
  have a refresh method. Refreshing needs a route fragment where the refresh starts.
  In case the router's method is used with no arguments,
  the refresh route fragment will be the first
  route fragment in the list of current route fragments. Refreshing means that a new
  transition occurs, with the current url of the router, in which the route fragments
  starting with the refresh route fragment are left (this still allows route fragments
  to refuse to leave/enter). This is different from a regular transition in that in
  a regular transition route fragments are kept (and not left) in case of a similar match.</p>

  <h4 id="router-manager">Router manager</h4>

  <p>A router is also a router manager, meaning that it has methods for managing
  its input route fragments. This means that routes can be dynamically added, removed
  and listed at any point in time. In case of a refresh or transition with a similar url,
  if the input route fragment is removed, the corresponding route fragment that would
  have normally been reused (and the route fragments onwards) are left
  (but they can still refuse to leave).</p>

  <h4 id="lazy-loading">Lazy loading</h4>

  <p>Modern frameworks allow for code splitting so that parts of the code are downloaded
  on the client only when the user enters the route to which the code is relevant.
  The input route fragment can have a <Ticks text="resolve" /> function
  used for configuring the input route fragment or its children asynchronously.
  The function must return a promise fulfilled with an object that
  can contain a component, a controller or an array of children configuration
  objects. A child configuration object must also contain the abstract path
  or a compound path, used to identify the child input route fragments.</p>

  <Code text={`
    new Router({
      routes: [
        {
          path: 'x',
          resolve: async () => ({
            component: (await import('x-component.js')).default,
            controller: (await import('x-controller.js')).default,
            children: [
              {
                component: (await import('x-empty-path-child-component.js')).default
              },
              {
                path: 'y/z',
                component: (await import('z-component.js')).default
              }
            ]
          }),
          children: [
            {
              controller: {
                onEnter() { console.log('entered child with empty path'); }
              }
            },
            {
              path: 'y',
              children: [
                {
                  path: 'z'
                }
              ]
            }
          ]
        }
      ]
    });
  `} />

  <p>Note that in this case, because the matching is greedy, for url path /x, if the resolving
  process ends normally, the output will be 'entered child with empty path'.</p>

  <h4 id="observed-controller-objects">Observed controller objects</h4>

  <p>If the controller is an observed constructor and we want to track the pending state
  of the resulted observed controller object and we want to initiate some pending operations
  when entering the route fragment, the recommended way of doing that is to initiate the
  operations in the onEnter method because the controller object becomes observed by default
  only after the constructor call has finished and therefore if the operations are initiated
  in the constructor call, the resulted object will not be pending. Since the onEnter method
  is called after the controller object is obtained, initiating pending operations in it has
  the expected effect. Another more verbose solution would be to observe the controller
  object (including its methods), explicitly in the constructor before
  initiating the pending operations.</p>

  <h4 id="handling-async-errors">Handling async errors</h4>

  <p>In order to catch errors that are thrown during an async transition (caused for instance by
  an async route controller constructor, a resolve function, an async onEnter etc.) you can use
  the onAsyncError function and pass an error handler. You can use this as an opportunity to log
  the error. In this case the promises that are involved are considered handled (so there won't be
  any 'unhandledrejection' events) and the error is not propagated any further. Note that
  at this point the router is unstable (for instance router.isTransitioning remains true).</p>

  <p>Head over to the <Link to="/router/api">API</Link> section for more details.</p>
</div>;
