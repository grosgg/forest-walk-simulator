import * as THREE from 'three';

import { CAMERA_HEIGHT, SPEED, TILE_CENTER_OFFSET, TILE_SIZE } from './Constants';

export default class Navigation {
  constructor(path, camera, renderer) {
    this.camera = camera;
    this.path = path;
    this.nodeIndex = 0;
    this.x = path[0][0]; this.z = path[0][1];
    this.direction = new THREE.Vector3;

    // Initial setup
    this.camera.position.set(
      this.x * TILE_SIZE + TILE_CENTER_OFFSET,
      CAMERA_HEIGHT,
      this.z * TILE_SIZE + TILE_CENTER_OFFSET
    );
    this.camera.lookAt(this.nextNode());
  }

  move() {
    // console.log('camera', this.camera.position);
    // console.log('nextNode', this.nextNode());

    this.camera.getWorldDirection(this.direction);
    this.roundVectorDecimals(this.direction);
    // console.log('direction', this.direction);

    if (this.isNodeReached()) {
      // console.log('sub', this.nextNode(2).sub(this.nextNode(1)).normalize());
      if (this.nextNode(2).sub(this.nextNode(1)).normalize().equals(this.direction)) {
        this.nodeIndex++;
      } else {
        this.camera.rotation.y += 1 * Math.PI / 180;
      }
    } else {
      this.direction.round();
      this.direction.multiplyScalar(SPEED);

      this.camera.position.add(this.direction);
      this.roundVectorDecimals(this.camera.position);
    }
  }

  nextNode(ahead = 1) {
    return new THREE.Vector3(
      this.path[this.nodeIndex + ahead][0] * TILE_SIZE + TILE_CENTER_OFFSET,
      CAMERA_HEIGHT,
      this.path[this.nodeIndex + ahead][1] * TILE_SIZE + TILE_CENTER_OFFSET
    );
  }

  roundVectorDecimals(vector) {
    vector.set(
      Math.round(vector.x * 100) / 100,
      Math.round(vector.y * 100) / 100,
      Math.round(vector.z * 100) / 100
    )
  }

  isNodeReached() {
    return this.camera.position.distanceTo(this.nextNode()) < SPEED
  }
}
