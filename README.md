# crizmas-mvc

[Documentation](https://raulsebastianmihaila.github.io/crizmas-mvc-docs)

A framework based on React and the MVC pattern with the goal of simplifying front-end programming.

The main advantages and features are:  
- simplicity for common cases and flexibility for complicated cases  
- management of pending trees of objects  
- doesn't touch your model, allowing you to write it anyway you want
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

[Real world example](https://raulsebastianmihaila.github.io/crizmas-mvc-realworld-site/) ([repo](https://github.com/raulsebastianmihaila/crizmas-mvc-realworld))

Check out the examples folder for small working examples. Also the documentation (docs folder)
is implemented with [crizmas-mvc](https://www.npmjs.com/package/crizmas-mvc).

## Articles

- [Race conditions management in interlaid async validations](https://medium.com/@raul.mihaila/crizmas-status-update-and-the-form-interlaid-asynchronous-validations-4abf167a54bb)
