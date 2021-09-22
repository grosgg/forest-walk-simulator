import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SimplexNoise from 'simplex-noise';

import { MAP_SIZE, TILE_SIZE, GRID_SIZE } from './Constants.js';
import Ground from './Ground.js';

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
import { GridHelper, MathUtils } from 'three';

// Scene + camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Canvas + rendering setup
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add controls
const controls = new OrbitControls( camera, renderer.domElement );

// Add axes helper
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

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

const simplex = new SimplexNoise();
let layout = [];

for (let z = 0; z < GRID_SIZE; z++) {
  layout[z] = new Array(GRID_SIZE);
  for (let x = 0; x < GRID_SIZE; x++) {
    layout[z][x] = simplex.noise2D(x, z);
  }
}

// Add skybox
const skyboxTexture = new THREE.CubeTextureLoader().load([
  ForestTexturePX,
  ForestTextureNX,
  ForestTexturePY,
  ForestTextureNY,
  ForestTexturePZ,
  ForestTextureNZ,
]);
scene.background = skyboxTexture;

// Add ground
const ground = new Ground;
scene.add(ground.mesh);

for (let z = 0; z < GRID_SIZE; z++) {
  for (let x = 0; x < GRID_SIZE; x++) {
    if (layout[z][x] > 0.4) {
      let randPos = MathUtils.randInt(1, 3) + 0.5;
      scene.add(new ConicalTree(x * TILE_SIZE + randPos, z * TILE_SIZE + randPos).group);
    }
  }
}

const gridHelper = new GridHelper(MAP_SIZE, GRID_SIZE, 0x4aed5f, 0xdb072a);
gridHelper.position.x = MAP_SIZE / 2;
gridHelper.position.z = MAP_SIZE / 2;
scene.add(gridHelper)

camera.position.set(MAP_SIZE / 2, 50, MAP_SIZE / 2);
controls.target = new THREE.Vector3(MAP_SIZE / 2, 0, MAP_SIZE / 2);

controls.update();

console.log(scene);

const animate = function () {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
};

animate();
