# crizmas-mvc

[Documentation](https://raulsebastianmihaila.github.io/crizmas-mvc-docs)

A framework based on [React](https://www.npmjs.com/package/react) and the MVC pattern with the goal of simplifying front-end programming. You can read an introduction [here](https://raulsebastianmihaila.github.io/crizmas-mvc-docs/introduction).

The main advantages and features are:  
- simplicity for common cases and flexibility for complicated cases  
- management of pending trees of objects  
- doesn't touch your model, allowing you to write it anyway you want
- scroll virtualization
- [router](https://www.npmjs.com/package/crizmas-router)
  - refresh from any fragment of the route
  - router manager for listing, adding and removing routes dynamically
  - lazy loading
  - option for case insensitivity
- [form](https://www.npmjs.com/package/crizmas-form)
  - trees of forms and inputs
  - input management with or without a model
  - synchronous and asynchronous event based validation
  - race conditions management in interlaid async validations

Check out the [examples app](https://raulsebastianmihaila.github.io/crizmas-mvc-examples/) ([repo](https://github.com/raulsebastianmihaila/crizmas-mvc-examples)). Also the documentation (docs folder)
is implemented with [crizmas-mvc](https://www.npmjs.com/package/crizmas-mvc).

## Applications

- [Real world example](https://raulsebastianmihaila.github.io/crizmas-mvc-realworld-site/) ([repo](https://github.com/raulsebastianmihaila/crizmas-mvc-realworld))
- [Chess game](https://raulsebastianmihaila.github.io/chess/) ([repo](https://github.com/raulsebastianmihaila/chess-src))

## Articles

- [Race conditions management in interlaid async validations](https://medium.com/@raul.mihaila/crizmas-status-update-and-the-form-interlaid-asynchronous-validations-4abf167a54bb)
- [The crizmas-mvc front-end framework for enterprise applications](https://dev.to/raulsebastianmihaila/the-crizmas-mvc-front-end-framework-for-enterprise-applications-hjd)
- [Implementation examples of common front-end features in complex applications](https://dev.to/raulsebastianmihaila/implementation-examples-of-common-front-end-features-in-complex-applications-6hh)
