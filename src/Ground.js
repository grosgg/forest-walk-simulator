import * as THREE from 'three';

import GrassTexture from './images/grass.jpg';
import { TILE_SIZE, GRID_SIZE } from './Constants.js';
export default class Ground {
  constructor() {
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

    // const texture = new THREE.TextureLoader().load(GrassTexture);
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);
    const material = new THREE.MeshBasicMaterial({ color: 0x00aa00, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh( geometry, material );
  }
};
