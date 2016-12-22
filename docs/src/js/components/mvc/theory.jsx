import React from 'react';
import {Link} from 'crizmas-router';

import Logo from 'js/components/logo';
import Ticks from 'js/components/ticks';
import Code from 'js/components/code';

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
  An observed function has a key (string or symbol) associated with it. If the function results
  from observing an object, the key is the method's key.
  If a function is observed independently, <Ticks text="Mvc.observe()" /> can
  receive a key for the function which will become the
  associated key. This is especially useful when having two objects that share the same observed
  method, but this method has two different keys in the respective objects. Therefore the method
  will have a single key associated, which is the key that was used when the method was observed.
  So, the argument to <Ticks text="has" /> must be the associated key. If the function doesn't
  have an associated key, it cannot be pending in relation to an object.
  </p>

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
  its child objects that are already observed when the object is observed.
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
  for each object to hold references to its parents. However if an object is shared by
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
  instance must be exported. An even more daunting example is a default export whose value
  is a plain old object, because it cannot be changed from inside the module
  (meaning that the object in this case can never be garbage collected).
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
  code for rooting and unrooting (as we do with the <Link to="/router">router</Link>).</p>

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
  (and thenables).</p>

  <p>Head over to the <Link to="/api">API</Link> section for more details about how
  to use the framework.</p>
</div>;
