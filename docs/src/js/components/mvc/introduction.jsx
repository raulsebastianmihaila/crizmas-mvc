import React from 'react';

import Logo from '../logo';

export default () => <div>
  <h2 id="introduction">The <Logo text="crizmas-mvc" /> front-end framework for enterprise
  applications</h2>

  <p>There are a few good Javascript front-end frameworks (and we’re using the word ‘framework’
  in the more general sense, in which even a group of libraries that work together can form
  a framework). But are they good enough? We can’t talk about a perfect framework. It all boils
  down to how capable the framework is (in relation to the goal) and how comfortable you are with
  it. And there are quite a few aspects to take into account. This new framework (although since
  2016) is our take on how things can be done better. In this article we try to explain why and
  how <Logo text="crizmas-mvc" /> is a very well suited framework for complex enterprise
  applications.</p>

  <h3 id="what-to-expect">What to expect from a framework</h3>

  <p>The main characteristic that a framework must have is being capable. It must be easy to
  build with it all the common features that we’re used to seeing in a UI. The framework must allow
  you to focus on the business requirements and on the more special features that the framework
  itself couldn’t account for, instead of making you scratch your head when you run into situations
  where it gets really weird to implement a rather common requirement.</p>

  <p>The next characteristic to look for is flexibility. A framework may appear to be very capable
  because it may seem you can build with it most of what you can think of, but then in practice you
  might have to implement a rather awkward UX behavior. Or you might need to integrate with some
  third party component or library that doesn’t really fit the general approach that the framework
  is enforcing. Or the business requirements might have you wonder why you would have to implement
  something like that. The point is that many times you have to implement things that you would
  rather avoid implementing, but still have to implement them, and perhaps the framework wasn’t
  build to cater for those situations. Therefore a framework should allow you to employ different
  approaches and patterns.</p>

  <p>It’s also very important for the framework to be free of errors. Sometimes you read the docs
  of a framework or library and it turns out it’s not doing what it was supposed to. Tightly related
  to this is the rapid development of the framework. If you need to wait a long time for a fix you
  will end up doing workarounds.</p>

  <p>For corporations it’s often important for the framework to be popular. This allows them to hire
  new people that are already familiar with the framework. Also for developers it’s important
  because they get more job opportunities. However there should be room for new approaches as well,
  otherwise the progress is hindered.</p>

  <h3 id="main-ideas">Main ideas</h3>

  <h4>Independent model</h4>

  <p>There are simple applications for which pretty much any framework will do and there are more
  complex applications, for instance what one would typically call enterprise applications, where
  structure, conventions and ceremonies are essential. Certain frameworks enforce a quite rigid
  structure and you pretty quickly find yourself making a face at this when it feels abnormal. When
  it comes to structure there is always a part of the codebase that can be understood independently
  from the framework because, at least in theory, you would normally want to implement it similarly
  using any other framework as well. This is what usually a domain model looks like. Understanding
  and expressing well the domain model is very important since that is the essence of the
  application and cutting corners or resorting to workarounds makes developers uneasy because that
  makes the model more difficult to understand. This is the first idea of <Logo
  text="crizmas-mvc" />. The model can
  be written in absolutely any way you want. The framework doesn’t provide anything for you to write
  the model. It doesn’t need to bind to anything, it doesn’t need to be decorated with anything and
  you don’t need to use any API for defining the model. Some frameworks are more appropriate for a
  specific way of organizing the code. However, typically a complex application requires
  multiple ways of organizing the code and the flexibility and the missing rigidity are the best
  approach.</p>

  <p>One positive consequence of this is that you don’t depend on the framework to support certain
  data structures. For instance, a reactive system (for instance Vue’s) might transform your data
  and if the data structure has a special behavior (for instance it accesses some private internal
  data) the framework needs to wrap or transform that data structure in a specific way. Whenever
  such a new data structure is added to the programming language, the framework needs to be updated.
  This evidently has some limitations, you’re restricted to comply with the rules and for instance
  you can’t simply define your own objects with such a special behavior and use them any way you
  want. Or if you have to use a third party library that isn’t tailored for that framework, you need
  to work on adapting it for the framework and this can be a challenge.</p>

  <p>The essential benefit of model independence is that you fully understand what it does as long
  as you understand the programming language and your own code. Frameworks may have a subtle way of
  implementing reactivity and sometimes you scratch your head because it’s not intuitive why your
  view is not being updated when you change some state. This may be a combination of subtle
  framework mechanics and rigidity.</p>

  <p>Frameworks may transform your data in order to implement the reactivity (or the binding
  mechanism between the view and the data) and also for performance optimizations for efficient view
  updates. However, this transformation may be costly if the data is bigger.</p>

  <h4>Managing the pending state for trees of objects</h4>

  <p>One common thing that applications do is representing the pending state of the application.
  Data may be loading or operations may be in progress and you may want to show a spinner or disable
  particular buttons depending on the pending state of certain operations. You may also be
  interested in combinations of pending operations, depending on how complex the UI is.
  It’s therefore important to structure the pending state. Given the way <Logo
  text="crizmas-mvc" /> manages the
  controllers you automatically get this pending state management with which you can easily tell
  which operation is in progress. You can also see if a group of operations are in progress as the
  controller is pending while it has any pending operations associated with it. The icing on the
  cake is that you can have a tree of pending objects, where a parent object is pending if
  it has at least one pending operation associated with it or if it has any child objects that are
  pending.</p>

  <p>It’s quite surprising that most frameworks don’t handle this as easily, since it’s a very
  common feature we see in applications. Not all frameworks support all the common features as
  easily, even though they claim they facilitate building very complex UIs.</p>

  <h4>Controllers</h4>

  <p>There’s this hype around components going on. Components in general are very important for
  modularity and in this respect we have to consider all kinds of components, not only view
  components. However, the hype is mostly around rendered components. Some of them can be more than
  view components, for instance the Flux architecture introduces the notion of controller-view.
  View components specifically are very important for structuring the view layer and they are
  typically used as part of a composite pattern. But the most popular frameworks today give a
  greater responsibility to these components. There is an evident tendency to compose as much of
  your application as possible with such components. This means a lot more is put into the view
  layer. The components can do more than displaying things. For instance, they may have controller
  logic, they may hold data and state that could be kept somewhere else. You can also have
  components with the purpose of reusing some sort of functionality they implement, but without
  rendering anything but their children. You may therefore end up with having a tree of components
  each with different fundamental responsibilities, which can be seen as a departure in spirit from
  the composite pattern, as the uniformity is given only by the rendering aspect, but less by what
  the layer is concerned with.</p>

  <p>Keeping the components in the same tree means they participate in the same lifecycle. While
  for rendering (and the composite aspect of it) this makes a lot of sense, it becomes troublesome
  when the components have other responsibilities, such as keeping state or performing operations
  such as data fetching. Flux itself recommends to keep controller-views at the top of the tree.
  A good example are tabs. If your components are contained in tabs, when the user switches tabs,
  assuming that only the active tab renders its content, the components from the other tabs are
  unmounted and whatever state they might be holding is lost. Controllers in <Logo
  text="crizmas-mvc" /> can hold
  such state that is used by the components and since the controllers are not held in the state of
  the components we work out this deficiency that components with state have. In short, controllers
  are independent from the view lifecycle. But controllers are even more important than this.</p>

  <p>With Flux (or other approaches inspired by it), in order to solve the component state issue,
  we can either move the state higher in the tree of components or move the state to the store.
  Keeping the state in the parent component can bloat it. Moving the state in the store can have
  some unfortunate consequences such as mixing domain model state with view or controller state.
  Normally the store module (with Vuex, or a Redux reducer used with the <i>combineReducers</i> API)
  requires clearing when the context where that module is relevant is left by the user. Controllers
  allow us to instantiate models in the controllers themselves and if we keep them locally in the
  controllers, when the controllers are not used anymore that model state is lost automatically and
  doesn’t need clearing.</p>

  <p>In <Logo text="crizmas-mvc" /> there is a clearer separation between the view, the controller
  and the domain
  model, with regard to their logic and state. For instance, with Redux and Vuex the controller
  logic can stay in many places and it can also be mixed with the data handling in the store. There
  we have controller-views, middlewares, actions and action creators and reducers or mutations.</p>

  <h4>Router capabilities</h4>

  <p>Beside the capabilities that a typical router provides, such as matching paths with parameters,
  fallback routes, regexp matching, redirects, entering and leaving hooks that can be used for
  implementing guards etc., <Logo text="crizmas-router" /> provides some more fancy capabilities
  as well.</p>

  <p>Refreshing the current route is a very requested feature from all the most popular frameworks.
  The nicest feature of <Logo text="crizmas-router" />, one that we couldn’t find in any other
  framework, is being
  able to refresh the current path from any fragment. This means that if we have a hierarchy of
  route fragments that are handling the current path of the application (each URL path fragment
  having a separate route fragment associated with it), we can refresh only a part of them or all
  of them (meaning that they will be left and re-entered).</p>

  <p>We can’t really speak about a modern framework anymore today if it doesn’t support lazy
  loading. All the most popular frameworks support this and <Logo text="crizmas-router" /> does
  too.</p>

  <p>By working with a very easy to use API, routes can be dynamically checked, added, removed and
  listed at any point in time and <Logo text="crizmas-router" /> also provides a nice option for
  case insensitivity at the router level or at the route level.</p>

  <h4>Form capabilities</h4>

  <p><Logo text="crizmas-form" /> provides event based sync and async validations. The validations
  are triggered
  when standard events occur, but they can also be triggered with custom events. The validation
  event always has a target associated with it, which allows us to validate related fields when a
  certain field is interacted with. The inputs typically form a tree of inputs and we can have lists
  of inputs too.</p>

  <p>Sometimes the form data represents temporary data which can be kept in the controller state.
  However in many enterprise applications the data is usually model data and it can be used in other
  parts of the application or the form can be split into wizard steps that handle parts of a model.
  Therefore <Logo text="crizmas-form" /> also allows us to connect models to our inputs.</p>

  <p>Of course we get typical APIs for resetting or clearing the inputs, submitting and getting the
  form data, adding and removing inputs dynamically from the form and also out of the box
  validators, but probably the most interesting capability
  of <Logo text="crizmas-form" /> is <a target="_blank"
  href="https://medium.com/@raul.mihaila/crizmas-status-update-and-the-form-interlaid-asynchronous-validations-4abf167a54bb">managing race
  conditions in interlaid async validations</a>.</p>

  <h4>Scroll virtualization</h4>

  <p>Enterprise applications typically have a lot of big tables of data. For this we provide our
  own implementation of scroll virtualization which allows us to display a big list of items without
  blocking the browser: only a part of the items are rendered while for the user it appears that all
  the items are rendered.</p>

  <h4>Based on React</h4>

  <p>At the view level we use React. React is great because it provides huge flexibility which
  fits <Logo text="crizmas-mvc" /> very well especially because we can use Javascript to create
  fragments of the view.
  Comparing this to the primary Vue templating language or the Angular templating language we
  immediately see a big difference in flexibility and ease of use, assuming you are comfortable with
  Javascript.</p>

  <p>A great benefit of using React is the community behind it, including the huge number of
  components that we can find online.</p>

  <h4>The MVC of <Logo text="crizmas-mvc" /></h4>

  <p>There are different flavors of MVC and we don’t claim that ours is the best or the purest.
  It is important that we mention a few characteristics of our approach. Our approach to MVC is
  adapting it to a way of handling changes in the application in a more reactive way. Because of
  this, we will not see much of the observer pattern where the view and controller subscribe to the
  model in order to react to changes. Instead when we want something to happen in the application we
  need to go through the controller. The controller is where the framework does the work of updating
  the view after the operation finished. The view typically gets access to the controller and the
  controller may reveal model data/state as well, so the view can render it.</p>

  <p>The controller in general is not seen only as a glue between the view and the model.
  The controller is in fact smart, but it delegates to the model to manage the domain area.
  The controller can have some logic of transitioning to different contexts of the application for
  instance. And, of course, we need to respect the separation of concerns and so each controller
  will have its own scope and purpose.</p>

  <p>If in a more classical approach the controller could interact with the view in an imperative
  way, in our case when the controller needs to control the view, we can manage some state inside
  the controller and pass that to the view whose rendering behavior would then be determined by that
  state.</p>

  <p>The controllers can also interact with an API layer. The API layer would contain the details of
  communicating with a server. The operations of communicating with the server can be initiated from
  the controller. Also reacting when the communication finished, for instance by asking the model to
  update itself. These things can also happen in a service and if we were to introduce services, the
  controllers could interact with such services (without allowing the view to interact with the
  services). If we look at Angular services we can see that often they are a mix of the API layer,
  models and services as we’ve just described them above. Because there is a clear separation
  between the API layer, controllers and models in <Logo text="crizmas-mvc" />, the services in
  our approach
  would be very slim, therefore we could actually have this part incorporated in controllers with a
  specific scope and responsibility.</p>

  <p>In general, in <Logo text="crizmas-mvc" />, we have route controllers whose interaction with
  the route view
  components is handled by the router (from <Logo text="crizmas-router" />). Beside these we have controllers with
  specific responsibilities. These are often composed inside a route controller. This gives great
  flexibility when it comes to structuring our code and implementing different pieces of
  functionality that can be reused in different contexts of the application.</p>

  <h3 id="why-and-when">Why and when it’s good</h3>

  <p>In order to see the benefits of <Logo text="crizmas-mvc" /> we need complexity and a desire
  for productivity.
  In this way we can better weigh the disadvantages of lacking capabilities, sloppy APIs and rigid
  framework patterns. Probably the best use case for this framework is a big enterprise application
  with complex changing requirements. There have been attempts for comparing frameworks, but the use
  cases haven’t really been satisfying. We usually see ‘Todo MVC’ examples. There was also a more
  interesting attempt of comparing frameworks with an application that looks more like a <a
  href="https://github.com/gothinkster/realworld" target="_blank">real world application</a>, and
  you can see
  our <Logo text="crizmas-mvc" /> implementation too (<a target="_blank"
  href="https://github.com/raulsebastianmihaila/crizmas-mvc-realworld">repo</a>, <a
  target="_blank"
  href="https://raulsebastianmihaila.github.io/crizmas-mvc-realworld-site/">app</a>), but
  even that is not
  relevant enough because it’s too simple. For <Logo text="crizmas-mvc" /> an enterprise application
  would be more relevant.</p>

  <p><Logo text="crizmas-mvc" /> combines many great capabilities with a great deal of flexibility
  and separation of concerns to facilitate reusability and help you be productive even when the
  requirements are very complex.</p>

  <h3 id="comparison">Compared to other frameworks/approaches</h3>

  <p>We’ve already mentioned quite a few differences between <Logo text="crizmas-mvc" /> and other
  frameworks. If we were to provide a very short summary we could mention:</p>

  <ul className="simple-list">
    <li>the separation between controllers and views (and their lifecycle)</li>
    <li>the clear separation between the API layer, controllers and model (both compared to Redux
    and Vuex where controller logic can stay in many places as well as compared to Angular services
    which can mix the data layer with models and other service logic)</li>
    <li>possibility of instantiating models in controllers and not having to clear the
    model/store/service when the context of the application is changed</li>
    <li>the complete independence of the model with absolutely no constraints from the framework,
    which provides flexibility</li>
    <li>managing the pending states of trees of objects</li>
    <li>router capabilities (refresh from any fragment of the current chain of routes;
    API for adding, removing, listing and checking routes dynamically)</li>
    <li>form capabilities (event based validation; possibility of connecting models to inputs;
    managing race conditions in interlaid async validations)</li>
    <li>scroll virtualization</li>
    <li>we use React at the view layer so in this respect we benefit from the advantages that React
    brings</li>
  </ul>

  <p>There are a few other notes that we can add to this topic.</p>

  <p>There seems to be quite some emphasis in a part of the front-end community on the importance of
  static typing and immutability in general. We don’t see things the same way as explained in <a
  href="https://medium.com/@raul.mihaila/the-real-problem-with-programming-in-javascript-bfdb64d24211"
  target="_blank">an older article</a>.
  Relevant experience solidifies our position. We’ve lead two teams on two complex
  enterprise applications, one with Redux and the other one with Vuex. No static typing was used and
  in terms of productivity we benefited from that. We also had a very small number of bugs.
  Immutability didn’t make a positive difference either (as with Vuex we do mutations).
  However, we do recognize a benefit of Flux, which is the restrictive organization of the codebase.
  This makes it easier for a team made of different people with different skills and experience to
  maintain consistency throughout the codebase. Less experienced developers can find more common
  patterns in the application and code review is easier to do as there are less ways of writing the
  code. When combined with immutability, Flux has the downside of being less intuitive as certain
  operations that depend on other operations that update the state of the application can be
  initiated from the component only after the store was updated and the new state was propagated
  through the view, typically in a <i>componentDidUpdate</i> hook, assuming such state is only read
  through the props (with Redux the store state could be read directly through its API as well,
  but in that case we would be mixing approaches, while with Vuex we don’t have this issue because
  the state would not become stale). The restrictive nature of Flux also has the downside of being
  too rigid where more complexity would benefit from more flexible ways of doing things (for
  instance by reusing controllers that can hold local state). As for Typescript, we’ve also
  experienced with that in a different application together with Redux and we ran into quite a few
  library incompatibilities, out of date type definitions and obscure compilation error messages for
  things that would have worked with pure Javascript.</p>

  <p>Compared to Flux, with <Logo text="crizmas-mvc" /> controller logic is easier to reuse in
  multiple contexts of the application since they can keep local state (especially if they don’t
  have to interact with a
  model that outlives the controller). With Redux, for instance, action creators, where such logic
  could be implemented, need a reducer in order to hold that state and you end up with a store
  module/reducer for each such controller context. You could also use higher order components or
  hooks for such controller logic, but their state would get lost on unmounting, so you would still
  rely on a store. If a separate state management mechanism is introduced for this purpose, it needs
  to propagate the new state to the components and the components need to subscribe to it, which
  means extra verbosity.</p>

  <p>With Redux and Vuex, for reusing store logic it’s possible to use mixins (assuming, in the case
  of Redux, that we define a mechanism with which we write the reducers as object methods and then
  transform the result into a normal Redux reducer), or, the simplest approach, we can use functions
  in a functional or procedural way (since with Vuex we do mutations). There is also the possibility
  of writing higher order reducers with Redux in order to reuse code. This is somewhat similar to
  using ids to identify the instance that we operate on. You could also do inheritance in a Flux
  store but that has its disadvantages.</p>

  <p>With <Logo text="crizmas-mvc" />, for reusing controller and domain model logic, we can also
  use mixins and
  functions. We can also take a more traditional OOP approach, which allows defining the state
  structure and logic for operating with that state locally in the same place (in the same
  object/class or closure). This way we can reuse logic with multiple instances without too much
  boilerplate and without resorting to binding ids to our operations. With <Logo
  text="crizmas-mvc" /> controllers
  and models can also do traditional OOP composition (this implies being able to call methods of
  a child object, so we’re not referring only to composing fields). This allows us to structure the
  code more easily when we prefer an extra layer of fields for a certain purpose. It also allows
  traditional and easy to implement design patterns, such as the strategy pattern.</p>

  <p>Without inheritance and mixins, in Redux or Vuex the state is typically separate from the
  reused logic. The traditional OOP composition approach in this case would have the effect of
  mixing the state with methods which would mean that the store, which should contain a kind of
  state of the application in its entirety, would now also contain some functions. The store should
  be accessible from the components only for subscribing, reading and dispatching and nothing else.
  Any other interaction with the store, from the components, should happen through the Flux
  pipeline. We should be able to pass the entire state of the store to a component and if that state
  contained methods, then the component could interact with the store in a way that would not be in
  conformance with the Flux approach. In Vuex, the methods (the fields whose values are functions)
  would still be reactive, which would be a bit weird. In Flux stores, in general it’s possible to
  do such OOP composition though, if we have a mechanism of extracting the state without methods
  that would be passed to the components, which would mean more verbosity. It is also possible, for
  instance with Redux, to use some sort of OOP composition by discarding the instance that holds the
  methods after performing the operation. You can instantiate a constructor by passing the existing
  state, then call the method that would return the new state. In this way you can focus on the
  state and operations related to that state in the same place (which is good when different related
  methods operate on different parts of that state). This however comes with quite some boilerplate
  of creating objects from existing state every time, which anyway is typical for the pipeline
  approach based on immutability. But with <Logo text="crizmas-mvc" /> we don’t need all this
  boilerplate.</p>

  <h3 id="conclusion">Conclusion</h3>

  <p>Based on experience with complex applications, <Logo text="crizmas-mvc" /> provides missing
  capabilities for
  front-end engineers and is optimized for ergonomics. It’s a framework that promotes a flexible
  approach, which allows for long term productivity. We hope this article sparked your interest in
  alternative progressive approaches in the context of modern front-end development.</p>
</div>;
