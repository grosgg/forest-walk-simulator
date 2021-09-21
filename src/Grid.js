import * as THREE from 'three';

import GrassTexture from './images/grass.jpg';

const TILE_SIZE = 10;
const GRID_SIZE = 100;

export default class Grid {
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

    const texture = new THREE.TextureLoader().load(GrassTexture);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh( geometry, material );
  }
};
