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
