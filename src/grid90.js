import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

const Grid90 = (world, position) => {
    
  let arr = []
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.0,
      }
      );
      world.addContactMaterial(defaultContactMaterial);

      
      const createBorder = (position, quaternion) => {
   
    
      
        // Cannon.js body
        const sizeX = 4
        const sizeY = 3
        const sizeZ = 0.2
        const halfExtents = new CANNON.Vec3(sizeX, sizeY, sizeZ)
        const planeShape = new CANNON.Box(halfExtents);
        
        const planeBody = new CANNON.Body({
          mass: 0,
          position: position,
          shape: planeShape,
          material: defaultMaterial,
          type: 2,
        });
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI*0.5)
        planeBody.addShape(planeShape);
        // body.position.copy(mesh.position)
        // console.log('bodyyyy', body.position)
        world.addBody(planeBody);
        arr.push(planeBody)
      };
      
    
  createBorder(new CANNON.Vec3(...position));
  console.log(arr)
};


export default Grid90;
