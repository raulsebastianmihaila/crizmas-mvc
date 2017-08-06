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

  let currentNotificationTrigger = 0;
  const notifyCbs = new Set();
  const ignoredItems = new WeakSet();
  // <function - observed function> map used for reusing already observed functions when
  // the same original function is observed
  const observedFunctionsMap = new WeakMap();
  // <observed obj or func - pending details> map.
  // the pending details is a <key - wrapper promises set> map that holds the pending wrapper
  // promises for that key for that particular object. for observed objects, the pending details
  // also hold the associated managed roots and children
  const pendingTargetsDetailsMap = new WeakMap();
  // <promise - pending wrapper promise> map. a wrapper promise is used for managing
  // the pending state and notifying when the promise is settled
  const pendingWrapperPromisesMap = new WeakMap();
  // <promise wrapper - entries> map that holds an entries array. an entry is an object
  // with obj and key properties, that represent the associated object and key
  // of the pending operation (the same wrapper promise can be returned from different
  // pending operations).
  const pendingWrapperEntriesMap = new Map();
  const roots = new WeakSet();
  const rootFunctions = new WeakSet();
  const retainedRoots = new Set();
  const retainedObjects = new Set();

  const hasOwnProp = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

  const getPropRegularObject = (obj, prop) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(obj, prop);

    if (descriptor && isObj(descriptor.value) && !isPromise(descriptor.value)) {
      return descriptor.value;
    }
  };

  const getPropFunc = (obj, prop) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(obj, prop);

    if (descriptor && isFunc(descriptor.value)) {
      return descriptor.value;
    }
  };

  const definePropValue = (obj, prop, value, writable = true) => {
    // make sure it throws if the prop cannot be defined
    if (!Reflect.defineProperty(obj, prop, {
      value,
      writable,
      enumerable: false,
      configurable: true
    })) {
      throw new Error('Cannot define property');
    }
  };

  const observe = (observable, {key, preventApply} = {}) => {
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
  };

  const observeFunction = (observableFunc, key, visitedObjects, visitedFunctions, preventApply) => {
    if (ignoredItems.has(observableFunc) || visitedFunctions.has(observableFunc)) {
      return observableFunc;
    }

    let observedFunction;

    if (pendingTargetsDetailsMap.has(observableFunc)) {
      observedFunction = observableFunc;
    } else {
      observedFunction = observedFunctionsMap.get(observableFunc);

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

        observedFunctionsMap.set(observableFunc, observedFunction);
      }
    }

    visitedFunctions.add(observedFunction);
    observeObject(observedFunction, visitedObjects, visitedFunctions);

    const proto = getPropRegularObject(observableFunc, 'prototype');

    if (proto) {
      observeObject(proto, visitedObjects, visitedFunctions);
    }

    return observedFunction;
  };

  const programNotification = () => {
    currentNotificationTrigger += 1;
  };

  const checkNotify = (hasError) => {
    currentNotificationTrigger -= 1;

    // don't notify in case of error because we want to prevent possible side effects
    if (!hasError && !currentNotificationTrigger) {
      notify();
    }
  };

  const notify = () => {
    notifyCbs.forEach((cb) => cb());
  };

  const observePromise = (promise, obj, key) => {
    const isMethod = key && pendingTargetsDetailsMap.has(obj);

    if (!isMethod && ignoredItems.has(promise)) {
      return promise;
    }

    const pendingPromise = checkPendingPromise(promise, obj, key, isMethod);

    if (pendingPromise) {
      return pendingPromise;
    }

    const pendingWrapperPromise = ignore(resolveThenable(ignore(promise)).then((res) => {
      unsetPendingProp(pendingWrapperPromise, promise);
      notify();

      return res;
    }, (err) => {
      unsetPendingProp(pendingWrapperPromise, promise);
      notify();

      throw err;
    }));

    const pendingWrapperEntries = [];

    pendingWrapperEntriesMap.set(pendingWrapperPromise, pendingWrapperEntries);
    pendingWrapperPromisesMap.set(promise, pendingWrapperPromise);

    if (isMethod) {
      return setObjPendingPromise(pendingWrapperPromise, obj, key, pendingWrapperEntries);
    }

    return pendingWrapperPromise;
  };

  const checkPendingPromise = (promise, obj, key, isMethod) => {
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
  };

  const setObjPendingPromise = (pendingWrapperPromise, obj, key, pendingWrapperEntries) => {
    const objPendingDetails = pendingTargetsDetailsMap.get(obj);
    const objKeyPromises = objPendingDetails.get(key);

    if (objKeyPromises) {
      if (objKeyPromises.has(pendingWrapperPromise)) {
        return pendingWrapperPromise;
      }

      objKeyPromises.add(pendingWrapperPromise);
    } else {
      objPendingDetails.set(key, new Set([pendingWrapperPromise]));
    }

    pendingWrapperEntries.push({obj, key});
    setPendingState(new Set([obj]));

    return pendingWrapperPromise;
  };

  const setPendingState = (objects) => {
    const managedTrees = getManagedTreesFrom(objects);

    if (managedTrees) {
      const resolvedObjects = new Set();

      managedTrees.forEach((obj) => setObjPendingState(obj, resolvedObjects));
      unrootRetainedRoots();
      updateRetainedObjectsList();
    }
  };

  const getManagedTreesFrom = (objects) => {
    const managedTrees = new Set();
    let objectsFound = false;

    objects.forEach((obj) => {
      if (isObj(obj)) {
        objectsFound = true;

        pendingTargetsDetailsMap.get(obj).roots.forEach((root) => {
          if (isActualRoot(root)) {
            managedTrees.add(root);
          }
        });
      }
    });

    if (!objectsFound) {
      // the objects set contains only functions and functions can not be isPending and
      // therefore can not affect the pending state of the managed trees.
      return null;
    }

    // always add retained roots and objects

    retainedRoots.forEach((obj) => managedTrees.add(obj));
    retainedObjects.forEach((obj) => managedTrees.add(obj));

    return managedTrees;
  };

  const isActualRoot = (root) => {
    // an actual root only has itself as a root
    return pendingTargetsDetailsMap.get(root).roots.size === 1;
  };

  const setObjPendingState = (obj, resolved = new Set()) => {
    const objPendingDetails = pendingTargetsDetailsMap.get(obj);
    let isPending = !!objPendingDetails.size;

    if (objPendingDetails.children) {
      objPendingDetails.children.forEach((child) => {
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
  };

  const unrootRetainedRoots = () => {
    retainedRoots.forEach((root) => {
      if (!root.isPending) {
        retainedRoots.delete(root);
        unsetRoot(root, root);
      }
    });
  };

  const unsetRoot = (obj, root) => {
    const objPendingDetails = pendingTargetsDetailsMap.get(obj);

    objPendingDetails.roots.delete(root);
    objPendingDetails.children.forEach((child) => unsetRoot(child, root));
  };

  const updateRetainedObjectsList = () => {
    retainedObjects.forEach((obj) => {
      if (!obj.isPending) {
        retainedObjects.delete(obj);
      }
    });
  };

  const ignore = (observable) => {
    if (pendingTargetsDetailsMap.has(observable)) {
      throw new Error('Observed non-promise object or function cannot be ignored.');
    }

    if (isFunc(observable) || isObj(observable)) {
      ignoredItems.add(observable);
    }

    return observable;
  };

  const unsetPendingProp = (pendingWrapperPromise, basePromise) => {
    pendingWrapperPromisesMap.delete(basePromise);

    const pendingWrapperEntries = pendingWrapperEntriesMap.get(pendingWrapperPromise);

    pendingWrapperEntriesMap.delete(pendingWrapperPromise);

    // don't risk traversing any tree of objects if there were no objects associated.
    // (for instance retained roots might be traversed in vain)
    if (pendingWrapperEntries.length) {
      const objects = new Set();

      pendingWrapperEntries.forEach(({obj, key}) => {
        const objPendingDetails = pendingTargetsDetailsMap.get(obj);
        const objKeyPromises = objPendingDetails.get(key);

        objKeyPromises.delete(pendingWrapperPromise);

        if (!objKeyPromises.size) {
          objPendingDetails.delete(key);
        }

        objects.add(obj);
      });

      setPendingState(objects);
    }
  };

  const root = (observable) => {
    if (!isReliablyObservable(observable)) {
      throwOnNonRootable();
    }

    if (rootFunctions.has(observable) || roots.has(observable)) {
      return observable;
    }

    const root = pendingTargetsDetailsMap.has(observable)
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
  };

  const isReliablyObservable = (value) => {
    // this should be used by APIs that make the code clearer by marking values
    // as observable (e.g. roots)
    return (isFunc(value) || isObj(value) && !isPromise(value))
      && !ignoredItems.has(value);
  };

  const throwOnNonRootable = () => {
    throw new Error('Root must be either a function or a non-promise object and it must'
      + ' not be ignored.');
  };

  const setRoot = (obj, root) => {
    const objPendingDetails = pendingTargetsDetailsMap.get(obj);

    objPendingDetails.roots.add(root);
    objPendingDetails.children.forEach((child) => setRoot(child, root));
  };

  const observeCbPromise = (promise, cb) => {
    // we must observe and notify without caring if the
    // promise was previously ignored because
    // there are cases where the cb must be executed anyway and it can have side effects.
    // for instance if the cb is the observe function and the input is an object, it will
    // reobserve it which can lead to new methods on the object to be replaced with observed
    // ones.
    // theoretically if the promise resulted from calling the same callback
    // and if the callback would have the same result with no new side effects
    // the promise could be reused, but we cannot know that.
    // calling observeCbPromise is a rare case anyway.
    // however the promise and the resulted promise after observePromise
    // must be ignored because they cannot have new side effects (in case they are returned
    // from other observed functions in the future).
    // also at this point we cannot return a reused wrapper promise based on promise itself
    // because what happens in cb determines the control flow
    // and we wouldn't want a callback to decide the settlment of a cached promise.
    // if we wanted to reuse a cached wrapper promise based on promise, instead of
    // the resolveThenable(ignore(promise)) part of the expression below, we could
    // use observePromise for that, but in that case we basically observe two promises which
    // trigger the notifications twice (because we call observePromise twice with two
    // different inputs), which is what we want to avoid.
    // if the input promise will be used separately again, a wrapper promise will be created
    // then and it will be reusable, so we don't have to create it in advance.
    return observePromise(resolveThenable(ignore(promise)).then(cb));
  };

  const observeObject = (observableObj, visitedObjects, visitedFunctions) => {
    if (ignoredItems.has(observableObj) || visitedObjects.has(observableObj)) {
      return observableObj;
    }

    visitedObjects.add(observableObj);

    if (!pendingTargetsDetailsMap.has(observableObj)) {
      pendingDecorate(observableObj);
    }

    Reflect.ownKeys(observableObj).forEach((prop) => {
      const method = getPropFunc(observableObj, prop);

      if (method && !ignoredItems.has(method)) {
        const alreadyObserved = pendingTargetsDetailsMap.has(method);
        const observedFunction = observeFunction(method, prop, visitedObjects, visitedFunctions);

        if (!alreadyObserved) {
          Reflect.defineProperty(observableObj, prop, {value: observedFunction});
        }
      }
    });

    return observableObj;
  };

  const pendingDecorate = (obj) => {
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
      has: (key) => pendingDetails.has(key)
    }, false);

    pendingTargetsDetailsMap.set(obj, pendingDetails);

    return obj;
  };

  function* getChildrenPendingTargets(obj, visited = new Set()) {
    visited.add(obj);

    const keys = Reflect.ownKeys(obj);

    for (const key of keys) {
      const child = getPropRegularObject(obj, key);

      if (child && !visited.has(child)) {
        if (pendingTargetsDetailsMap.has(child)) {
          visited.add(child);

          yield child;
        } else {
          yield* getChildrenPendingTargets(child, visited);
        }
      }
    }
  }

  const unroot = (observable) => {
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
  };

  const addObservedChild = (obj, child) => {
    if (!isObservedObject(obj)) {
      throw new Error('Trying to add child to non-observed object.');
    }

    if (!isObservedObject(child)) {
      throw new Error('Trying to add non-observed child.');
    }

    if (isDescendantOfOrEqual(obj, child)) {
      throw new Error('The child is an ascendant of the object or is the same object.');
    }

    const objPendingDetails = pendingTargetsDetailsMap.get(obj);

    if (objPendingDetails.children.includes(child)) {
      return;
    }

    objPendingDetails.children.push(child);

    objPendingDetails.roots.forEach((root) => setRoot(child, root));

    setPendingState(new Set([obj]));
  };

  const isObservedObject = (value) => {
    return !isFunc(value) && pendingTargetsDetailsMap.has(value);
  };

  const isDescendantOfOrEqual = (child, obj) => {
    if (child === obj) {
      return true;
    }

    const objPendingDetails = pendingTargetsDetailsMap.get(obj);

    return objPendingDetails.children.some((objChild) => isDescendantOfOrEqual(child, objChild));
  };

  const removeObservedChild = (obj, child) => {
    if (!isObservedObject(obj)) {
      throw new Error('Trying to remove child of non-observed object.');
    }

    if (!isObservedObject(child)) {
      throw new Error('Trying to remove non-observed child.');
    }

    const objPendingDetails = pendingTargetsDetailsMap.get(obj);
    const childIndex = objPendingDetails.children.indexOf(child);

    if (childIndex === -1) {
      throw new Error('Trying to remove non-child.');
    }

    objPendingDetails.children.splice(childIndex, 1);

    const childPendingDetails = pendingTargetsDetailsMap.get(child);

    childPendingDetails.roots.forEach((root) => unsetUnreachableRoot(child, root));

    if (child.isPending) {
      if (!childPendingDetails.roots.size) {
        retainedObjects.add(child);
      }

      setPendingState(new Set([obj]));
    }
  };

  const unsetUnreachableRoot = (obj, root) => {
    if (!isDescendantOfOrEqual(obj, root)) {
      const objPendingDetails = pendingTargetsDetailsMap.get(obj);

      objPendingDetails.roots.delete(root);

      objPendingDetails.children.forEach((child) => unsetUnreachableRoot(child, root));
    }
  };

  const on = (cb) => {
    if (!isFunc(cb)) {
      throw new Error('Notify argument must be a function');
    }

    notifyCbs.add(cb);
  };

  const off = (cb) => {
    if (!isFunc(cb)) {
      throw new Error('Notify argument must be a function');
    }

    notifyCbs.delete(cb);
  };

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
