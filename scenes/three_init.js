this.cameras.main.setBackgroundColor("#bb0000");

const { width, height } = this.sys.canvas;
let depth = 1725 * (height / 240);

/**the three js camera */
const camera = new THREE.PerspectiveCamera(50, width / height, 1, depth + 1000);
camera.z = -1000;

/**
 * setup threejs for the tower
 */
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

/**construct the tower */
let radius = 10;
let n = 32;
let angle = Math.PI / n;
let segmentLength = 2 * radius * Math.sin(angle);
let perimeter = (segmentLength + 0.4) * n; //TODO figure out a better way to seamlessly wrap the texture. This assumes the cylinder is like a polygon

let gmap = textureLoader.load(gradientMap);
gmap.minFilter = gmap.magFilter = THREE.NearestFilter;

const geometry = new THREE.CylinderGeometry(radius, radius, height, n);
const material = new THREE.MeshToonMaterial({
  map: textureLoader.load(brick, function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(perimeter / 64, height / 64);
  }),
  normalMap: textureLoader.load(brick_normal, function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(perimeter / 64, height / 64);
  }),
  aoMap: textureLoader.load(brick_ao, function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(perimeter / 64, height / 64);
  }),
  gradientMap: gmap,
  dithering: true,
  color: 0xdddddd,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.y = 3.14;
mesh.scale.set(0.5);
scene.add(mesh);

/**the lighting */
var sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(0, 1000, 500);
scene.add(sun);

// the webgl renderer that three uses
let renderer = new THREE.WebGL1Renderer({
  canvas: this.sys.canvas,
  context: this.sys.canvas.getContext("webgl"),
  antialias: false,
  autoClear: false,
  alpha: true,
});

this.add.image(160, 120, "fish");
/**adds the three js scene to the phaser scene */
let extern = this.add.extern();
extern.render = function (prenderer, pcamera, pcalcMatrix) {
  renderer.state.reset();

  renderer.render(scene, camera);
};
/**
 * end threejs
 */
this.input.keyboard.on("keydown", () => {
  //   console.log("hello");
  mesh.rotation.y += 0.1;
});
