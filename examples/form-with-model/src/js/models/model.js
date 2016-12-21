export default {
  x: 100,
  y: 101,

  setX(value) {
    this.x = value;
    this.y = this.x + 1;
  },

  validateX() {
    if (this.x % 100 !== 0) {
      return 'x must be divisible by 100';
    }
  }
};
