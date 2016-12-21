import Mvc from 'crizmas-mvc';

function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

const obj1 = Mvc.observe({
  name: 1,

  func() {
    return delay(3000);
  }
});

const obj2 = Mvc.observe({
  name: 2,

  func() {
    return delay(2000);
  }
});

const obj3 = Mvc.root({
  name: 3,
  obj1,
  obj2
});

const obj4 = Mvc.root({
  name: 4,
  obj1
});

export default {
  obj1,
  obj2,
  obj3,
  obj4
};
