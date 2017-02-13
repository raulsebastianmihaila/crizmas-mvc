(() => {
  'use strict';

  const isModule = typeof module === 'object' && typeof module.exports === 'object';

  let utils;

  if (isModule) {
    utils = require('crizmas-utils');
  } else {
    utils = window.crizmas.utils;
  }

  const {isObj, isFunc, isPromise, resolveThenable} = utils;
  const hasOwnProp = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

  let currentNotificationTrigger = 0;
  const notifyCbs = new Set();
  const ignoredItems = new WeakSet();
  const observableFunctionsMap = new WeakMap();
  const pendingTargetsDetails = new WeakMap();
  const pendingWrapperPromisesMap = new WeakMap();
  const pendingWrapperEntriesMap = new Map();
  const roots = new WeakSet();
  const rootFunctions = new WeakSet();
  const retainedRoots = new Set();
  const retainedObjects = new Set();

  function getPropObj(obj, prop) {
    const descriptor = Reflect.getOwnPropertyDescriptor(obj, prop);

    if (descriptor && isObj(descriptor.value)) {
      return descriptor.value;
    }
  }

  function getPropFunc(obj, prop) {
    const descriptor = Reflect.getOwnPropertyDescriptor(obj, prop);

    if (descriptor && isFunc(descriptor.value)) {
      return descriptor.value;
    }
  }

  function definePropValue(obj, prop, value) {
    // make sure it throws if the prop cannot be defined
    if (!Reflect.defineProperty(obj, prop, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    })) {
      throw new Error('Cannot define property');
    }
  }

  function programNotification() {
    currentNotificationTrigger += 1;
  }

  function checkNotify(hasError) {
    currentNotificationTrigger -= 1;

    // don't notify in case of error because we want to prevent possible side effects
    if (!hasError && !currentNotificationTrigger) {
      notify();
    }
  }

  function notify() {
    notifyCbs.forEach(cb => cb());
  }

  function observeFunction(observableFunc, key, visitedObjects, visitedFunctions, preventApply) {
    if (ignoredItems.has(observableFunc) || visitedFunctions.has(observableFunc)) {
      return observableFunc;
    }

    let observedFunction;

    if (pendingTargetsDetails.has(observableFunc)) {
      observedFunction = observableFunc;
    } else {
      observedFunction = observableFunctionsMap.get(observableFunc);

      if (!observedFunction) {
        observedFunction = new Proxy(observableFunc, {
          apply(target, thisArg, args) {
            if (preventApply) {
              throw new Error('The observed constructor must be invoked with \'new\'.');
            }

            programNotification();

            let error;
            let hasError;
            let result;

            try {
              result = Reflect.apply(target, thisArg, args);
            } catch (e) {
              hasError = true;
              error = e;
            }

            if (hasError) {
              checkNotify(true);

              throw error;
            }

            if (isPromise(result)) {
              result = observePromise(result, thisArg, key);
            }

            checkNotify();

            return result;
          },

          construct(target, args, newTarget) {
            programNotification();

            let error;
            let hasError;
            let result;

            try {
              result = Reflect.construct(target, args, newTarget);
            } catch (e) {
              hasError = true;
              error = e;
            }

            if (hasError) {
              checkNotify(true);

              throw error;
            }

            const isRoot = rootFunctions.has(observedFunction);
            const observationFunc = isRoot
              ? root
              : observe;

            if (isPromise(result)) {
              result = observeCbPromise(result, observationFunc);
            } else {
              if (isRoot && !isReliablyObservable(result)) {
                checkNotify(true);
                throwOnNonRootable();
              }

              result = observationFunc(result);
            }

            checkNotify();

            return result;
          }
        });

        observableFunctionsMap.set(observableFunc, observedFunction);
      }
    }

    visitedFunctions.add(observedFunction);
    observeObject(observedFunction, visitedObjects, visitedFunctions);

    const proto = getPropObj(observableFunc, 'prototype');

    if (proto) {
      observeObject(proto, visitedObjects, visitedFunctions);
    }

    return observedFunction;
  }

  function observePromise(promise, obj, key) {
    const isMethod = key && pendingTargetsDetails.has(obj);

    if (!isMethod && ignoredItems.has(promise)) {
      return promise;
    }

    const pendingPromise = checkPendingPromise(promise, obj, key, isMethod);

    if (pendingPromise) {
      return pendingPromise;
    }

    const pendingWrapperPromise = ignore(resolveThenable(ignore(promise)).then(res => {
      unsetPendingProp(pendingWrapperPromise, promise);
      notify();

      return res;
    }, err => {
      unsetPendingProp(pendingWrapperPromise, promise);
      notify();

      return Promise.reject(err);
    }));

    const pendingWrapperEntries = [];

    pendingWrapperEntriesMap.set(pendingWrapperPromise, pendingWrapperEntries);
    pendingWrapperPromisesMap.set(promise, pendingWrapperPromise);

    if (isMethod) {
      return setObjPendingPromise(pendingWrapperPromise, obj, key, pendingWrapperEntries);
    }

    return pendingWrapperPromise;
  }

  function checkPendingPromise(promise, obj, key, isMethod) {
    let pendingWrapperPromise = promise;
    let pendingWrapperEntries = pendingWrapperEntriesMap.get(promise);

    if (!pendingWrapperEntries) {
      pendingWrapperPromise = pendingWrapperPromisesMap.get(promise);

      if (!pendingWrapperPromise) {
        return null;
      }

      pendingWrapperEntries = pendingWrapperEntriesMap.get(pendingWrapperPromise);
    }

    if (isMethod) {
      return setObjPendingPromise(pendingWrapperPromise, obj, key, pendingWrapperEntries);
    }

    return pendingWrapperPromise;
  }

  function setObjPendingPromise(promise, obj, key, pendingWrapperEntries) {
    const objPendingDetails = pendingTargetsDetails.get(obj);
    const objNamePromises = objPendingDetails.get(key);

    if (objNamePromises) {
      if (objNamePromises.has(promise)) {
        return promise;
      }

      objNamePromises.add(promise);
    } else {
      objPendingDetails.set(key, new Set([promise]));
    }

    pendingWrapperEntries.push({obj, key});
    setPendingState(new Set([obj]));

    return promise;
  }

  function unsetPendingProp(pendingWrapperPromise, basePromise) {
    pendingWrapperPromisesMap.delete(basePromise);

    const pendingWrapperEntries = pendingWrapperEntriesMap.get(pendingWrapperPromise);

    pendingWrapperEntriesMap.delete(pendingWrapperPromise);

    // don't risk traversing any tree of objects if there were no objects associated.
    // (for instance retained roots might be traversed in vain)
    if (pendingWrapperEntries.length) {
      const objects = new Set();

      pendingWrapperEntries.forEach(({obj, key}) => {
        const objPendingDetails = pendingTargetsDetails.get(obj);
        const objNamePromises = objPendingDetails.get(key);

        objNamePromises.delete(pendingWrapperPromise);

        if (!objNamePromises.size) {
          objPendingDetails.delete(key);
        }

        objects.add(obj);
      });

      setPendingState(objects);
    }
  }

  function observeCbPromise(promise, cb, obj, key) {
    // we must observe and notify without caring if the
    // promise was previously ignored because
    // there are cases where the cb must be executed anyway and it can have side effects.
    // theoretically if the promise resulted from calling the same callback
    // and if the callback had the same result with no new side effects
    // the promise could be reused, but we cannot know that.
    // this is a rare case anyway.
    // however the promise and the resulted promise after observePromise
    // must be ignored because they cannot have new side effects.
    // at this point we cannot create a wrapper promise based on promise itself
    // because what happens in observationFunc determines the control flow
    // and you wouldn't want a callback to decide the settlment of a cached observed
    // promise.
    // if we wanted to reuse a cached wrapper promise based on promise we could
    // observe it separately, but in that case we basically observe two promises which
    // trigger the notifications twice, which is what we want to avoid.
    // if the promise will be used separately again, a wrapper promise will be created
    // then and it will be reusable, so we don't have to create it in advance.
    return observePromise(resolveThenable(ignore(promise)).then(cb), obj, key);
  }

  function observeObject(observableObj, visitedObjects, visitedFunctions) {
    if (ignoredItems.has(observableObj) || visitedObjects.has(observableObj)) {
      return observableObj;
    }

    visitedObjects.add(observableObj);

    if (!pendingTargetsDetails.has(observableObj)) {
      pendingDecorate(observableObj);
    }

    Reflect.ownKeys(observableObj).forEach(prop => {
      const method = getPropFunc(observableObj, prop);

      if (method && !ignoredItems.has(method)) {
        const alreadyObserved = pendingTargetsDetails.has(method);
        const observedFunction = observeFunction(method, prop, visitedObjects, visitedFunctions);

        if (!alreadyObserved) {
          Reflect.defineProperty(observableObj, prop, {value: observedFunction});
        }
      }
    });

    return observableObj;
  }

  function observe(observable, {key, preventApply} = {}) {
    if (ignoredItems.has(observable)) {
      return observable;
    }

    if (observable) {
      const visitedFunctions = new Set();
      const visitedObjects = new Set();

      if (isFunc(observable)) {
        return observeFunction(observable, key, visitedObjects, visitedFunctions, preventApply);
      }

      if (isObj(observable)) {
        if (isPromise(observable)) {
          return observePromise(observable);
        }

        return observeObject(observable, visitedObjects, visitedFunctions);
      }
    }

    return observable;
  }

  function isReliablyObservable(value) {
    // this should be used by APIs that make the code clearer by marking values
    // as observable (e.g. roots)
    return (isFunc(value) || isObj(value) && !isPromise(value))
      && !ignoredItems.has(value);
  }

  function throwOnNonRootable() {
    throw new Error('Root must be either a function or a non-promise object and it must'
      + ' not be ignored.');
  }

  function root(observable) {
    if (!isReliablyObservable(observable)) {
      throwOnNonRootable();
    }

    if (rootFunctions.has(observable) || roots.has(observable)) {
      return observable;
    }

    const root = pendingTargetsDetails.has(observable)
      ? observable
      : observe(observable, {preventApply: true});

    if (isFunc(observable)) {
      rootFunctions.add(root);
    } else {
      if (retainedRoots.has(root)) {
        retainedRoots.delete(root);
      }

      roots.add(root);
      setRoot(root, root);
      // maybe it already has pending children
      setObjPendingState(root);
    }

    return root;
  }

  function unroot(observable) {
    if (isFunc(observable)) {
      rootFunctions.delete(observable);
    } else {
      if (roots.has(observable)) {
        roots.delete(observable);

        if (observable.isPending) {
          retainedRoots.add(observable);
        } else {
          unsetRoot(observable, observable);
        }
      }
    }
  }

  function ignore(observable) {
    if (pendingTargetsDetails.has(observable)) {
      throw new Error('Observed non-promise object or function cannot be ignored.');
    }

    if (isFunc(observable) || isObj(observable)) {
      ignoredItems.add(observable);
    }

    return observable;
  }

  function isObservedObject(value) {
    return !isFunc(value) && pendingTargetsDetails.has(value);
  }

  function* getChildrenPendingTargets(obj, visited = new Set()) {
    visited.add(obj);

    const keys = Reflect.ownKeys(obj);

    for (const key of keys) {
      const child = getPropObj(obj, key);

      if (child) {
        if (visited.has(child)) {
          continue;
        }

        if (pendingTargetsDetails.has(child)) {
          visited.add(child);

          yield child;
        } else {
          yield* getChildrenPendingTargets(child, visited);
        }
      }
    }
  }

  function pendingDecorate(obj) {
    if (hasOwnProp(obj, 'isPending') || hasOwnProp(obj, 'pending')) {
      throw new Error('Observed object or function must not have an \'isPending\''
        + ' or \'pending\' property.');
    }

    const pendingDetails = new Map();

    if (!isFunc(obj)) {
      pendingDetails.roots = new Set();
      pendingDetails.children = Array.from(getChildrenPendingTargets(obj));
    }

    definePropValue(obj, 'isPending', false);
    definePropValue(obj, 'pending', {
      has: key => pendingDetails.has(key)
    });

    pendingTargetsDetails.set(obj, pendingDetails);

    return obj;
  }

  function setRoot(obj, root) {
    const objPendingDetails = pendingTargetsDetails.get(obj);

    objPendingDetails.roots.add(root);
    objPendingDetails.children.forEach(child => setRoot(child, root));
  }

  function unsetRoot(obj, root) {
    const objPendingDetails = pendingTargetsDetails.get(obj);

    objPendingDetails.roots.delete(root);
    objPendingDetails.children.forEach(child => unsetRoot(child, root));
  }

  function unsetUnreachableRoot(obj, root) {
    if (!isDescendantOfOrEqual(obj, root)) {
      const objPendingDetails = pendingTargetsDetails.get(obj);

      objPendingDetails.roots.delete(root);

      objPendingDetails.children.forEach(child => unsetUnreachableRoot(child, root));
    }
  }

  function isActualRoot(root) {
    // an actual root only has itself as a root
    return pendingTargetsDetails.get(root).roots.size === 1;
  }

  function getObjectsActualRoots(objects) {
    // always add retained roots and objects

    const objectsActualRoots = new Set(retainedRoots);

    retainedObjects.forEach(obj => objectsActualRoots.add(obj));

    objects.forEach(obj => {
      const objRoots = pendingTargetsDetails.get(obj).roots;

      if (objRoots) {
        objRoots.forEach(root => {
          if (isActualRoot(root)) {
            objectsActualRoots.add(root);
          }
        });
      }
    });

    return objectsActualRoots;
  }

  function setPendingState(objects) {
    const resolvedObjects = new Set();

    getObjectsActualRoots(objects).forEach(obj => setObjPendingState(obj, resolvedObjects));
    unrootRetainedRoots();
    updateRetainedObjectsList();
  }

  function unrootRetainedRoots() {
    retainedRoots.forEach(root => {
      if (!root.isPending) {
        retainedRoots.delete(root);
        unsetRoot(root, root);
      }
    });
  }

  function updateRetainedObjectsList() {
    retainedObjects.forEach(obj => {
      if (!obj.isPending) {
        retainedObjects.delete(obj);
      }
    });
  }

  function setObjPendingState(obj, resolved = new Set()) {
    const objPendingDetails = pendingTargetsDetails.get(obj);
    let isPending = !!objPendingDetails.size;

    if (objPendingDetails.children) {
      objPendingDetails.children.forEach(child => {
        if (resolved.has(child)) {
          if (child.isPending) {
            isPending = true;
          }

          return;
        }

        setObjPendingState(child, resolved);

        if (child.isPending) {
          isPending = true;
        }
      });
    }

    obj.isPending = isPending;

    resolved.add(obj);
  }

  function isDescendantOfOrEqual(child, obj) {
    if (child === obj) {
      return true;
    }

    const objPendingDetails = pendingTargetsDetails.get(obj);

    return objPendingDetails.children.some(objChild => isDescendantOfOrEqual(child, objChild));
  }

  function addObservedChild(obj, child) {
    if (!isObservedObject(obj)) {
      throw new Error('Trying to add child to non-observed object.');
    }

    if (!isObservedObject(child)) {
      throw new Error('Trying to add non-observed child.');
    }

    if (isDescendantOfOrEqual(obj, child)) {
      throw new Error('The child is an ascendant of the object or is the same object.');
    }

    const objPendingDetails = pendingTargetsDetails.get(obj);

    if (objPendingDetails.children.includes(child)) {
      return;
    }

    objPendingDetails.children.push(child);

    objPendingDetails.roots.forEach(root => setRoot(child, root));

    setPendingState(new Set([obj]));
  }

  function removeObservedChild(obj, child) {
    if (!isObservedObject(obj)) {
      throw new Error('Trying to remove child of non-observed object.');
    }

    if (!isObservedObject(child)) {
      throw new Error('Trying to remove non-observed child.');
    }

    const objPendingDetails = pendingTargetsDetails.get(obj);
    const childIndex = objPendingDetails.children.indexOf(child);

    if (childIndex === -1) {
      throw new Error('Trying to remove non-child.');
    }

    objPendingDetails.children.splice(childIndex, 1);

    const childPendingDetails = pendingTargetsDetails.get(child);

    childPendingDetails.roots.forEach(root => unsetUnreachableRoot(child, root));

    if (child.isPending) {
      if (!childPendingDetails.roots.size) {
        retainedObjects.add(child);
      }

      setPendingState(new Set([obj]));
    }
  }

  function on(cb) {
    if (!isFunc(cb)) {
      throw new Error('Notify argument must be a function');
    }

    notifyCbs.add(cb);
  }

  function off(cb) {
    if (!isFunc(cb)) {
      throw new Error('Notify argument must be a function');
    }

    notifyCbs.delete(cb);
  }

  const moduleExports = {
    observe,
    root,
    unroot,
    ignore,
    isObservedObject,
    isReliablyObservable,
    addObservedChild,
    removeObservedChild,
    on,
    off
  };

  if (isModule) {
    module.exports = moduleExports;
  } else {
    window.crizmas.observe = moduleExports;
  }
})();
