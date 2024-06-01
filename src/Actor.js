import { BASE_FORCE } from "./config.js";

class Actor {
  static INPUT_MODE = {
    ADD: 0,
    SET: 1,
  };

  isMoving = {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  };

  constructor(screen, texture, x, y, scale) {
    this.actor = new PIXI.Sprite(texture);
    this.actor.anchor.set(0.5);
    // Move the sprite to the center of the screen
    this.actor.x = x;
    this.actor.y = y;
    this.actor.scale.set(scale);

    this.xForce = 0;
    this.yForce = 0;

    this.xBounds = {
      min: 0 + this.actor.width,
      max: screen.width - this.actor.width,
    };
    this.yBounds = {
      min: 0 + this.actor.height,
      max: screen.height - this.actor.height,
    };
  }
  getActor() {
    return this.actor;
  }
  transform(x, y, mode = Actor.INPUT_MODE.ADD) {
    if (mode === Actor.INPUT_MODE.ADD) {
      if((this.actor.x + x) < (this.xBounds.max) && (this.actor.x + x) > (this.xBounds.min)) {
        this.actor.x += x;
      }
      if((this.actor.y + y) < (this.yBounds.max) && (this.actor.y + y) > (this.yBounds.min)) {
        this.actor.y += y;
      }
    } else if (mode === Actor.INPUT_MODE.SET) {
      this.actor.x = x;
      this.actor.y = y;
    }
  }
  configForce(x, y, mode = Actor.INPUT_MODE.ADD) {
    if (mode === Actor.INPUT_MODE.ADD) {
      this.xForce += x;
      this.yForce += y;
    } else if (mode === Actor.INPUT_MODE.SET) {
      this.xForce = x;
      this.yForce = y;
    }
  }
  calculateMovement(delta) {
    this.configForce(
      BASE_FORCE * (this.isMoving.RIGHT ? 1 : 0) - BASE_FORCE * (this.isMoving.LEFT ? 1 : 0),
      BASE_FORCE * (this.isMoving.DOWN ? 1 : 0) - BASE_FORCE * (this.isMoving.UP ? 1 : 0),
      Actor.INPUT_MODE.SET
    )
    this.transform(this.xForce * delta, this.yForce * delta);
  }
}

export default Actor;