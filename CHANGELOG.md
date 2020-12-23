<a name="2.0.0"></a>
# [2.0.0](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v1.1.0...v2.0.0) (2021-01-01)

### Breaking changes
- Dropped support for non-module script tags.
- Moved from commonjs modules to standard ES modules, which means the structure of the exports changed:
controller, observe, root, unroot, ignore, apply, construct, addObservedChild and removeObservedChild are not properties of Mvc anymore.

### Updates
- Merged crizmas-utils, crizmas-async-utils and crizmas-promise-queue into this package.
- Moved the docs to https://github.com/raulsebastianmihaila/crizmas-mvc-docs
- Updated jest and crizmas-router dev dependencies.

<a name="1.1.0"></a>
# [1.1.0](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v1.0.3...v1.1.0) (2020-07-12)

### Updates
- Add `Mvc.apply` and `Mvc.construct`.
- Small refactoring to improve readability.
- Remove the examples folder and add link to the examples app.
- Docs: add render-clip and tree components and controllers.
- Docs: move input component to components section.
- Docs: add path option to Router.fallbackRoute.
- Docs: update webpack, webpack-dev-server and copy-webpack-plugin to fix their vulnerabilities.
- Docs: various tweaks based on the webpack configuration udpate.
- Docs: add the section with the article about the crizmas-mvc framework.
- Docs: add section about Cancellation.
- Docs: add external link to the article about the crizmas-mvc framework.
- Docs: small updates to the home page and the README.
- Docs: update getting started section regarding the dependencies.
- Docs: add link to the examples app.
- Docs: add article about features in complex applications.
- Docs: add the `className` prop to `Link`.
- Docs: other small improvements.
- Update jest dev dependency to fix its vulnerabilities.

<a name="1.0.3"></a>
# [1.0.3](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v1.0.2...v1.0.3) (2018-12-08)

### Updates
- Use the new react context API (from v16).
- Remove prop-types peer dependency because it's not used anymore.
- Update crizmas-utils, react and react-dom peer dependencies.
- Update crizmas-utils, crizmas-async-utils, crizmas-router, react, react-dom, prop-types and jest dev dependencies for tests.
- Update package-lock for dev dependencies to fix jest vulnerabilities.
- Docs: update home page and add articles.
- Docs: add applications section.
- Docs: delete obsolete statement about Edge not supporting URLSearchParams.
- Docs: add section about big models to core section.
- Docs: add onAsyncError in the router section.
- Docs: update form API.
- Docs: add async validation strategy section to form section.
- Docs: update dependencies to fix webpack vulnerabilities.
- Enable strict mode in tests.
- Small refactoring.
- Add 6 tests.
- Improve some tests.
- Examples: add wizard example.
- Examples: update dependencies to fix webpack vulnerabilities.

<a name="1.0.2"></a>
# [1.0.2](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v1.0.1...v1.0.2) (2018-04-21)

### Updates
- Add tests.
- Replace `Promise.reject` with throwing.
- Small refactoring.
- Updated the version of crizmas-utils peer dependency.
- Add MIT license to package.json.

<a name="1.0.1"></a>
# [1.0.1](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v1.0.0...v1.0.1) (2017-11-18)

### Updates
- Updated the versions of react and react-dom peer dependencies.

<a name="1.0.0"></a>
# [1.0.0](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.9...v1.0.0) (2017-07-30)

### Updates
- Updated the version of crizmas-utils peer dependency.

<a name="0.2.9"></a>
# [0.2.9](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.8...v0.2.9) (2017-07-06)

### Fixes
- Fix jumping to hash after synchronous transitions.

### Notes
- From this version on, if crizmas-mvc is used in conjunction with crizmas-router, it depends on crizmas-router's `onUrlHandle` API from version 0.3.0.

<a name="0.2.8"></a>
# [0.2.8](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.7...v0.2.8) (2017-06-04)

### Updates
- Make `isPending` non-enumerable.
- Make `pending` non-enumerable and non-writable.
- Small refactoring.

<a name="0.2.7"></a>
# [0.2.7](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.6...v0.2.7) (2017-05-14)

### Updates
- Small refactoring.
- Add prop-types as a peer dependency.
- Update versions of react and react-dom peer dependencies.

<a name="0.2.6"></a>
# [0.2.6](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.5...v0.2.6) (2017-05-07)

### Updates
- Do the notification setup earlier.
- Refactoring.
- Update versions of dependencies.

<a name="0.2.5"></a>
# [0.2.5](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.4...v0.2.5) (2017-04-29)

### Updates
- Ensure that functions that should not be constructed are not constructors.
- Update versions of dependencies.

<a name="0.2.4"></a>
# [0.2.4](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.3...v0.2.4) (2017-04-23)

### Updates
- Prevent updating the pending state of the managed trees when all the pending operations associated with the promise that has just been settled are all static methods (the `this` contexts of the pending operations are all functions) because they can not have any effect on the pending state of the managed trees.
- Refactoring.

<a name="0.2.3"></a>
# [0.2.3](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.2...v0.2.3) (2017-02-14)

### Updates
- Allow Mvc to be applied. Removed the new.target check that was crashing the build when using the uglify plugin from webpack.

<a name="0.2.2"></a>
# [0.2.2](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.1...v0.2.2) (2017-02-13)

### Fixes
- Prevent Mvc and observed constructors like controllers and roots from being applied.

<a name="0.2.1"></a>
# [0.2.1](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.2.0...v0.2.1) (2016-12-30)

### Fixes
- Fix the peer dependencies versions.

<a name="0.2.0"></a>
# [0.2.0](https://github.com/raulsebastianmihaila/crizmas-mvc/compare/v0.1.0...v0.2.0) (2016-12-29)

### Breaking changes
- Add the `crizmas` namespace as a prop on `window`.

<a name="0.1.0"></a>
# 0.1.0 (2016-12-21)

- Init
