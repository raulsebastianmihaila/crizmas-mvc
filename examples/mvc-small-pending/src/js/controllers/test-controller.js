import Mvc from 'crizmas-mvc';

export default Mvc.root({
  child: Mvc.observe({
    childOperation() {
      return {
        then(resolve) {
          setTimeout(resolve, 1000);
        }
      };
    }
  }),

  firstOperation() {
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  },

  secondOperation() {
    return new Promise(resolve => {
      setTimeout(resolve, 4000);
    });
  }
});
