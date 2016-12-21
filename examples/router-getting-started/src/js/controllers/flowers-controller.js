import Mvc from 'crizmas-mvc';

export default Mvc.controller(class FlowersController {
  constructor() {
    this.count = 0;
  }

  onEnter() {
    alert('Entering the flowers page');
  }

  onLeave() {
    alert('Leaving the flowers page');
  }

  increaseCount() {
    this.count += 1;
  }
});
