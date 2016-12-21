export class Flower {
  static validateName(name) {
    if (!name.endsWith('flower')) {
      return 'The name must end with flower';
    }
  }

  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
}

export default {
  items: [
    new Flower('Red flower', 'red'),
    new Flower('Blue flower', 'blue'),
    new Flower('Pink flower', 'green')
  ],

  addFlower(name, color) {
    this.items.push(new Flower(name, color));
  }
};
