import { angle, spring, rope, forcefield, Chain } from "../objects/Chain";

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  preload() {}
  create() {
    this.add.image(160, 120, "background").setScale(0.75);

    let plume = new Chain(
      this,
      9,
      { gravity: 0.01, wind: 0.0, drag: 0.2 },
      [
        angle(0, 2.09, 0.8),
        spring(0, 1, 3, 0.9),
        //try to continue the same angle as the previous point
        angle(1, 0, 0.6),
        spring(1, 2, 3, 0.6),
        angle(2, 0, 0.3),
        spring(2, 3, 3, 0.6),
        //dangly tassel
        angle(3, 0, 0.1),
        rope(3, 4, 4),
        rope(4, 5, 4),
        rope(5, 6, 4),
        rope(6, 7, 4),
        rope(7, 8, 4),
      ],
      [3, 0, 1, 2, 4, 4, 4]
    );
    // let plumeRender = this.add.rope(0, 0, "plumerope", undefined, plume.verts);
    let plumeRender = [];
    plumeRender.push(this.add.image(0, 0, "plume", 0));
    let knight = this.physics.add.sprite(120, 205, "knight");
    this.sys.updateList.add(plume);
    knight.body.useDamping = true;
    knight.body.drag.set(0.001, 0.1);
    knight.body.setMaxVelocityX(120);
    knight.body.setGravityY(1500);
    knight.body.setCollideWorldBounds(true);
    knight.body.onWorldBounds = true;
    knight.name = "knight";

    knight.anims.create({
      key: "run",
      frames: this.anims.generateFrameNames("knight", {
        prefix: "knight_",
        start: 1,
        end: 8,
        zeroPad: 2,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.physics.world.on("worldbounds", (body) => {
      if (body.gameObject.name === "knight") knight.jumpsRemaining = 2;
    });

    this.keys = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
      jump: "SPACE",
    });
    this.knight = knight;
    this.plume = plume;
    this.plumeRender = plumeRender;
  }
  update(time, delta) {
    this.plume.acc.x =
      Math.sin(time * 0.09) * 0.002 +
      Math.sin(time * 0.015) * 0.005 +
      Math.sin(time * 0.00007) * 0.008 +
      Math.sin(time * 0.007) * 0.002 +
      0.009;
    const { left, right, up, down, jump } = this.keys;
    let nextAnim = this.knight.anims.currentAnim;
    let xacc = 0;
    if (left.isDown) {
      xacc -= 300;
    }
    if (right.isDown) {
      xacc += 300;
    }
    if (jump.isDown && this.knight.canJump) {
      if (this.knight.jumpsRemaining > 0) {
        this.knight.setVelocityY(-500);
        this.knight.jumpsRemaining -= 1;
      }
      this.knight.canJump = false;
    } else if (jump.isUp) {
      this.knight.canJump = true;
    }
    if (up.isDown) {
    }
    if (down.isDown) {
    }
    if (xacc !== 0) {
      if (xacc < 0) {
        this.plume.constraints[0] = angle(0, 1.05, 0.8);
        this.knight.setFlipX(true);
      } else {
        this.plume.constraints[0] = angle(0, 2.09, 0.8);
        this.knight.setFlipX(false);
      }
      nextAnim = "run";
    } else {
      this.knight.anims.stop();
      this.knight.setFrame(0);
      nextAnim = null;
    }
    this.knight.setAccelerationX(xacc);

    this.knight.anims.timeScale =
      0.5 +
      Math.abs(this.knight.body.velocity.x) /
        (1.5 * this.knight.body.maxVelocity.x);

    const { index = 0 } = this.knight.anims.currentFrame ?? {};
    const { x: plumeX, y: plumeY } = plumeOffsets[nextAnim ? index : 0];

    nextAnim &&
      this.knight.play(
        {
          key: nextAnim,
          startFrame: 0,
        },
        true
      );
    this.plume.move(
      this.knight.body.x + 16 + (this.knight.flipX ? -plumeX : plumeX),
      this.knight.body.y + 16 + plumeY
    );
    // this.plumeRender[0].setPosition(
    //   this.plume.verts[0].x,
    //   this.plume.verts[0].y
    // );
    // this.plumeRender.setPoints(this.plume.verts);
    // this.plumeRender.setDirty();
  }
}

const plumeOffsets = [
  //the standing pos
  { x: -5, y: -11 },
  //the run animation
  { x: -5, y: -12 },
  { x: -5, y: -13 },
  { x: -4, y: -12 },
  { x: -3, y: -10 },
  { x: -4, y: -12 },
  { x: -4, y: -13 },
  { x: -3, y: -12 },
  { x: -2, y: -10 },
];
