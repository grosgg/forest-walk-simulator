import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SimplexNoise from 'simplex-noise';

import { MAP_SIZE, TILE_SIZE, GRID_SIZE, AREA_SIZE } from './Constants.js';
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
  // sound.play();
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

// Add first layer of obstacles
for (let z = 0; z < GRID_SIZE; z++) {
  for (let x = 0; x < GRID_SIZE; x++) {
    if (layout[z][x] > 0.4) {
      let randPos = MathUtils.randInt(1, 3) + 0.5;
      scene.add(new ConicalTree(x * TILE_SIZE + randPos, z * TILE_SIZE + randPos).group);
    }
  }
}

// Pick random destinations
const destinations = [];
for (let z = 0; z < GRID_SIZE; z += AREA_SIZE) {
  for (let x = 0; x < GRID_SIZE; x += AREA_SIZE) {
    console.log([x, z]);
    destinations.push([
      Math.floor(Math.random() * ((x + AREA_SIZE - 1) - x + 1) + x),
      Math.floor(Math.random() * ((z + AREA_SIZE - 1) - z + 1) + z),
    ]);
  }
}
console.log(destinations);

destinations.forEach(destination => {
  const flag = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  flag.position.set(destination[0] * TILE_SIZE + TILE_SIZE / 2, 0, destination[1] * TILE_SIZE + TILE_SIZE / 2)
  scene.add(flag);
});

const gridHelper = new GridHelper(MAP_SIZE, GRID_SIZE, 0x4aed5f, 0xdb072a);
gridHelper.position.x = MAP_SIZE / 2;
gridHelper.position.z = MAP_SIZE / 2;
scene.add(gridHelper)

camera.position.set(MAP_SIZE / 2, 80, MAP_SIZE / 2);
controls.target = new THREE.Vector3(MAP_SIZE / 2, 0, MAP_SIZE / 2);

controls.update();
console.log(scene);

const animate = function () {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
};

animate();
