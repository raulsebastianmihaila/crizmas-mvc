export const isVal = (val) => {
  return val !== null && val !== undefined;
};

export const isObj = (val) => {
  return !!val && typeof val === 'object';
};

export const isFunc = (val) => {
  return typeof val === 'function';
};

export const isThenable = (val) => {
  return isObj(val) && isFunc(val.then);
};

export const resolveThenable = (thenable) => {
  if (thenable instanceof Promise) {
    return thenable;
  }

  return Promise.resolve(thenable);
};

export const awaitFor = (val, successFunc, errorFunc) => {
  if (isThenable(val)) {
    // make sure thenables are converted
    return resolveThenable(val).then(successFunc, errorFunc);
  }

  if (successFunc) {
    return successFunc(val);
  }

  return val;
};

export const awaitAll = (values, successFunc, errorFunc) => {
  if (!values) {
    if (successFunc) {
      return successFunc(values);
    }

    return values;
  }

  const successResults = [];
  const errorResults = [];
  let settledPromises = 0;
  let promisesCount = 0;
  let foundErrors = false;
  let resolve;
  let reject;

  errorResults.success = successResults;

  let index = -1;

  // values can be any iterable
  for (const value of values) {
    index += 1;

    const i = index;

    if (isThenable(value)) {
      promisesCount += 1;

      awaitFor(value, (result) => {
        successResults[i] = result;
        settledPromises += 1;

        if (settledPromises === promisesCount) {
          if (foundErrors) {
            reject(errorResults);
          } else {
            resolve(successResults);
          }
        }
      }, (result) => {
        foundErrors = true;
        errorResults[i] = result;
        settledPromises += 1;

        if (settledPromises === promisesCount) {
          reject(errorResults);
        }
      });
    } else {
      successResults[i] = value;
    }
  }

  if (promisesCount) {
    return new Promise((resolve_, reject_) => {
      resolve = resolve_;
      reject = reject_;
    }).then(successFunc, errorFunc);
  }

  if (successFunc) {
    return successFunc(successResults);
  }

  return successResults;
};

export function PromiseQueue({update, done, catch: catchCb} = {}) {
  let lastOperationId = 0;
  let lastSettledId = 0;
  let lifoPromise;
  let lifoResolve;
  let lifoReject;
  const awaitedPromises = new Set();
  const promiseQueue = {};

  promiseQueue.add = (promise) => {
    lastOperationId += 1;

    const promiseId = lastOperationId;

    awaitedPromises.add(promise);

    promise.then((res) => {
      if (!awaitedPromises.has(promise)) {
        return;
      }

      if (promiseId > lastSettledId) {
        if (update) {
          update(res);
        }

        if (promiseId === lastOperationId) {
          lifoResolve(res);
          awaitedPromises.clear();

          lifoPromise = null;
          lastOperationId = 0;
          lastSettledId = 0;

          if (done) {
            done(res);
          }
        } else {
          lastSettledId = promiseId;
        }
      }
    }, (err) => {
      if (!awaitedPromises.has(promise)) {
        return;
      }

      lifoReject(err);
      awaitedPromises.clear();

      lifoPromise = null;
      lastOperationId = 0;
      lastSettledId = 0;

      if (catchCb) {
        catchCb(err);
      }
    });

    if (!lifoPromise) {
      lifoPromise = new Promise((resolve, reject) => {
        lifoResolve = resolve;
        lifoReject = reject;
      });
    }

    return lifoPromise;
  };

  return promiseQueue;
}

export function Cancellation() {
  let cancellationReject;
  const abortCtrl = new AbortController();
  const cancellationPromise = new Promise((_, reject) => cancellationReject = reject);

  return {
    signal: abortCtrl.signal,

    cancellable: (operation) => Promise.race([cancellationPromise, operation]),

    cancel: (message) => {
      cancellationReject(new CancellationReason(message));
      abortCtrl.abort();

      return cancellationPromise;
    }
  };
}

export function CancellationReason(message) {
  return {
    message,
    isCancellation: true
  };
}
