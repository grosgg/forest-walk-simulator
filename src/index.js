import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Grid from './Grid.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer( { canvas } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper(10);
scene.add( axesHelper );

const grid = new Grid;
scene.add( grid.mesh );

// camera.position.set(2, 1.8, 2);
controls.target = new THREE.Vector3(10, 0, 20);
controls.update();

const animate = function () {
  requestAnimationFrame( animate );

  renderer.render( scene, camera );
};

animate();
