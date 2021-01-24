export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  preload() {}
  create() {
    this.add.image(160, 120, "background").setScale(0.75);

    let knight = this.physics.add.sprite(120, 205, "knight");
    knight.body.useDamping = true;
    knight.body.drag.set(0.001, 0.1);
    knight.body.setMaxVelocityX(100);

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

    this.keys = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
    });
    this.knight = knight;
  }
  update(time, delta) {
    const { left, right, up, down } = this.keys;
    let nextAnim = this.knight.anims.currentAnim;
    let xacc = 0;
    if (left.isDown) {
      xacc -= 150;
    }
    if (right.isDown) {
      xacc += 150;
    }
    if (up.isDown) {
    }
    if (down.isDown) {
    }
    if (xacc !== 0) {
      if (xacc < 0) {
        this.knight.setFlipX(true);
      } else {
        this.knight.setFlipX(false);
      }
      nextAnim = "run";
    } else {
      this.knight.anims.stop();
      this.knight.setFrame("knight_00");
      nextAnim = null;
    }
    this.knight.setAccelerationX(xacc);

    this.knight.anims.timeScale =
      0.5 +
      Math.abs(this.knight.body.velocity.x) /
        (1.5 * this.knight.body.maxVelocity.x);

    nextAnim &&
      this.knight.play(
        {
          key: nextAnim,
          startFrame: 0,
        },
        true
      );
  }
}
