import Collision from "./core/Collision.js";

class Item {
  static Type = {
    CARROT: "carrot",
  }
  constructor(type, texture, x, y, scale) {
    this.type = type;
    this.item = new PIXI.Sprite(texture);
    this.item.anchor.set(0.5);
    this.item.x = x;
    this.item.y = y;
    this.item.scale.set(scale);
  }
  setCollisions(x, y, width, height) {
    this.collision = new Collision(x, y, width, height, Collision.Types.ITEM, this);
    return this.collision;
  }
}

export default Item;