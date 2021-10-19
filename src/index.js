import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SimplexNoise from 'simplex-noise';
import * as dat from 'dat.gui';

import parameters from './Constants.js';

import Navigation from './Navigation.js';
import Ground from './Ground.js';

// Emile's WIP
import Music from './audio/Shithesizer_numero_deux.mp3';
// Chill chiptune
// import Music from './audio/chill.mp3';

import TreeTile from './Prefabs.js';

const {
  MAP_SIZE,
  TILE_SIZE,
  GRID_SIZE,
  AREA_SIZE,
  OBSTACLE_DENSITY
} = parameters;

const PF = require('pathfinding');

// Scene + camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );

// Canvas + rendering setup
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

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
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xcc0000 })
  );
  // Placing the flag in the center
  flag.position.set(destination[0] * TILE_SIZE + TILE_SIZE / 2, 1, destination[1] * TILE_SIZE + TILE_SIZE / 2)
  scene.add(flag);
});

// Add way back to first destination
destinations.push(destinations[0]);

const grid = new PF.Grid(matrix);
const finder = new PF.AStarFinder();
const path = [];

for (let i = 0; i < destinations.length; i++) {
  const j = i === destinations.length - 1 ? 0 : i + 1;

  // Making sure destinations are walkable
  grid.setWalkableAt(destinations[i][0], destinations[i][1], true);
  grid.setWalkableAt(destinations[j][0], destinations[j][1], true);

  const pathGrid = grid.clone();

  let nodes = [];
  // while (nodes.length === 0) {
    nodes = finder.findPath(
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
  // }

  // Display temporary path
  nodes.forEach(node => {
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshBasicMaterial({ color: 0x00dddd })
    );
    // Placing the flag at tile center
    flag.position.set(node[0] * TILE_SIZE + TILE_SIZE / 2, 0.1, node[1] * TILE_SIZE + TILE_SIZE / 2)
    scene.add(flag);
  });

  // Make one complete list of path nodes
  path.push(...nodes);
}

// Filter out identical consecutive nodes
const uniquePath = path.filter((node, i) => i == 0 || node[0] != path[i-1][0] || node[1] != path[i-1][1]);

// Remove last node which is identical the the first one
uniquePath.splice(uniquePath.length-1, 1);

// Add axes helper
const axesHelper = new THREE.AxesHelper(10);
axesHelper.visible = parameters.DISPLAY_AXES;

scene.add(axesHelper);

// Add grid helper
const gridHelper = new THREE.GridHelper(MAP_SIZE, GRID_SIZE, 0x4aed5f, 0xdb072a);
gridHelper.position.x = MAP_SIZE / 2;
gridHelper.position.z = MAP_SIZE / 2;
gridHelper.visible = parameters.DISPLAY_GRID;
scene.add(gridHelper)

// Player
const character = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 1, 8),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
)
character.rotation.x = Math.PI / 2;
character.position.y = 2;
const player = new THREE.Group();
player.add(character);
scene.add(player);

const nav = new Navigation(uniquePath, player);
// console.log(nav);

// Debug UI
const gui = new dat.GUI();
gui.add(parameters, 'FPS');
const helpersFolder = gui.addFolder('Helpers');
helpersFolder.add(axesHelper, 'visible').name('Axes');
helpersFolder.add(gridHelper, 'visible').name('Grid');

const animate = () => {
  // setTimeout( () => {
    requestAnimationFrame( animate );
  // }, 100 );

  if (parameters.FPS) {
    const direction = new THREE.Vector3()
    camera.position.set(0, 0, 0);
    nav.player.getWorldDirection(direction)
    camera.lookAt(direction.add(nav.player.position));
    nav.player.add(camera);
  } else {
    nav.player.remove(camera);
    camera.position.set(nav.player.position.x, 40, nav.player.position.z);
    camera.lookAt(nav.player.position);
  }
  
  nav.move();

  renderer.render(scene, camera);
};

animate();
