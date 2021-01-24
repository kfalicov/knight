// asset import syntax for parcel
import fish from "url:../assets/red herring.png";
import chain from "url:../assets/chain.png";
import knightimg from "url:../assets/knight.png";
import knightjson from "url:../assets/knight.json";
import background from "url:../assets/background.png";

export class Loader extends Phaser.Scene {
  constructor() {
    super("Loader");
  }
  preload() {
    /**
     * put all of the loading scripts here
     */
    this.load.image("fish", fish);
    this.load.spritesheet("chain", chain, { frameWidth: 8, frameHeight: 8 });
    this.load.atlas("knight", knightimg, knightjson);
    this.load.image("background", background);
  }
  create() {
    //start the next scene in the scene list (found in main.js's config object) after preloading is completed
    this.scene.manager.switch("Loader", "Game");
  }
}
