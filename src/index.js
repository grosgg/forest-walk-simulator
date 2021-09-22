import * as THREE from 'three';

import Tree from './Tree.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer( { canvas } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const tree = new Tree
scene.add(tree)

camera.position.z = 5;

// Animate tree
const animate = function () {
  requestAnimationFrame( animate );

  // cube.rotation.x += 0.01;
  // trunk.rotation.y += 0.01;
  // cone.rotation.x += 0.01;
  // leaves.rotation.y += 0.01;

  renderer.render( scene, camera );
};

animate();
