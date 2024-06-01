
class Item {
  constructor(screen, texture, x, y, scale) {
    this.item = new PIXI.Sprite(texture);
    this.item.anchor.set(0.5);

    this.item.x = x;
    this.item.y = y;

    this.item.scale.set(scale);
  }
  getItem() {
    return this.item;
  }
}

export default Item;