import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Grid from './Grid.js';

import ForestTexturePX from './images/skybox/px.jpg';
import ForestTexturePY from './images/skybox/py.jpg';
import ForestTexturePZ from './images/skybox/pz.jpg';
import ForestTextureNX from './images/skybox/nx.jpg';
import ForestTextureNY from './images/skybox/ny.jpg';
import ForestTextureNZ from './images/skybox/nz.jpg';

import ConicalTree from './ConicalTree.js';

const constants = require('./constants')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer( { canvas } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper(10);
scene.add( axesHelper );


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

const gridHelper = new THREE.GridHelper(10, 10, 0x4aed5f, 0xdb072a);
gridHelper.position.x = constants.GRID_SIZE / 2;
gridHelper.position.z = constants.GRID_SIZE / 2;
scene.add(gridHelper)

const tree = new ConicalTree
scene.add(tree.group)
tree.group.position.set(constants.TILE_SIZE / 2, 1, constants.TILE_SIZE / 2);

camera.position.set(-3, 5, -3);
controls.target = new THREE.Vector3(0, 2, 0);
controls.update();

// Animate tree
const animate = function () {
  requestAnimationFrame( animate );

  renderer.render( scene, camera );
};

animate();
