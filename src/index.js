import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Grid from './Grid.js';

import ForestTexturePX from './images/skybox/px.jpg';
import ForestTexturePY from './images/skybox/py.jpg';
import ForestTexturePZ from './images/skybox/pz.jpg';
import ForestTextureNX from './images/skybox/nx.jpg';
import ForestTextureNY from './images/skybox/ny.jpg';
import ForestTextureNZ from './images/skybox/nz.jpg';
// Emile's WIP
// import Music from './audio/Shithesizer_numero_deux.mp3';
// Chill chiptune
import Music from './audio/chill.mp3';

import ConicalTree from './ConicalTree.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer( { canvas } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper(10);
scene.add( axesHelper );

// Audio
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( Music, function( buffer ) {
  sound.setBuffer( buffer );
  sound.setLoop( true );
  sound.setVolume( 0.15 );
  // comment out to stop when devving
  sound.play();
});

const skyboxTexture = new THREE.CubeTextureLoader().load([
  ForestTexturePX,
  ForestTextureNX,
  ForestTexturePY,
  ForestTextureNY,
  ForestTexturePZ,
  ForestTextureNZ,
]);
scene.background = skyboxTexture;

const grid = new Grid;
scene.add( grid.mesh );

const tree = new ConicalTree
scene.add(tree.group)

// camera.position.set(2, 1.8, 2);
controls.target = new THREE.Vector3(10, 0, 20);
controls.update();

// Animate tree
const animate = function () {
  requestAnimationFrame( animate );

  renderer.render( scene, camera );
};

animate();
