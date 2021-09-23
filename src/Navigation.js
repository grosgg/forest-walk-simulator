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

  setDestination() {
    if (this.camera.position.distanceTo(this.nextNode()) < SPEED) {
      this.nodeIndex++;
      this.camera.lookAt(this.nextNode());
    }
  }

  move() {
    // console.log('camera', this.camera.position);
    // console.log('nextNode', this.nextNode());

    this.camera.getWorldDirection(this.direction);
    this.direction.round().multiplyScalar(SPEED);
    // console.log('direction', this.direction);

    this.camera.position.add(this.direction);
    this.roundCameraPosition(this.camera);
  }

  nextNode(ahead = 1) {
    return new THREE.Vector3(
      this.path[this.nodeIndex + ahead][0] * TILE_SIZE + TILE_CENTER_OFFSET,
      CAMERA_HEIGHT,
      this.path[this.nodeIndex + ahead][1] * TILE_SIZE + TILE_CENTER_OFFSET
    );
  }

  roundCameraPosition(camera) {
    camera.position.set(
      Math.round(camera.position.x * 100) / 100,
      CAMERA_HEIGHT,
      Math.round(camera.position.z * 100) / 100
    );
  }
}
