import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SimplexNoise from 'simplex-noise';

import {
  MAP_SIZE,
  TILE_SIZE,
  GRID_SIZE,
  AREA_SIZE,
  OBSTACLE_DENSITY,
  CAMERA_HEIGHT,
  SPEED
} from './Constants.js';

import Navigation from './Navigation.js';
import Ground from './Ground.js';

// import ForestTexturePX from './images/skybox/px.jpg';
// import ForestTexturePY from './images/skybox/py.jpg';
// import ForestTexturePZ from './images/skybox/pz.jpg';
// import ForestTextureNX from './images/skybox/nx.jpg';
// import ForestTextureNY from './images/skybox/ny.jpg';
// import ForestTextureNZ from './images/skybox/nz.jpg';

// Emile's WIP
// import Music from './audio/Shithesizer_numero_deux.mp3';
// Chill chiptune
import Music from './audio/chill.mp3';

import TreeTile from './Prefabs.js';
import { GridHelper } from 'three';

const PF = require('pathfinding');

// Scene + camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Canvas + rendering setup
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add axes helper
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Audio
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( Music, function( buffer ) {
  sound.setBuffer( buffer );
  sound.setLoop( true );
  sound.setVolume( 0.15 );
  // comment out to stop when devving
  // sound.play();
});

const simplex = new SimplexNoise();
let matrix = [];

// Figure layer of obstacles
for (let z = 0; z < GRID_SIZE; z++) {
  matrix[z] = new Array(GRID_SIZE);
  for (let x = 0; x < GRID_SIZE; x++) {
    matrix[z][x] = simplex.noise2D(x, z) < OBSTACLE_DENSITY ? 1 : 0;
  }
}

// Add skybox
// const skyboxTexture = new THREE.CubeTextureLoader().load([
//   ForestTexturePX,
//   ForestTextureNX,
//   ForestTexturePY,
//   ForestTextureNY,
//   ForestTexturePZ,
//   ForestTextureNZ,
// ]);
scene.background = new THREE.Color( 'skyblue' );

// Add ground
const ground = new Ground;
scene.add(ground.mesh);

// Pick random destinations for each area
const destinations = [];
for (let z = 0; z < GRID_SIZE; z += AREA_SIZE) {
  for (let x = 0; x < GRID_SIZE; x += AREA_SIZE) {
    // console.log([x, z]);
    const destination = [
      Math.floor(Math.random() * ((x + AREA_SIZE - 1) - x + 1) + x),
      Math.floor(Math.random() * ((z + AREA_SIZE - 1) - z + 1) + z),
    ];
    destinations.push(destination);
    // Make sure no obstacle spawns at destinations
    matrix[destination[1]][destination[0]] = 0;
  }
}
// console.log(destinations);

// Place obstacles
for (let z = 0; z < GRID_SIZE; z++) {
  for (let x = 0; x < GRID_SIZE; x++) {
    if (matrix[z][x] === 1) {
      scene.add(new TreeTile(x * TILE_SIZE, z * TILE_SIZE).group);
    }
  }
}

// Display temporary flags
destinations.forEach(destination => {
  const flag = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  // Placing the flag in the center
  flag.position.set(destination[0] * TILE_SIZE + TILE_SIZE / 2, 1, destination[1] * TILE_SIZE + TILE_SIZE / 2)
  scene.add(flag);
});

const grid = new PF.Grid(matrix);
const finder = new PF.AStarFinder();
const path = [];

for (let i = 0; i < destinations.length; i++) {
  const j = i === destinations.length - 1 ? 0 : i + 1;

  // Making sure destinations are walkable
  grid.setWalkableAt(destinations[i][0], destinations[i][1], true);
  grid.setWalkableAt(destinations[j][0], destinations[j][1], true);

  const pathGrid = grid.clone();
  // console.log(i);
  // console.log(`From ${destinations[i]} to ${destinations[j]}`);
  const nodes = finder.findPath(
    destinations[i][0],
    destinations[i][1],
    destinations[j][0],
    destinations[j][1],
    pathGrid
  );
  // console.log(nodes);
  if (nodes.length === 0) {
    console.log(`No path from ${destinations[i]} to ${destinations[j]}!`);
  }

  // Display temporary path
  nodes.forEach(node => {
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshBasicMaterial({ color: 0x00dddd })
    );
    // Placing the flag in the center
    flag.position.set(node[0] * TILE_SIZE + TILE_SIZE / 2, 0.1, node[1] * TILE_SIZE + TILE_SIZE / 2)
    scene.add(flag);
  });

  // Make one complete list of path nodes
  path.push(...nodes);
}

const gridHelper = new GridHelper(MAP_SIZE, GRID_SIZE, 0x4aed5f, 0xdb072a);
gridHelper.position.x = MAP_SIZE / 2;
gridHelper.position.z = MAP_SIZE / 2;
scene.add(gridHelper)

const nav = new Navigation(path, camera, renderer);
// console.log(nav);

const animate = () => {
  // setTimeout( () => {
    requestAnimationFrame( animate );
  // }, 1000 );

  nav.move();

  renderer.render(scene, nav.camera);
};

animate();
