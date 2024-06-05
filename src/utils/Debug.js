import { DEBUG_SHOW_COLLISIONS } from "../config.js";

class DebugUtils {
  static instance;
  /**
   * Returns an instance of the DebugUtils class. If an instance does not exist,
   * it creates a new one and returns it.
   *
   * @return {DebugUtils} The instance of the DebugUtils class.
  */
  static getInstance() {
    if (!DebugUtils.instance) {
      DebugUtils.instance = new DebugUtils();
    }
    return DebugUtils.instance;
  }

  configDebugUtils(app) {
    this.app = app;
  }

  drawGraphics(graphics) {
    if (DEBUG_SHOW_COLLISIONS) {
      console.log("first",graphics)
      this.app.stage.addChild(graphics);
    }
  }
}

export default DebugUtils.getInstance();