import * as THREE from 'three';
import gsap from 'gsap';

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
      this.turn();
    } else {
      this.walk();
    }
  }

  turn() {
    const nextDirection = this.nextNode(2).sub(this.nextNode(1)).normalize();

    if (nextDirection.equals(this.direction.normalize())) {
      console.log('Going straight');
      this.nodeIndex++;
      return;
    }
    console.log('Turning');

    /*
      ~~ ANGLE NOTES ~~
      x: 1  -> -π/2 or 3π/2
      z: 1  -> π
      x: -1 -> π / 2
      z: -1 -> 0
    */

    console.log('turn current direction', this.direction);
    console.log('turn next direction', nextDirection);
    console.log('turn current angle', this.camera.rotation.y);

    switch (nextDirection.x) {
      case 1: this.rotateCamera(3 * Math.PI / 2); break;
      case -1: this.rotateCamera(Math.PI / 2); break;
      default: break;
    }

    switch (nextDirection.z) {
      case 1: this.rotateCamera(Math.PI); break;
      case -1: this.rotateCamera(0); break;
      default: break;
    }

    this.nodeIndex++;
  }

  walk() {
    console.log('Walking');
    const aimedDirection = this.nextNode().sub(this.nextNode(0)).normalize();
    // console.log('walk current direction', this.direction);
    // console.log('walk aimed direction', aimedDirection);
    if (!aimedDirection.equals(this.direction)) { return }

    this.direction.round();
    this.direction.multiplyScalar(SPEED);

    this.camera.position.add(this.direction);
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
    // console.log(this.camera.position.distanceTo(this.nextNode()));
    return this.camera.position.distanceTo(this.nextNode()) < SPEED
  }

  rotateCamera(angle) {
    console.log('rotate to', angle);
    gsap.to(this.camera.rotation, { duration: 1, y: angle});
  }
}
