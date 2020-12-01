import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../logo';
import Ticks from '../ticks';
import Code from '../code';

export default () => <div>
  <h2 id="introduction">Theory</h2>

  <p>The modern front-end frameworks represent an important step in the evolution of web
  development. One of the important aspects that they take care of for us effectively is
  the view, in terms of rendering and updating. We believe that today it's pretty easy
  to build a framework on top of the React library or something alike. So, we have the view
  component covered.</p>

  <p>Since the domain logic is the core of the application, <Logo /> doesn't touch it and this
  allows for great flexibility.</p>

  <p>So, the magical part is the controller. Behind the scenes it updates the view whenever
  something happens. In order for this to be true, whatever happens must go through the controller.
  In other words, whenever we want something to happen, we must call a controller method.
  This also prevents the model from being interacted with in an inappropriate manner.</p>

  <h4 id="observing">Observing</h4>

  <p>This mechanism is based on an observation instrument: <Ticks text="Mvc.observe()" />.
  This instrument allows us to observe
  functions, objects and promises (or thenables). A function is observed in the sense that
  whenever it's called
  some observation hooks are triggered, which causes the view to be updated. An object is
  observed in the sense that its own methods are observed. Observing a function also implies that if
  it returns a promise, the promise is observed. That means that when the promise is settled,
  the observation hooks are triggered. A typical function is also constructible. When an
  observed function
  is constructed, the resulted object is observed. An interesting fact is that if the constructor
  returns a promise, it is observed, and if the promise is fulfilled with an observable value,
  that value is observed. However, the same is not true for a normal function call (when the
  function is not called as a constructor). The value that the promise is fulfilled with in this
  case is not observed. It's important to note that even though promises are objects, they
  are treated differently and we don't observe their methods. Since a function is also an object,
  it's also being observed as a normal object is. This allows us to observe static methods.
  Also its prototype data property is observed.
  Therefore <Logo /> allows multiple ways of writing a controller. It can be either an object,
  a class or a plain old constructor function. (<Ticks text="Mvc.controller()" /> is like <Ticks
  text="Mvc.observe()" /> but it doesn't accept promises or thenables.)</p>

  <p>While modern front-end frameworks make it hard to imagine development today without them,
  it still feels that there are some missing treats they could provide. One of these things is
  managing asynchronous state. Many times developers have to implement ad hoc mechanisms for
  displaying a loader or blocking a button during a pending operation. <Logo /> makes this a piece
  of cake.</p>

  <p>A method is pending in relation to an object in the sense that it returned a promise and
  the reactions to that promise that manage the async state of the observed object have not yet been
  triggered. The observed method doesn't need to be an own method, it just needs to be called
  as a method of the object (even using <Ticks text="call" /> or <Ticks text="apply" />).
  An observed object is decorated with a <Ticks text="pending" /> property.
  Its value is an object with a <Ticks text="has" /> method.
  When an observed method <Ticks text="pendingOperation" /> returns a promise in relation
  to the observed object,
  until the promise reactions are triggered, <Ticks
  text="pending.has('pendingOperation')" /> is <Ticks text="true" />.
  It's possible that an observed function
  resulted from observing an object, since observing an object means observing its own methods.
  An observed function has a key (a truthy value, usually a string or symbol) associated with it.
  If the function results from observing an object, the key is the method's key.
  If a function is observed independently, <Ticks text="Mvc.observe()" /> can
  receive a key for the function which will become the
  associated key. This is especially useful when having two objects that share the same observed
  method, but this method has two different keys in the respective objects. Therefore the method
  will have a single key associated, which is the key that was used when the method was observed.
  So, the argument to <Ticks text="has" /> must be the associated key. If the function doesn't
  have an associated key, it cannot be pending in relation to an object.</p>

  <p><Ticks text="Mvc.observe()" /> can also receive a <Ticks text="preventApply" /> option.
  If the argument to <Ticks text="Mvc.observe()" /> is a function and this option is passed,
  the resulted observed function can only be called as a constructor.
  This is useful when it's clear that the function is a constructor whose purpose is to create
  observed objects. This option is used internally by <Ticks
  text="Mvc.controller()" /> and <Ticks text="Mvc.root()" /> (see below).</p>

  <h4 id="managing-objects">Managing objects</h4>

  <p><Logo /> also helps managing the pending state of observed trees of objects.
  An observed tree of objects is a tree of objects that has a root. A root is an observed
  object marked as root using <Ticks text="Mvc.root()" />.
  Beside the <Ticks text="pending" /> property, an observed object
  is also decorated with an <Ticks text="isPending" /> property.
  An observed object is managed (in the sense that its pending state is managed) only while
  it's part of an observed tree. In this case, an observed object is pending while any of
  the observed methods is pending in relation to it or while any of its direct or indirect
  observed child objects is pending. The child observed objects of an observed object are
  its child (descendants at any level) objects that are already observed when the object
  is observed the first time.
  There is also an API for adding new child observed objects and removing them.
  Normally you shouldn't have to deal with marking
  objects as roots because most probably you will also use the <Link
  to="/router">router</Link>, which takes care of this.
  Note that only managing the value of the <Ticks text="isPending" /> property requires
  the object to be part of a managed tree; managing the state of the <Ticks
  text="pending" /> property doesn't have this requirement. This is because <Ticks
  text="isPending" /> depends on the state of the children, while <Ticks
  text="pending" /> doesn't.</p>

  <p>Even if methods are also objects, they are not considered child objects, because
  functions can be called as methods of objects even without being own or inherited methods.
  Pending methods can be seen as pending operations, while pending objects can be seen as trees of
  objects that have pending operations connected to them.</p>

  <p>Why is it important to mark the roots? Since the pending state of an object depends
  on the state of its child objects, whenever the state of an object is updated, the
  upstream of the tree needs to be updated as well. Therefore we need to somehow hold
  a reference to the upstream, so we mark the roots.
  An alternative to holding references to the roots would have been
  for each object to hold references to its parents. However, if an object is shared by
  trees A and B, and we wanted the root of A to be garbage collected when there are no other
  references to it except from its children, it could not be gc-ed
  because tree B would continue to reference
  one of tree A's descendants, which in return references directly or indirectly the root of tree A.
  Even if Javascript had weak references (which it doesn't)
  or if weak sets were iterable (which they
  aren't) there would have still been cases where manually setting the bindings to null was
  needed (in our example, the binding whose value is the root of tree A).
  For instance if the root of a tree is exported by a module, unless that binding's value
  is changed from inside the module, the object cannot be garbage collected because later on it's
  possible that the module is imported again, and since modules are singletons, the same
  instance must be exported. An even more daunting example is a default export (with the
  local name <Ticks text="*default*" />, meaning that it can't be referenced directly from
  inside the module) whose value is a plain old object, because it cannot be changed from inside
  the module (meaning that the object in this case can never be garbage collected).
  Therefore if we want to stop managing a tree
  of objects, we need a mechanism for this: <Ticks text="Mvc.unroot()" />.
  We must always call this function when we're done with a tree.
  Of course, we can unroot a tree even if we don't care about garbage collection, but simply don't
  want to manage the tree anymore.
  But couldn't we
  manage all the objects by default, without marking them as roots, and unroot them when
  we want to stop managing them? Sure, but what should happen when a parent is unrooted, should
  the children continue to be managed? They shouldn't (and they don't) because then unmanaging
  a tree of objects would require to explicitly unroot every object in the tree.
  So, when we unroot an object, the entire tree becomes unmanaged. There is also the case where
  we want an object to continue to be managed even when all the trees that it's part of
  are unrooted. In this
  case we can simply root the object, because unrooting a parent only stops managing the parent
  and normal observed child objects, not root child objects. So, instead of three kinds of
  managed objects: implicit roots, normal observed objects and explicit roots, it's better to
  have only two: explicit roots and normal observed objects.
  Also, since we can move objects around, it's easier to identify the roots by reading
  the code if they are explicitly marked as such or if we have conventional points in the
  code for rooting and unrooting (as we do with the <Link to="/router">router</Link>). (It might
  be worth pointing out that if a root is referenced only by its child observed descendants,
  then if the children are garbage collected, then the root is garbage collected as well and
  it doesn't need to be unrooted anymore just to prevent leaks.)</p>

  <h4 id="example">Example</h4>

  <p>Let's look at a simple example. For the sake of simplicity, we're not using a router and
  we're just importing the controller in the page component (which is not recommended).</p>

  js/controller/test-controller.js
  <Code text={`
    import Mvc from 'crizmas-mvc';

    export default Mvc.root({
      child: Mvc.observe({
        childOperation() {
          return {
            then(resolve) {
              setTimeout(resolve, 1000);
            }
          };
        }
      }),

      firstOperation() {
        return new Promise(resolve => {
          setTimeout(resolve, 2000);
        });
      },

      secondOperation() {
        return new Promise(resolve => {
          setTimeout(resolve, 4000);
        });
      }
    });
  `} />

  js/components/test-page.jsx
  <Code text={`
    import React from 'react';

    import controller from 'js/controllers/test-controller';

    export default () => <div>
      {controller.isPending && <div>An operation is pending.</div>}

      {controller.pending.has('secondOperation') && <div>The second operation is special, so while
        it's pending we're displaying this text.</div>}

      {controller.child.isPending && <div>Child is pending.</div>}

      <button onClick={() => controller.firstOperation()}
        disabled={controller.isPending}>first operation</button>
      <button onClick={() => controller.secondOperation()}
        disabled={controller.isPending}>second operation</button>
      <button onClick={() => controller.child.childOperation()}
        disabled={controller.isPending}>child operation</button>
      <button onClick={controller.firstOperation}
        disabled={controller.isPending}>wrong operation call</button>
    </div>;
  `} />

  js/main.js
  <Code text={`
    import Mvc from 'crizmas-mvc';

    import TestPage from 'js/components/test-page';

    new Mvc({
      domElement: document.querySelector('#app'),
      component: TestPage
    });
  `} />

  <p>So, here we have an observed object with a child observed object. Note how the object is
  pending whenever one of its methods or its child object is pending. Also note that because
  the fourth button doesn't call <Ticks text="firstOperation" /> as a method of the object, it
  doesn't have any effect on the async state of the object.</p>

  <h4 id="optimizations">Optimizations</h4>

  <p>The observation instrument also does some optimizations:</p>

  <Code text={`
    import Mvc from 'crizmas-mvc';

    const controller = Mvc.controller({
      cachedPromise: null,

      syncMethod1() {
        this.syncMethod2();
      },

      syncMethod2() {
        // ...
      },

      asyncMethod1() {
        return asyncMethod2();
      },

      asyncMethod2() {
        return new Promise(resolve => {
          // ...
        });
      },

      asyncMethod3() {
        this.cachedPromise = new Promise(resolve => {
          // ...
        });

        return this.cachedPromise;
      },

      asyncMethod4() {
        return this.cachedPromise;
      }
    });
  `} />

  <p>In this example, when <Ticks text="syncMethod1" /> is called, the view is updated only once,
  even though both methods, <Ticks text="syncMethod1" /> and <Ticks text="syncMethod2" /> are
  observed. Also when <Ticks text="asyncMethod1" /> is called, the view is updated only once, and
  when the promise returned by it is settled, the view is still updated only once because <Ticks
  text="asyncMethod1" /> and <Ticks text="asyncMethod2" /> return the same promise.</p>

  <p>To be more precise, the promise that they return is not really the promise that is created
  in <Ticks text="asyncMethod2" /> because in order to trigger the notification, the promise must
  be wrapped in another promise that results from the original promise's reaction that handles
  the observation mechanism. Also, an observed function is not really the original function,
  but a proxy. This proxy, however, has a high degree of transparency, which means that if
  you interact with it, for instance, by setting a property, the property will be set on
  the original function (which is the proxy's target). However, if you observe a function,
  and later you observe the same (initial) function again, the two resulted functions are identical.
  Or if you observe an already observed function, the result is the already observed function.
  An observed object is the same value as the original object.
  Basically its methods are replaced with the observed ones. If you want to add a new method
  to an observed object, after you observed the object, and observe the method,
  you must reobserve the object so that the new method is observed.
  Or you can just add the already observed function as a method.</p>

  <p>What happens when <Ticks text="asyncMethod4" /> is called depends on the state of the cached
  promise. If it hasn't been settled yet, when it is settled, the view is updated only once.
  However, if it has already been settled, which implies that the view has already been updated,
  it's going to be wrapped again and the view will be updated again, once the promise's
  reactions are triggered. This is important because the reactions associated with an already
  settled promise are triggered in a subsequent job (or in the next tick), so between the
  method call and the reaction execution, the object must be marked as pending (and potentially
  reflected in the view as such).</p>

  <Code text={`
    import Mvc from 'crizmas-mvc';

    const promise = Promise.resolve();
    let promiseResult;

    const observedPromise = Mvc.observe(Mvc.observe(Mvc.observe(
      promise.then(result => {
        promiseResult = result;
      });
    )));

    setTimeout(() => {
      Mvc.observe(observedPromise);
    }, 2000);
  `} />

  <p>In this example, even if we call <Ticks text="observe" /> three times, the promise is
  observed a single time. It is important that it's observed because the reaction from which
  the promise resulted may have a side effect that should be reflected in the view. However,
  later when we try to observe it again, it will not be observed, because it cannot have any
  other side effects and since it's not associated with the asynchronous state of an observed
  object, the promise becomes completely irrelevant.</p>

  <h4 id="ignoring">Ignoring</h4>

  <p>It is also possible for a controller to have a getter function. A function that doesn't
  have side effects but does a small computation typically for rendering the result. Even though
  it's possible to use getters (accessor properties) because they are not observed, we must
  also be able to use functions for this purpose. But since the methods of a controller are
  observed, we would end up calling functions that would notify and update the view in the middle
  of the notification process. Therefore we provide the <Ticks text="Mvc.ignore()" /> mechanism
  to prevent values from being observed. It can be used with functions, objects or promises
  (and thenables). An observed function that returns an ignored promise can still be pending
  in relation to an observed object.</p>

  <h4 id="big-models">Big models</h4>

  <p>In a web application it's likely that the controller has access to a model and the model
  is the value of a property of the controller, in order to access the model through the controller
  in the view. We assume that the controller is defined using <Ticks text="Mvc.controller()" />,
  which means that it's an observed object. Often the model data must be fetched from the server,
  which means that it's likely that the controller is observed before the model is set to one
  of its properties. However, this isn't always the case. For instance, it's possible that some
  controller composition is implemented and one of the controller constructors receives
  the model as an argument when instantiated and then it sets the model to one of the resulted
  object's properties. When observing an object, all its non-function data properties are checked
  to find child observed objects and this verification is done any number of levels deep,
  until all the keys are checked.
  While typically controllers are small enough to not care about traversing a huge tree of objects,
  it's likely that some models are big. In order to prevent the traversal of big child objects,
  the properties can be defined as getters (accessor properties) instead of normal data
  properties.</p>

  <h4 id="observing-proxies">Observing proxies</h4>

  <p>When observing proxies care must be taken. When we're observing an object
  (including functions), we're checking if the <Ticks text="isPending" /> and <Ticks
  text="pending" /> properties already exist. If they do, an error is thrown.
  Therefore, in the case of proxies, if we're successfully setting the properties
  on the observed object, and later we're checking them again on the proxy target
  (assuming that the observed object is a proxy) or on the proxy for which the
  observed object represents the target, we're throwing the error in case the
  properties are reported as existing. In particular, if we observe a proxy whose target
  is a traditional function that has its default properties, we get an error because
  the prototype property and the prototype's constructor property will also be observed.
  Since the constructor is the same as the proxy's target, both the proxy and the
  target are observed. In case of an arrow function, for instance, by default there
  will be no such issue since the arrow function will not have a prototype property.
  There are two ways to avoid this issue.
  1) Make sure that either the proxy or the target are observed and not both.
  2) Or, if both must be observed, make sure that the proxy is lying about the
  existance of its pending state related properties or that it doesn't define
  them on the target as well, when the proxy is observed
  (which is possible because the properties will be configurable).</p>

  <p>A proxy and its target shouldn't share the
  pending state related properties because they could be located in different managed
  trees and so the pending state of the trees could become corrupt.</p>

  <h4 id="unsynchronized-interleaved-rendering">Unsynchronized interleaved rendering</h4>

  <p>Say we have the following observed async function:</p>

  <Code text={`
    Mvc.observe(async () => {
      updateSomeState(await observedAsyncOperation());

      ctrl.someOtherState = new ObservedConstructor();
    });
  `} />

  <p>in which <Ticks text="observedAsyncOperation" /> and <Ticks text="ObservedConstructor" /> are
  observed functions. This kind of cases can lead to unsynchronized state in relation to the
  rendering process, in the context of async operations, depending on how we are using that state
  in the view. After <Ticks text="observedAsyncOperation" /> is awaited, <Ticks
  text="updateSomeState" /> will update state A, and the assignment that follows
  updates <Ticks text="someOtherState" />, which we'll call state B. Since state A and state B
  are updated synchronously one after the other, we may be tempted to check in the view if state A
  was updated and, if it was, do something with state B. The issue here is that, even
  if <Ticks text="updateSomeState" /> is not an observed function, <Ticks
  text="ObservedConstructor" /> is observed and it causes rerendering after state A was updated
  but before state B is updated and this can lead to an error that occurs in the view. Note that
  if the function in which state A and state B are updated wasn't async, there would be no issues,
  since the synchronous wrapper ensures that rerendering happens only once and only after the entire
  operation finished. But since we're in an async function we can not detect when each await step
  finishes and so after each await step, each observed operation that is not wrapped by another
  observed operation is independent from the rest of observed operations with respect to rendering.
  There are a few ways to deal with this.</p>

  <p>The simplest approach, if possible, is to check in the view if the entire async operation
  is pending instead of checking only if state A was updated, assuming that the async observed
  function is a controller method for instance. This way, state A and state B will
  be used only after the entire operation finishes.</p>

  <p>If we don't want to do that, for instance if we have multiple await steps in the async
  function and we don't want to wait for all of them, but we want the intermediary related state
  updates to be reflected in the view as soon as possible, we can wrap those asynchronous
  state updates in an observed boundary, which could be for instance an observed method of
  the controller:</p>

  <Code text={`
    const ctrl = Mvc.controller({
      doAsyncStuff: async () => {
        updateAllRelatedState(await observedAsyncOperation());
      },

      updateAllRelatedState: (result) => {
        updateSomeState(result);

        ctrl.someOtherState = new ObservedConstructor();
      }
    });
  `} />

  <p>However this requires creating a new observed function, which in this example is a public
  method, and we may not want to expose it. A simpler way of achieving the same result would be:</p>

  <Code text={`
    Mvc.observe(async () => {
      const result = await observedAsyncOperation();

      Mvc.apply(() => {
        updateSomeState(result);

        ctrl.someOtherState = new ObservedConstructor();
      });
    });
  `} />

  <p>And there is also the case that <Ticks text="observedAsyncOperation" /> itself updates some
  state and we want that state to be synchronized with state A and state B in relation to rendering
  and in that case we simply have to reorganize the code to make sure that such related state
  is updated synchronously inside an observed boundary. Or, in case we have multiple await steps
  in a bigger async function, split it in multiple observed async functions, while keeping the
  related state udpates in one of them and check in the view if that child async operation
  is pending. (We can do this even without exposing a public async function, by
  using <Ticks text="Mvc.apply" /> with the controller and a custom key). Or, simply,
  do multiple checks in the view (for state A, state B and whatever other state we're
  interested in).</p>

  <p>Head over to the <Link to="/api">API</Link> section for more details about how
  to use the framework.</p>
</div>;
