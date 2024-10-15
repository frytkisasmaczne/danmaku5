class Card {
  constructor(name, img, fn) {
    this.name = name;
    this.img = img;
    if (fn) {
      this.fn = fn;
    }
  }
}



export { Card };