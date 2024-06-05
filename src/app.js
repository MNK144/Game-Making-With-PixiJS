import Game from "./Game.js";
import DebugUtils from "./utils/Debug.js";
const Application = PIXI.Application;

async function main() {
  const app = new Application({
    background: "#1099bb",
    width: 1250,
    height: 800,
    // resizeTo: document.getElementById("container"),
    antialias: true,
    transparent: false,
  });
  document.getElementById("container").append(app.view);
  
  DebugUtils.configDebugUtils(app);
  await Game.start(app);
}
main();
