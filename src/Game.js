import Actor from "./Actor.js";
import Item from "./Item.js";
// import CarrotImage from "./assets/carrot.png"
const Assets = PIXI.Assets;
const Sprite = PIXI.Sprite;
const graphics = new PIXI.Graphics();

class Game {
  constructor() {
    this.score = 0;
    this.gameOver = false;
  }

  async start(app) {
    this.gameOver = false;
    const bunnyTexture = await Assets.load(
      "https://pixijs.com/assets/bunny.png"
    );

    const carrotTexture = await Assets.load("/assets/carrot.png");

    for(let i=0;i<100;i++){
      const gajarX = (Math.random() * (app.screen.width-60)) + 30;
      const gajarY = (Math.random() * (app.screen.height-60)) + 30;
      const carrot = new Item(
        app.screen,
        carrotTexture,
        gajarX,
        gajarY,
        0.2
      )
      app.stage.addChild(carrot.getItem());

      graphics.lineStyle(2, 0xde3249, 1);
      graphics.drawRect(gajarX - (carrot.item.width/2), gajarY - (carrot.item.height/2), carrot.item.width, carrot.item.height);
    }

    app.stage.addChild(graphics);
  
    const bunny = new Actor(
      app.screen,
      bunnyTexture,
      app.screen.width / 2,
      app.screen.height / 2,
      1.5
    );

    app.stage.addChild(bunny.getActor());

    //Add key listener
    document.addEventListener("keydown", (event) => {
      console.log("Key down: " + event.key);
      console.log("key repeat", event.repeat);
      console.log("Actor XY: ", bunny.actor.x, bunny.actor.y);
      console.log("Bunny Size: ", bunny.actor.width, bunny.actor.height);
      console.log(
        "Bunny",
        JSON.parse(JSON.stringify({ xf: bunny.xForce, yf: bunny.yForce }))
      );
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
      bunny.calculateMovement(delta);
    });
  }
}

export default Game;
