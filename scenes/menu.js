export class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }
  preload() {}
  create() {
    this.add.image(160, 120, "fish").setScale(0.5);
  }
  update() {}
}
