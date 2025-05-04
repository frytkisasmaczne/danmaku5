import { v4 as uuidv4 } from 'uuid';

class Card {
  constructor(name, img, fn) {
    this.uuid = uuidv4();
    this.name = name;
    this.img = img;
    this.fn = fn;
  }

}

class Change {
  constructor(parent, type, effect) {
    this.parent = parent;
    this.type = type;
    this.effect = effect;
  }
}

class Sema {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export { Card, Change, Sema };