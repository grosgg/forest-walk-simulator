import * as THREE from 'three';

import { MAP_SIZE, TILE_SIZE } from './Constants.js';
import { MathUtils } from 'three';

import ConicalTree from './ConicalTree.js';

export default class TreeTile {
  // @param x - world space position x
  // @param z - world space position z
  constructor(x, z) {
    // center of tile
    const centerX = Math.floor(TILE_SIZE / 2);
    const centerZ = Math.floor(TILE_SIZE / 2);
    // tile group
    const group = new THREE.Object3D();

    // try to place at least 2 trees, maximum 5
    const randNum = MathUtils.randInt(2, 5);

    // setup array to keep track of local trees
    let groupedTrees = []
    for(let i = 0; i < TILE_SIZE; i++) {
      groupedTrees[i] = new Array(TILE_SIZE)
    }

    // make randNum trees
    for(let i = 0; i < randNum; i++) {
      // random distance from center
      const randX = MathUtils.randInt(-2, 2);
      const randZ = MathUtils.randInt(-2, 2);
      let localX = centerX + randX;
      let localZ = centerZ + randZ;

      // tree already exists at location, skip
      if(groupedTrees[localX][localZ]) {
        continue;
      }

      if((localX + x > MAP_SIZE || localZ + z > MAP_SIZE) || (localX + x < 0 || localZ + z < 0)) {
        // tree ended up out of grounds, skip it
        continue
      } else {
        // add tree to tile group
        group.add(new ConicalTree(localX + x, localZ + z).group);
        // set tree exists "here"
        groupedTrees[localX][localZ] = true
      }
    }

    this.group = group
  }
}
