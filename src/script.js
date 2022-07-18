import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';


/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const gridHelper = new THREE.GridHelper(8, 4);
scene.add(gridHelper);




const raycaster = new THREE.Raycaster();
//lights

const mainLight = new THREE.DirectionalLight(0xffffff, 3);
scene.add(mainLight);
///////// Plane
const plane1 = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: '#ff00ff' })
);
plane1.rotation.x = -Math.PI * 0.5;
plane1.position.y = -1;
scene.add(plane1);

//// Cubz
const allCells = new THREE.Group();
scene.add(allCells);

const cubeGeo = new THREE.BoxBufferGeometry(1.8, 4, 1.8);
const cubeMat = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.5,
});

let cellsToTest = []
////////////////////1ST ROW
const cube1 = new THREE.Mesh(cubeGeo, cubeMat);
cube1.position.set(-3, 1, 3);
allCells.add(cube1);
cellsToTest.push(cube1)


const cube2 = new THREE.Mesh(cubeGeo, cubeMat);
cube2.position.set(-1, 1, 3);
allCells.add(cube2);
cellsToTest.push(cube2)

const cube3 = new THREE.Mesh(cubeGeo, cubeMat);
cube3.position.set(1, 1, 3);
allCells.add(cube3);
cellsToTest.push(cube3)



const cube4 = new THREE.Mesh(cubeGeo, cubeMat);
cube4.position.set(3, 1, 3);
allCells.add(cube4);
cellsToTest.push(cube4)

/////////////// 2ND ROW
const cube5 = new THREE.Mesh(cubeGeo, cubeMat);
cube5.position.set(-3, 1, 1);
allCells.add(cube5);
cellsToTest.push(cube5)

const cube6 = new THREE.Mesh(cubeGeo, cubeMat);
cube6.position.set(-1, 1, 1);
allCells.add(cube6);
cellsToTest.push(cube6)

const cube7 = new THREE.Mesh(cubeGeo, cubeMat);
cube7.position.set(1, 1, 1);
allCells.add(cube7);
cellsToTest.push(cube7)

const cube8 = new THREE.Mesh(cubeGeo, cubeMat);
cube8.position.set(3, 1, 1);
allCells.add(cube8);
cellsToTest.push(cube8)
///////////////////////////3RD ROW

const cube9 = new THREE.Mesh(cubeGeo, cubeMat);
cube9.position.set(-3, 1, -1);
allCells.add(cube9);
cellsToTest.push(cube9)

const cube10 = new THREE.Mesh(cubeGeo, cubeMat);
cube10.position.set(-1, 1, -1);
allCells.add(cube10);
cellsToTest.push(cube10)

const cube11 = new THREE.Mesh(cubeGeo, cubeMat);
cube11.position.set(1, 1, -1);
allCells.add(cube11);
cellsToTest.push(cube11)

const cube12 = new THREE.Mesh(cubeGeo, cubeMat);
cube12.position.set(3, 1, -1);
allCells.add(cube12);
cellsToTest.push(cube12)


//////////////////////4TH ROW

const cube13 = new THREE.Mesh(cubeGeo, cubeMat);
cube13.position.set(-3, 1, -3);
allCells.add(cube13);
cellsToTest.push(cube13)

const cube14 = new THREE.Mesh(cubeGeo, cubeMat);
cube14.position.set(-1, 1, -3);
allCells.add(cube14);
cellsToTest.push(cube14)

const cube15 = new THREE.Mesh(cubeGeo, cubeMat);
cube15.position.set(1, 1, -3);
allCells.add(cube15);
cellsToTest.push(cube15)

const cube16 = new THREE.Mesh(cubeGeo, cubeMat);
cube16.position.set(3, 1, -3);
allCells.add(cube16);
cellsToTest.push(cube16)

console.log(cellsToTest)
/**
 * Objects
 */
// const object1 = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 16),
//   new THREE.MeshBasicMaterial({ color: '#ff0000' })
// );
// object1.position.x = -2;

// const object2 = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 16),
//   new THREE.MeshBasicMaterial({ color: '#ff0000' })
// );

// const object3 = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 16),
//   new THREE.MeshBasicMaterial({ color: '#ff0000' })
// );
// object3.position.x = 2;

// const object4 = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 16),
//   new THREE.MeshBasicMaterial({ color: '#ff0000' })
// );
// object4.position.x = 4;

// scene.add(object1, object2, object3, object4);
const world = new CANNON.World()
world.gravity.set(0,-9.82,0)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial)

const floorBody = new CANNON.Body()
floorBody.material = defaultContactMaterial
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
floorBody.position.y = -1
floorBody.mass = 0
world.addBody(floorBody)

const radius = 0.8

const createSphere = (radius, position) =>
{
    // Three.js mesh
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 20),
        new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4
            // envMap: environmentMapTexture,
            // envMapIntensity: 0.5
        })
    )
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)


    // Cannon.js body
    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)
}

//  createSphere(0.8, { x: 0, y: 3, z: 0 })
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

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
camera.position.z = 3;
camera.position.y = 7;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown)
document.addEventListener('mouseup', onMouseUp)

let clicked = false
function onMouseDown(event){
    console.log("mousedown")
    event.preventDefault()
        clicked = true 
        setTimeout(()=> {clicked = false}, '1000')
    }
    function onMouseUp(event){
        console.log("mouseup")
            clicked = false 
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
 let oldElapsedTime = 0

 const tick = () =>
 {
     const elapsedTime = clock.getElapsedTime()
     const deltaTime = elapsedTime - oldElapsedTime
     oldElapsedTime = elapsedTime
    
    controls.update();
  raycaster.setFromCamera(mouse, camera);
  const intersection = raycaster.intersectObjects(
cellsToTest
  );
  for (const object of cellsToTest) {
      
      object.material = cubeMat;
  }
  if ( intersection.length > 0 ) {
      
      
      intersection[0].object.material = (new THREE.MeshBasicMaterial({color :'#ff0000'}));
      // console.log(intersection)
    }

    if(intersection[0] !== undefined && clicked === true){
        let pos = new THREE.Vector3(intersection[0].object.position.x,intersection[0].object.position.y + 3,intersection[0].object.position.z )
        createSphere( radius,
            pos)

            setTimeout(()=>{},'5000')
            // console.log(createSphere(),)
            
        } else null

        world.step(1 / 60, deltaTime, 3)

  // Update controls

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
