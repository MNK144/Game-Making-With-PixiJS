import Game from "./Game.js";
import Item from "./Item.js";
import { BASE_FORCE, CHILLY_MULTIPLIER } from "./config.js";
import Collision, {  } from "./core/Collision.js";

class Actor {
  static INPUT_MODE = {
    ADD: 0,
    SET: 1,
  };
  static Type = {
    PLAYER: "player",
    ENEMY: "enemy",
  }

  collision = {
    graphics: null,
    type: null,
    x: null,
    y: null,
    width: null,
    height: null,
  }

  isMoving = {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  };

  constructor(type, texture, x, y, scale) {
    this.actor = new PIXI.Sprite(texture);
    this.textures = {};
    this.primaryTexture = texture;
    this.actor.anchor.set(0.5);
    this.actor.x = x;
    this.actor.y = y;
    this.actor.scale.set(scale);

    this.type = type;
    this.xForce = 0;
    this.yForce = 0;
    this.forceMultiplier = 1;

    //For Powerups
    this.powerUps = {};
  }

  configAdditionalTextures(name, texture) {
    this.textures[name] = texture;
  }

  setCollisions(x, y, width, height) {
    this.collision = new Collision(x, y, width, height, Collision.Types.PLAYER, this);
    return this.collision;
  }

  /**
   * Handles the interaction with an item.
   *
   * @param {Collision} collidedObject - The object representing the collided item.
   * @return {void} This function does not return anything.
   */
  handleItemInteraction(collidedObject) {
    switch(collidedObject.object.type) { // Item Type
      case Item.Type.CARROT: {
        console.log("ITEM PICKED: CARROT")
        Game.app.stage.removeChild(collidedObject.object.item);
        delete collidedObject.object;
        collidedObject.graphics.destroy();
        Game.removeCollision(collidedObject);
        Game.setScore(100);
        break;
      }
      case Item.Type.CHILLY: {
        console.log("ITEM PICKED: CHILLY")
        Game.app.stage.removeChild(collidedObject.object.item);
        delete collidedObject.object;
        collidedObject.graphics.destroy();
        Game.removeCollision(collidedObject);
        Game.setScore(500);

        //Applying Speed Effect
        this.actor.texture = this.textures["bunnyFast"];
        this.forceMultiplier = CHILLY_MULTIPLIER;
        if(this.powerUps["chilly"]) clearTimeout(this.powerUps["chilly"]);
        this.powerUps["chilly"] = setTimeout(() => {
          this.forceMultiplier = 1;
          this.actor.texture = this.primaryTexture;
        }, 5000);
        break;
      }
      default: {
        console.error("No such item type: ", collidedObject.object.type);
        break;
      }
    }
  }

  transform(x, y, mode = Actor.INPUT_MODE.ADD) {
    if (mode === Actor.INPUT_MODE.ADD) {
      const collisionResponse = Game.checkCollisions(
        this.collision,
        this.collision.x + x, 
        this.collision.y + y, 
        this.collision.width + x, 
        this.collision.height + y
      );
      if(collisionResponse.x) {
        this.actor.x += x;
        if(this.collision) {
          this.collision.updatePosition(x, 0);
        } 
      }
      if(collisionResponse.y) {
        this.actor.y += y;
        if(this.collision) {
          this.collision.updatePosition(0, y);
        }
      }
      for(const collidedObject of collisionResponse.collidedObjects) {
        if(collidedObject.type === Collision.Types.ITEM) {
          this.handleItemInteraction(collidedObject);
        }
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
    this.transform(this.xForce * this.forceMultiplier * delta, this.yForce * this.forceMultiplier * delta);
  }
}

export default Actor;