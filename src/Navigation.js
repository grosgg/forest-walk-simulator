import * as THREE from 'three';
import gsap from 'gsap';

import { CAMERA_HEIGHT, SPEED, TILE_CENTER_OFFSET, TILE_SIZE } from './Constants';

export default class Navigation {
  constructor(path, camera) {
    console.log(path);
    // this.clock = new THREE.Clock();
    this.moving = true;
    this.camera = camera;
    this.path = path;
    this.nodeIndex = 0;
    this.aimedDirection = this.nextNode(1).sub(this.nextNode(0)).normalize();
    this.nextDirection = this.nextNode(2).sub(this.nextNode(1)).normalize();
    this.currentDirection = new THREE.Vector3;
    // this.currentQuaternion = new THREE.Quaternion;
    // this.nextQuaternion = new THREE.Quaternion;

    // Initial setup
    this.setPositionToNode(this.camera.position, 0);
    // console.log('initial camera rotation y (raw)', this.camera.rotation.y);
    // console.log('initial current direction', this.aimedDirection);

    // const currentDirection2D = new THREE.Vector2(this.aimedDirection.x, this.aimedDirection.z)
    // console.log('currentDirection2D', currentDirection2D);

    // const currentAngle = new THREE.Vector2(this.aimedDirection.x, this.aimedDirection.z).angle();
    // console.log('initial angle', currentAngle);

    // this.camera.rotation.y = currentAngle// + Math.PI / 2;
    this.camera.lookAt(this.nextNode());
    // console.log('initial camera rotation y (adjusted)', this.camera.rotation.y);

    this.camera.getWorldDirection(this.currentDirection);
    this.roundVectorDecimals(this.currentDirection);
    // console.log('currentDirection', this.currentDirection);
  }

  move() {
    // console.log('camera', this.camera.position);
    // console.log('nextNode', this.nextNode());

    this.camera.getWorldDirection(this.currentDirection);
    this.roundVectorDecimals(this.currentDirection);
    console.log('currentDirection', this.currentDirection);

    if (this.isNodeReached()) {
      this.turn();
    } else {
      this.walk();
    }
  }

  turn() {
    // console.log('clock running', this.clock.running);
    // const currentDirection = this.nextNode(1).sub(this.nextNode(0)).normalize();
    // const nextDirection = this.nextNode(2).sub(this.nextNode(1)).normalize();
    // const currentAngle = new THREE.Vector2(currentDirection.x, currentDirection.z).angle();
    this.setPositionToNode(this.camera.position, this.nodeIndex+1);

    const roundedDirection = new THREE.Vector3().copy(this.currentDirection);
    this.roundVectorDecimals(roundedDirection, 1);
    console.log('roundedDirection', roundedDirection);
    console.log('nextDirection', this.nextDirection);

    if (this.nextDirection.equals(roundedDirection)) {
      console.log('Going straight');
      this.setNextNode();

      // this.clock.stop();
      this.moving = true;
      return;
    } else {
      this.moving = false;
    }

    if (this.aimedDirection.equals(this.currentDirection) && !this.moving) {
      console.log('Prepare quaternions');

      this.currentQuaternion = new THREE.Quaternion().copy(this.camera.quaternion);

      const nextCamera = this.camera.clone();
      nextCamera.lookAt(this.nextNode(2));
      this.nextQuaternion = new THREE.Quaternion().copy(nextCamera.quaternion);

      // Set camera back to original quaternion
      // this.camera.quaternion.set(this.currentQuaternion);
  
      console.log('current quaternion', this.currentQuaternion);
      console.log('next quaternion', this.nextQuaternion);

      // this.clock.start();
    }

    console.log('Turning');

    /*
      ~~ ANGLE NOTES ~~
      x: 1  -> -π/2 or 3π/2
      z: 1  -> π
      x: -1 -> π / 2
      z: -1 -> 0
    */

    // console.log('turn current direction', currentDirection);
    // console.log('turn next direction', nextDirection);
    // console.log('turn current angle', currentAngle);
    // console.log('turn camera rotation y', this.camera.rotation.y);

    // this.camera.rotation.y = currentAngle;

    // switch (nextDirection.x) {
    //   case 1: this.rotateCamera(3 * Math.PI / 2); break;
    //   case -1: this.rotateCamera(Math.PI / 2); break;
    //   default: break;
    // }

    // switch (nextDirection.z) {
    //   case 1: this.rotateCamera(Math.PI); break;
    //   case -1: this.rotateCamera(0); break;
    //   default: break;
    // }


    // console.log('elapsed time', this.clock.getElapsedTime());

    // this.camera.lookAt(this.nextNode(2));
    // this.camera.quaternion.slerp(this.nextQuaternion, Math.min(this.clock.getElapsedTime(), 1));
    this.camera.quaternion.rotateTowards(this.nextQuaternion, SPEED);
    // this.camera.rotation.y += SPEED;
    // this.roundVectorDecimals(this.camera.rotation);

    // gsap.to(this.camera.quaternion, { quaternion: this.nextQuaternion })
  }

  walk() {
    console.log('Walking');
    // this.camera.getWorldDirection(this.currentDirection);
    // this.roundVectorDecimals(this.currentDirection);

    // console.log('walk current direction', this.currentDirection);
    // console.log('walk aimed direction', this.aimedDirection);
    if (!this.aimedDirection.equals(this.currentDirection)) { return }

    // this.direction.round();
    // this.direction.multiplyScalar(SPEED);

    const moveDirection = new THREE.Vector3().copy(this.aimedDirection);
    this.camera.position.add(moveDirection.multiplyScalar(SPEED));
  }

  nextNode(ahead = 1) {
    return new THREE.Vector3(
      this.path[this.nodeIndex + ahead][0] * TILE_SIZE + TILE_CENTER_OFFSET,
      CAMERA_HEIGHT,
      this.path[this.nodeIndex + ahead][1] * TILE_SIZE + TILE_CENTER_OFFSET
    );
  }

  setNextNode() {
    this.nodeIndex++;
    this.aimedDirection = this.nextNode(1).sub(this.nextNode(0)).normalize();
    this.nextDirection = this.nextNode(2).sub(this.nextNode(1)).normalize();
  }

  setPositionToNode(vector, i) {
    vector.set(
      this.path[i][0] * TILE_SIZE + TILE_CENTER_OFFSET,
      CAMERA_HEIGHT,
      this.path[i][1] * TILE_SIZE + TILE_CENTER_OFFSET
    )
  }

  roundVectorDecimals(vector, decimals = 2) {
    vector.set(
      Math.round(vector.x * 10**decimals) / 10**decimals,
      Math.round(vector.y * 10**decimals) / 10**decimals,
      Math.round(vector.z * 10**decimals) / 10**decimals
    )
  }

  isNodeReached() {
    // console.log('distance to node', this.camera.position.distanceTo(this.nextNode()));
    return this.camera.position.distanceTo(this.nextNode()) < SPEED
  }

  // rotateCamera(nextAngle) {
  //   console.log('rotate from (raw)', this.camera.rotation.y);
  //   if (this.camera.rotation.y >= 2 * Math.PI) { this.camera.rotation.y -= 2 * Math.PI }
  //   if (this.camera.rotation.y < 0) { this.camera.rotation.y += 2 * Math.PI }
  //   console.log('rotate from (computed)', this.camera.rotation.y);

  //   console.log('rotate to (raw)', nextAngle);
  //   if (Math.abs(nextAngle - this.camera.rotation.y) > Math.PI) {
  //     if (nextAngle > 0) {
  //       nextAngle -= 2 * Math.PI
  //     } else {
  //       nextAngle += 2 * Math.PI
  //     }
  //   }
  //   console.log('rotate to (computed)', nextAngle);

  //   gsap.to(this.camera.rotation, { duration: 1, y: nextAngle});
  // }
}
