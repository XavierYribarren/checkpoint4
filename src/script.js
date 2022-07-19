import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import Grid from './grid.js';
import Grid90 from './grid90';
import { BackSide, DoubleSide } from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const raycaster = new THREE.Raycaster();
//lights

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.y = 10;
mainLight.castShadow = true;
// const helper = new THREE.DirectionalLightHelper(mainLight, 5)
scene.add(mainLight);

const pointLight = new THREE.PointLight(0xf000f0, 1)
pointLight.position.y = 6
pointLight.position.x = 5
scene.add(pointLight)

scene.fog = new THREE.Fog( 0xffffff, 5, 50)

const caseBox = new THREE.Mesh(
    new THREE.BoxBufferGeometry(50,50,50),
    new THREE.MeshStandardMaterial({color : '#ffff00', side: BackSide})
)

scene.add(caseBox)

///////// Plane
const planeMat = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity : 0
});
const plane1 = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(40, 40),
  new THREE.MeshStandardMaterial({ color: 'pink' })
);
plane1.rotation.x = -Math.PI * 0.5;
plane1.position.y = -1.0001;
scene.add(plane1);
const plane2 = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(8, 8),
  new THREE.MeshStandardMaterial({ color: 'grey',
metalness : 0.7,
roughness : 0 })
);
plane2.rotation.x = -Math.PI * 0.5;
plane2.position.y = -1;
plane2.receiveShadow = true;
scene.add(plane2);

//// Cubz
const allCells = new THREE.Group();
scene.add(allCells);

const cubeGeo = new THREE.BoxBufferGeometry(1.8, 3, 1.8);
const cubeMat = new THREE.MeshBasicMaterial({
  color: '#ffffff',
  transparent: true,
  side: DoubleSide,
  opacity: 0,
});

let cellsToTest = [];
////////////////////1ST ROW
const cube1 = new THREE.Mesh(cubeGeo, cubeMat);
cube1.position.set(-3, 0.5, 3);
allCells.add(cube1);
cellsToTest.push(cube1);

const cube2 = new THREE.Mesh(cubeGeo, cubeMat);
cube2.position.set(-1, 0.5, 3);
allCells.add(cube2);
cellsToTest.push(cube2);

const cube3 = new THREE.Mesh(cubeGeo, cubeMat);
cube3.position.set(1, 0.5, 3);
allCells.add(cube3);
cellsToTest.push(cube3);

const cube4 = new THREE.Mesh(cubeGeo, cubeMat);
cube4.position.set(3, 0.5, 3);
allCells.add(cube4);
cellsToTest.push(cube4);

/////////////// 2ND ROW
const cube5 = new THREE.Mesh(cubeGeo, cubeMat);
cube5.position.set(-3, 0.5, 1);
allCells.add(cube5);
cellsToTest.push(cube5);

const cube6 = new THREE.Mesh(cubeGeo, cubeMat);
cube6.position.set(-1, 0.5, 1);
allCells.add(cube6);
cellsToTest.push(cube6);

const cube7 = new THREE.Mesh(cubeGeo, cubeMat);
cube7.position.set(1, 0.5, 1);
allCells.add(cube7);
cellsToTest.push(cube7);

const cube8 = new THREE.Mesh(cubeGeo, cubeMat);
cube8.position.set(3, 0.5, 1);
allCells.add(cube8);
cellsToTest.push(cube8);
///////////////////////////3RD ROW

const cube9 = new THREE.Mesh(cubeGeo, cubeMat);
cube9.position.set(-3, 0.5, -1);
allCells.add(cube9);
cellsToTest.push(cube9);

const cube10 = new THREE.Mesh(cubeGeo, cubeMat);
cube10.position.set(-1, 0.5, -1);
allCells.add(cube10);
cellsToTest.push(cube10);

const cube11 = new THREE.Mesh(cubeGeo, cubeMat);
cube11.position.set(1, 0.5, -1);
allCells.add(cube11);
cellsToTest.push(cube11);

const cube12 = new THREE.Mesh(cubeGeo, cubeMat);
cube12.position.set(3, 0.5, -1);
allCells.add(cube12);
cellsToTest.push(cube12);

//////////////////////4TH ROW

const cube13 = new THREE.Mesh(cubeGeo, cubeMat);
cube13.position.set(-3, 0.5, -3);
allCells.add(cube13);
cellsToTest.push(cube13);

const cube14 = new THREE.Mesh(cubeGeo, cubeMat);
cube14.position.set(-1, 0.5, -3);
allCells.add(cube14);
cellsToTest.push(cube14);

const cube15 = new THREE.Mesh(cubeGeo, cubeMat);
cube15.position.set(1, 0.5, -3);
allCells.add(cube15);
cellsToTest.push(cube15);

const cube16 = new THREE.Mesh(cubeGeo, cubeMat);
cube16.position.set(3, 0.5, -3);
allCells.add(cube16);
cellsToTest.push(cube16);

console.log(cellsToTest);

const lightTile = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2),
  new THREE.MeshStandardMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0,
  })
);
lightTile.rotation.x = -Math.PI * 0.5;

scene.add(lightTile);
/**
 *
 *
 *
 *
 * Objects
 */
let played = 0;

const objectsToUpdate = [];

const world = new CANNON.World();
world.gravity.set(0, -14.82, 0);

gui.add(world.gravity)
const cannonDebugger = new CannonDebugger(scene, world, {
  // options...
  color: 0x00ff00,
  scale: 1,
});

const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.3,
  }
);
world.addContactMaterial(defaultContactMaterial);

const floorBody = new CANNON.Body();
const floorShape = new CANNON.Plane(new CANNON.Vec3(10, 10));
floorBody.material = defaultContactMaterial;
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
floorBody.position.y = -1;
floorBody.mass = 0;
floorBody.addShape(floorShape);
world.addBody(floorBody);

const radius = 0.7;


const createSphere = (radius, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 30, 30),
    new THREE.MeshStandardMaterial({
      color: played % 2 != 0 ? '#ff0000' : '#00ff00',
      metalness: 0.3,
      roughness: 0.4,
    //   wireframe: true,
      // envMap: environmentMapTexture,
      // envMapIntensity: 0.5
    })
  );
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Sphere(radius);

  const body = new CANNON.Body({
    mass: 3,
    // position: new CANNON.Vec3(0, 3, 0),
    position: position,
    shape: shape,
    material: defaultMaterial,
  });
  body.addShape(shape);
  // body.position.copy(mesh.position)
  console.log('meshhhh', mesh.position);
  console.log('bodyyyy', body.position);
  mesh.position.copy(body.position);
  world.addBody(body);
  objectsToUpdate.push({ mesh, body });
};



const debugObject = {};

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const mouse = new THREE.Vector2(1, 1);
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
camera.position.y = 3;
camera.lookAt(0, 0, 0);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 20;
controls.minDistance = 7;
controls.maxPolarAngle = Math.PI/2;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias : true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.addEventListener('mousemove', onMouseMove);
// document.addEventListener('mousedown', onMouseDown)
// document.addEventListener('mouseup', onMouseUp)

Grid(world, [0, 2, 0]);
Grid(world, [0, 2, 2]);
Grid(world, [0, 2, -2]);
Grid(world, [0, 2, -4]);
Grid(world, [0, 2, 4]);
Grid90(world, [-4, 2, 0]);
Grid90(world, [-2, 2, 0]);
Grid90(world, [0, 2, 0]);
Grid90(world, [2, 2, 0]);
Grid90(world, [4, 2, 0]);

let clicked = 0;
function onMouseDown(event) {
  console.log('mousedown');
  event.preventDefault();
  clicked += 1;
  setTimeout(() => {
    clicked = 0;
  }, '7');
}
function onMouseUp(event) {
  console.log('mouseup');
  clicked = 0;
}
function onMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

/**
 * Animate
 console.log(gridHelper);
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  controls.update();
  raycaster.setFromCamera(mouse, camera);
  const intersection = raycaster.intersectObjects(cellsToTest);
  for (const object of cellsToTest) {
    object.material = cubeMat;
    lightTile.material = planeMat;
  }
  if (intersection.length > 0) {
    lightTile.position.set(
      intersection[0].object.position.x,
      -0.9999,
      intersection[0].object.position.z
    );
    lightTile.material = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 2,
    });
    intersection[0].object.material = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.3,
    });
  }
  // console.log(intersection)

  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  if (intersection[0] !== undefined && clicked === 1) {
    removeEventListener('mousedown', onMouseDown);
    let pos = new THREE.Vector3(
      intersection[0].object.position.x,
      intersection[0].object.position.y + 5,
      intersection[0].object.position.z
    );
    createSphere(radius, pos);

    played += 1;

    if (clicked > 1 && clicked !== 0) {
      clicked = 0;
      setTimeout(() => {}, '50');
    }
  } else null;

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }
  world.step(1 / 60, deltaTime, 3);
  // scene.updateMatrixWorld()
  // Update controls
    // cannonDebugger.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
