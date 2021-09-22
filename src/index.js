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

import ConicalTree from './ConicalTree.js';

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
    if (layout[z][x] > 0) {
      scene.add(new ConicalTree(x * TILE_SIZE, z * TILE_SIZE).group);
    }
  }
}

camera.position.set(0, 10, 0);
controls.target = new THREE.Vector3(MAP_SIZE / 2, 0, MAP_SIZE / 2);

controls.update();

console.log(scene);

const animate = function () {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
};

animate();
