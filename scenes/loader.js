// asset import syntax for parcel
import fish from "url:../assets/red herring.png";

export class Loader extends Phaser.Scene {
  constructor() {
    super("Loader");
  }
  preload() {
    /**
     * put all of the loading scripts here
     */
    this.load.image("fish", fish);
  }
  create() {
    //start the next scene in the scene list (found in main.js's config object) after preloading is completed
    this.scene.manager.scenes[1].scene.start();
  }
}
