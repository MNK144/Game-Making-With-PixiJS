import Game from "./Game.js";
const Application = PIXI.Application;

async function main() {
  const app = new Application({
    background: "#1099bb",
    resizeTo: document.getElementById("container"),
    antialias: true,
    transparent: false,
  });
  document.getElementById("container").append(app.view);
  
  const game = new Game();
  await game.start(app);
}
main();
