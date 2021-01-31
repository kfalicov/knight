export class Chain extends Phaser.GameObjects.Sprite {
  verts = [];
  constraints = [];
  render = [];
  rest = 30;
  acc = {};
  drag = 0;
  terminal = 100;
  constructor(
    scene,
    length,
    { gravity = 0.01, wind = 0, drag = 0, terminal = 100 },
    constraints
  ) {
    super(scene, 120, 120, "plume");
    //define the points
    for (let i = 0; i < length; i++) {
      this.render.push(scene.add.image(0, 0, "plume", 3));
      this.verts.push({
        x: 120 + i * 5,
        y: 120 + i * 5,
        last: { x: 120 + i * 5, y: 120 + i * 5 },
      });
    }
    this.constraints = constraints;
    this.acc.y = gravity;
    this.acc.x = wind;
    this.drag = drag;
    this.terminal = terminal;
  }
  move(x, y) {
    this.verts[0] = { last: { x, y }, x, y };
  }
  setMass(i, m) {
    this.verts[i].m = m;
  }
  preUpdate(time, delta) {
    // console.log("chain updated");
    // console.log(delta);
    const { x: ox, y: oy } = this.verts[0];
    for (let i = 0; i < this.verts.length; i++) {
      const { x, y, m, last } = this.verts[i];
      const { x: xAcc, y: yAcc } = this.acc;
      const xVel = (x - last.x) * (1 - this.drag) + xAcc * delta;
      const yVel = (y - last.y) * (1 - this.drag) + yAcc * delta;

      const length = Math.sqrt(xVel * xVel + yVel * yVel);
      const mod = length > this.terminal ? this.terminal / length : 1;
      mod !== 1 && console.log("velocity exceeded", length);

      const next = { x: x + xVel * mod, y: y + yVel * mod };
      this.verts[i] = { last: { x, y }, m, ...next };
      // console.log(this.verts[i]);
      this.render[i].setPosition(next.x, next.y);
    }
    //fix the start point
    this.verts[0] = { ...this.verts[0], x: ox, y: oy };
    //fix the endpoint
    // this.verts[this.verts.length-1] = {...this.verts[this.verts.length-1], x:120,y:120};
    let step = 3;
    for (let i = 0; i < step; i++) {
      for (let solve of this.constraints) {
        solve.bind(this)(step);
      }
      //fix the start point
      this.verts[0] = { ...this.verts[0], x: ox, y: oy };
      //fix the endpoint
      // this.verts[this.verts.length-1] = {...this.verts[this.verts.length-1], x:120,y:120};
    }
  }
}

const rotateBy = (vec1, origin, rotation) => {
  const { x: px, y: py } = vec1;
  const { x: ox, y: oy } = origin;
  var radians = (Math.PI / 180) * rotation,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    x = cos * (px - ox) + sin * (py - oy) + ox,
    y = cos * (py - oy) - sin * (px - ox) + oy;
  return { x, y };
};

/**tries to maintain the desired angle from the last vert's angle, with the given stiffness. rotates around a. */
export function angle(a, targetrad, stiffness = 1) {
  function solve(step) {
    //the last vert's angle. uses world angle if the last vert is undefined.
    const { theta: prevTheta = 1.57 } = this.verts[a - 1] ?? {};
    //the origin point
    const { x: ox, y: oy, m: m1 = 1 } = this.verts[a];

    //if there is no next vert, this angle can be set immediately
    if (!this.verts[a + 1]) {
      this.verts[a].theta = targetrad;
      console.log("no next vert");
      return;
    }

    //the satellite point
    const { x: px, y: py, m: m2 = 1 } = this.verts[a + 1];

    let vector = { x: px - ox, y: py - oy };

    //the current (screen coords) angle to the next point (a->b) in radians.
    //atan2 returns values from -3.14 to 3.14.
    const currentTheta = Math.atan2(vector.x, vector.y);

    //the difference in angle from the previous point, in radians.
    const angleFromLast = currentTheta - prevTheta;

    /**
     * 1.57 = pi/2
     * 3.14 = pi
     * 6.28 = 2*pi
     */
    let shortestdiff = ((targetrad - angleFromLast + 3.14) % 6.28) - 3.14;
    shortestdiff = shortestdiff < -3.14 ? shortestdiff + 6.28 : shortestdiff;

    var radians = (shortestdiff * stiffness) / step,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = cos * (px - ox) + sin * (py - oy) + ox,
      ny = cos * (py - oy) - sin * (px - ox) + oy;

    this.verts[a].theta = radians + currentTheta;

    this.verts[a + 1] = {
      ...this.verts[a + 1],
      x: nx,
      y: ny,
    };
  }
  return solve;
}

/**tries to maintain an equilibrium at the rest distance. */
export function spring(a, b, rest, stiffness = 1) {
  function solve(step) {
    const { x: x1, y: y1, m: m1 = 1 } = this.verts[a];
    const { x: x2, y: y2, m: m2 = 1 } = this.verts[b];
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    //the distance between points
    const dist = Math.sqrt(diffX * diffX + diffY * diffY);
    //the amount of movement that has to happen during this solve
    const difference = ((rest - dist) / dist) * stiffness;
    //the mass factor and how much it affects movement
    const f1 = m1 / (m1 + m2);
    const f2 = m2 / (m1 + m2);
    this.verts[a] = {
      ...this.verts[a],
      x: x1 - diffX * difference * f1,
      y: y1 - diffY * difference * f1,
    };
    this.verts[b] = {
      ...this.verts[b],
      x: x2 + diffX * difference * f2,
      y: y2 + diffY * difference * f2,
    };
  }
  return solve;
}

/**no minimum distance, and can't ever stretch past the resting distance. */
export function rope(a, b, rest) {
  function solve(step) {
    const { x: x1, y: y1, m: m1 = 1 } = this.verts[a];
    const { x: x2, y: y2, m: m2 = 1 } = this.verts[b];
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    //the distance between points
    const dist = Math.sqrt(diffX * diffX + diffY * diffY);
    //ignores if it's closer
    if (dist - rest <= 0) return;
    const delta = (rest - dist) / dist / 2;
    this.verts[a] = {
      ...this.verts[a],
      x: x1 - diffX * delta,
      y: y1 - diffY * delta,
    };
    this.verts[b] = {
      ...this.verts[b],
      x: x2 + diffX * delta,
      y: y2 + diffY * delta,
    };
  }
  return solve;
}

/**a force field only in effect when the item is within the resting distance. */
export function forcefield(a, b, rest, force = 1) {
  function solve(step) {
    const { x: x1, y: y1, m: m1 = 1 } = this.verts[a];
    const { x: x2, y: y2, m: m2 = 1 } = this.verts[b];
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    //the distance between points
    const dist = Math.sqrt(diffX * diffX + diffY * diffY);
    //ignores if it's further than the resting distance
    if (dist > rest) return;
    const delta = ((rest - dist) / dist / 2) * force;
    this.verts[a] = {
      ...this.verts[a],
      x: x1 - diffX * delta,
      y: y1 - diffY * delta,
    };
    this.verts[b] = {
      ...this.verts[b],
      x: x2 + diffX * delta,
      y: y2 + diffY * delta,
    };
  }
  return solve;
}
