import Actor from "./Actor.js";
import Item from "./Item.js";
import Collision from "./core/Collision.js";
import DebugUtils from "./utils/Debug.js";
const Assets = PIXI.Assets;

class Game {
  static gameOver = false;
  static collisions = [];

  /**
   * Checks for collisions within a given rectangle.
   *
   * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
   * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
   * @param {number} width - The width of the rectangle.
   * @param {number} height - The height of the rectangle.
   * @return {{x: boolean, y: boolean, collidedObjects: Array}} An object indicating the collision status in the x and y directions.
   */
  static checkCollisions(prevCollision, x, y, width, height) {
    const collisionResponse = { x: true, y: true, collidedObjects: [] };
    const x2 = x + width;
    const y2 = y + height;
    const px = prevCollision.x;
    const py = prevCollision.y;
    const px2 = px + prevCollision.width;
    const py2 = py + prevCollision.height;

    //Handling Boundary Cases (Inner Collision)
    this.collisions
      .filter((collision) => collision.type == Collision.Types.BOUNDARY)
      .forEach((collision) => {
        // let didCollide = false;
        if (!(x2 < collision.x + collision.width && x > collision.x)) {
          collisionResponse.x = false;
          // didCollide = true;
        }
        if (!(y2 < collision.y + collision.height && y > collision.y)) {
          collisionResponse.y = false;
          // didCollide = true;
        }
        // if (didCollide) collisionResponse.collidedObjects.push(collision.object);
      });

    //Handling Object and Item Collision
    this.collisions
      .filter((collision) => [Collision.Types.ITEM, Collision.Types.OBJECT].includes(collision.type))
      .forEach((collision) => {
        let didCollide = false;
        if (
          x2 > collision.x &&
          x < collision.x + collision.width &&
          py2 > collision.y &&
          py < collision.y + collision.height
        ) {
          if(collision.type == Collision.Types.OBJECT) { // All Types of Collisions that block movement
            collisionResponse.x = false;
          }
          didCollide = true;
        }
        if (
          y2 > collision.y &&
          y < collision.y + collision.height &&
          px2 > collision.x &&
          px < collision.x + collision.width
        ) {
          if(collision.type == Collision.Types.OBJECT) { // All Types of Collisions that block movement
            collisionResponse.y = false;
          }
          didCollide = true;
        }
        if (didCollide) collisionResponse.collidedObjects.push(collision);
      });
    // console.log("collisionResponse",collisionResponse)
    return collisionResponse;
  }

  static removeCollision(collision) {
    this.collisions.splice(this.collisions.indexOf(collision), 1);
  }

  static async start(app) {
    this.gameOver = false;
    const bunnyTexture = await Assets.load("/assets/bunny.png");
    const carrotTexture = await Assets.load("/assets/carrot.png");

    //Creating World Boundary
    this.collisions.push(new Collision(
      0 + 5,
      0 + 5,
      app.screen.width - 10,
      app.screen.height - 10,
      Collision.Types.BOUNDARY
    ));

    //Adding Carrot Items
    for (let i = 0; i < 10; i++) {
      const carrotX = Math.random() * (app.screen.width - 60) + 30;
      const carrotY = Math.random() * (app.screen.height - 60) + 30;
      const carrot = new Item(
        Item.Type.CARROT,
        carrotTexture,
        carrotX,
        carrotY,
        0.2
      );
      app.stage.addChild(carrot.item);
      console.log("Carrot Object Created", carrotX, carrotY);
      this.collisions.push(
        carrot.setCollisions(
          carrotX - carrot.item.width / 2 + 30,
          carrotY - carrot.item.height / 2 + 30,
          carrot.item.width - 60,
          carrot.item.height - 60
        )
      );
    }

    //Adding Main Character
    const bunny = new Actor(
      Actor.Type.PLAYER,
      bunnyTexture,
      app.screen.width / 2,
      app.screen.height / 2,
      1.6,
      app
    );
    app.stage.addChild(bunny.actor);
    bunny.setCollisions(
      bunny.actor.x - bunny.actor.width / 2,
      bunny.actor.y - bunny.actor.height / 2,
      bunny.actor.width,
      bunny.actor.height
    );

    //Add key listener
    document.addEventListener("keydown", (event) => {
      console.log("Key down: " + event.key);
      console.log("key repeat", event.repeat);
      console.log("Actor XY: ", bunny.actor.x, bunny.actor.y);
      if (event.repeat) return;
      if (event.key === "w") {
        bunny.isMoving.UP = true;
      }
      if (event.key === "a") {
        bunny.isMoving.LEFT = true;
      }
      if (event.key === "s") {
        bunny.isMoving.DOWN = true;
      }
      if (event.key === "d") {
        bunny.isMoving.RIGHT = true;
      }
    });
    document.addEventListener("keyup", (event) => {
      console.log("Key up: " + event.key);
      if (event.key === "w") {
        bunny.isMoving.UP = false;
      }
      if (event.key === "a") {
        bunny.isMoving.LEFT = false;
      }
      if (event.key === "s") {
        bunny.isMoving.DOWN = false;
      }
      if (event.key === "d") {
        bunny.isMoving.RIGHT = false;
      }
    });

    app.ticker.add((delta) => {
      bunny.calculateMovement(delta, this.collisions);
    });
  }
}

export default Game;
