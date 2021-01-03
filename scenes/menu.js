export class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }
  preload() {}
  create() {
    let fish = this.add.image(160, 120, "fish").setScale(0.5);
    fish.setInteractive().on("pointerdown", () => {
      /**
       * start the 'game' scene
       */
      this.scene.manager.switch("Menu", "Game");
    });
  }
  update() {}
}
