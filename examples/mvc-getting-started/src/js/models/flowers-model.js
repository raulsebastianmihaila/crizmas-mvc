export class Flower {
  static validateName(name) {
    if (!name.endsWith('flower')) {
      return 'The name must end with flower';
    }
  }

  constructor(name, daysLeft = 50) {
    this.name = name;
    this.daysLeft = daysLeft;
  }

  get isAlive() {
    return this.daysLeft > 0;
  }

  randomizeAge() {
    if (this.isAlive) {
      this.daysLeft -= Math.ceil(Math.random() * this.daysLeft);
    }
  }
}

export default {
  items: [
    new Flower('Red flower'),
    new Flower('Blue flower'),
    new Flower('Pink flower')
  ],

  addFlower(name, daysLeft) {
    this.items.push(new Flower(name, daysLeft));
  },

  randomizeAges() {
    this.items.forEach(flower => flower.randomizeAge());
  }
};
