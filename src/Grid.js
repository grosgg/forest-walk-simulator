import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

import GrassTexture from './images/grass.jpg';
import { TILE_SIZE, GRID_SIZE } from './Constants.js';
export default class Grid {
  constructor() {
    const simplex = new SimplexNoise();
    let layout = [];

    for (let z = 0; z < GRID_SIZE; z++) {
      layout[z] = new Array(GRID_SIZE);
      for (let x = 0; x < GRID_SIZE; x++) {
        layout[z][x] = simplex.noise2D(x, z);
      }
    }
    console.log(layout);

    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array( [
      0, 0, 0,
      TILE_SIZE * GRID_SIZE, 0, 0,
      0, 0, TILE_SIZE * GRID_SIZE,
    
      0, 0, TILE_SIZE * GRID_SIZE,
      TILE_SIZE * GRID_SIZE, 0, 0,
      TILE_SIZE * GRID_SIZE, 0, TILE_SIZE * GRID_SIZE
    ] );

    const uvs = new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
  
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0
    ]);
    
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const texture = new THREE.TextureLoader().load(GrassTexture);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh( geometry, material );
  }
};
