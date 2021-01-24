import * as THREE from "three";

import gradientMap from "url:../assets/red herring.png";
import brick from "url:../assets/red herring.png";
import brick_normal from "url:../assets/red herring.png";
import brick_ao from "url:../assets/red herring.png";
import { Chain } from "../objects/Chain";

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  preload() {}
  create() {
    // var chain = new Chain(this, 120, 120, { n: 4, texture: "chain" });
    const verts = [];
    const constraints = [];
    const debug = [];
    for (let i = 0; i < 2; i++) {
      debug.push(this.add.image(0, 0, "chain"));
      verts.push({
        x: 120 + i * 5,
        y: 120 + i * 5,
        last: { x: 120 + i * 5, y: 120 + i * 5 },
      });
    }
    for (let i = 1; i < verts.length; i++) {
      constraints.push({
        stiffness: 1,
        rest: 30,
        solve: function () {
          const { x: x1, y: y1 } = verts[i - 1];
          const { x: x2, y: y2 } = verts[i];
          const diffX = x2 - x1;
          const diffY = y2 - y1;
          const d = Math.sqrt(diffX * diffX + diffY * diffY);
          const difference = (this.rest - d) / d;
          const translateX = diffX * 0.5 * difference;
          const translateY = diffY * 0.5 * difference;
          verts[i - 1] = {
            ...verts[i - 1],
            x: x1 - translateX,
            y: y1 - translateY,
          };
          verts[i] = { ...verts[i], x: x2 + translateX, y: y2 + translateY };
        },
      });
    }
    // phys[0].acc.y = 0;
    this.verts = verts;
    this.debug = debug;
    this.constraints = constraints;
    debug[0].setPosition(120, 120);
    debug[0].setInteractive();
    this.input.setDraggable(debug[0]);
    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
      verts[0] = { ...verts[0], x: dragX, y: dragY };
    });
    this.acc = { x: 0, y: 0.01 };
  }
  update(time, delta) {
    // console.log(delta);
    const { x: ox, y: oy } = this.verts[0];
    for (let i = 0; i < this.verts.length; i++) {
      const { x, y, last } = this.verts[i];
      const { x: xAcc, y: yAcc } = this.acc;
      const xVel = x - last.x;
      const yVel = y - last.y;

      const next = { x: x + xVel + xAcc * delta, y: y + yVel + yAcc * delta };
      this.verts[i] = { last: { x, y }, ...next };
      // console.log(this.verts[i]);
      this.debug[i].setPosition(next.x, next.y);
    }
    //fix the start point
    this.verts[0] = { ...this.verts[0], x: ox, y: oy };
    //fix the endpoint
    // this.verts[this.verts.length-1] = {...this.verts[this.verts.length-1], x:120,y:120};
    for (let i = 0; i < 3; i++) {
      for (let c of this.constraints) {
        c.solve();
      }
      //fix the start point
      this.verts[0] = { ...this.verts[0], x: ox, y: oy };
      //fix the endpoint
      // this.verts[this.verts.length-1] = {...this.verts[this.verts.length-1], x:120,y:120};
    }
  }
}
