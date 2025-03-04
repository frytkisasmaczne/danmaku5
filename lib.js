'use strict'
import randomUUID from 'node:crypto';

class UUIDs {
  constructor() {
    if (UUIDs._instance) {
      return UUIDs._instance;
    }
    UUIDs._instance = this;
  };
  list = [];

}

class Face {
  constructor(types, fn) {
    this.uuid = randomUUID();
    UUIDs().list.push(this.uuid);
    this.types = types;
    this.fn = fn;
  }

}

class Card {
  constructor(name, img, faces) {
    this.uuid = randomUUID();
    UUIDs().list.push(this.uuid);
    this.name = name;
    this.img = img;
    this.faces = faces;
    for (let face in this.faces) {
      face.parent = this;
    }
  }

}



export { Card };