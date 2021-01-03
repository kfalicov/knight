import Phaser from "phaser";
import { Game } from "./scenes/game";

import { Loader } from "./scenes/loader";
import { Menu } from "./scenes/menu";

const config = {
  type: Phaser.WEBGL,
  canvas:document.getElementById('game'),
  width: 320,
  height: 240,
  scale: {
    zoom: Phaser.Scale.MAX_ZOOM,
  },
  render: {
    pixelArt: true,
  },
  title: "phaser-parcel",
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
      // debug:true
    },
  },
  /** the available scenes for this game */
  scene: [Loader, Menu, Game],
};

window.addEventListener(
  "resize",
  function (event) {
    game.scale.setMaxZoom();
  },
  false
);

export const game = new Phaser.Game(config);
