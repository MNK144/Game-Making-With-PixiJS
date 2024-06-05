import DebugUtils from "../utils/Debug.js";

class Collision {
  static Types = {
    PLAYER: "player",
    ITEM: "item",
    BOUNDARY: "boundary",
    OBJECT: "object",
    ENEMY: "enemy",
  }
  constructor(x, y, width, height, type, object) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.object = object;
    this.type = type;
    this.graphics = new PIXI.Graphics();
    this.graphics.lineStyle(2, 0xde3249, 1);
    this.graphics.drawRect(x, y, width, height);
    DebugUtils.drawGraphics(this.graphics);
  }

  /**
   * Updates the position of the object by adding the given x and y coordinates.
   * If the object has a graphics object, it also updates the position of the graphics object.
   *
   * @param {number} x - The amount to add to the x coordinate.
   * @param {number} y - The amount to add to the y coordinate.
   */
  updatePosition(x, y) {
    this.x += x;
    this.y += y;
    if(this.graphics) {
      this.graphics.x += x;
      this.graphics.y += y;
    }
  }
}

export default Collision;