import * as THREE from 'three';
import CONSTANTS from './Constants';

 const { CAMERA_HEIGHT, SPEED, TILE_CENTER_OFFSET, TILE_SIZE } = CONSTANTS;
export default class Navigation {
  constructor(path, player) {
    console.log('Path', path);

    this.player = player;
    this.path = path;
    this.nodeIndex = 0;
    this.aimedDirection = this.nextNode(1).sub(this.nextNode(0)).normalize();
    this.nextDirection = this.nextNode(2).sub(this.nextNode(1)).normalize();
    this.currentDirection = new THREE.Vector3;
    this.currentQuaternion = new THREE.Quaternion;
    this.nextQuaternion = new THREE.Quaternion;

    // Initial setup
    this.setPositionToNode(this.player.position, 0);
    this.player.lookAt(this.nextNode());

    this.player.getWorldDirection(this.currentDirection);
    this.roundVectorDecimals(this.currentDirection);
    // console.log('currentDirection', this.currentDirection);
  }

  move() {
    // console.log('player', this.player.position);
    // console.log('nextNode', this.nextNode());

    this.player.getWorldDirection(this.currentDirection);
    this.roundVectorDecimals(this.currentDirection);
    // console.log('currentDirection', this.currentDirection);

    if (this.isNodeReached()) {
      this.turn();
    } else {
      this.walk();
    }
  }

  turn() {
    this.setPositionToNode(this.player.position, this.nodeIndex+1);

    const roundedDirection = new THREE.Vector3().copy(this.currentDirection);
    this.roundVectorDecimals(roundedDirection, 1);
    // console.log('roundedDirection', roundedDirection);
    // console.log('nextDirection', this.nextDirection);

    if (this.nextDirection.equals(roundedDirection)) {
      console.log('Going straight');
      this.setNextNode();
      this.walk();
      return;
    }

    if (this.aimedDirection.equals(this.currentDirection)) {
      console.log('Prepare quaternions');

      this.currentQuaternion = new THREE.Quaternion().copy(this.player.quaternion);

      const nextCamera = this.player.clone();
      nextCamera.lookAt(this.nextNode(2));
      this.nextQuaternion = new THREE.Quaternion().copy(nextCamera.quaternion);
      // console.log('current quaternion', this.currentQuaternion);
      // console.log('next quaternion', this.nextQuaternion);
    }

    // console.log('Turning');

    /*
      ~~ ANGLE NOTES ~~
      x: 1  -> -π/2 or 3π/2
      z: 1  -> π
      x: -1 -> π / 2
      z: -1 -> 0
    */

    this.player.quaternion.rotateTowards(this.nextQuaternion, SPEED);
  }

  walk() {
    // console.log('Walking');
    // console.log('walk current direction', this.currentDirection);
    // console.log('walk aimed direction', this.aimedDirection);
    if (!this.aimedDirection.equals(this.currentDirection)) { return }

    const moveDirection = new THREE.Vector3().copy(this.aimedDirection);
    this.player.position.add(moveDirection.multiplyScalar(SPEED));
  }

  nextNode(ahead = 1) {
    const i = this.nodeIndex + ahead >= this.path.length ?
      this.nodeIndex + ahead - this.path.length
      : this.nodeIndex + ahead;
    return new THREE.Vector3(
      this.path[i][0] * TILE_SIZE + TILE_CENTER_OFFSET,
      CAMERA_HEIGHT,
      this.path[i][1] * TILE_SIZE + TILE_CENTER_OFFSET
    );
  }

  setNextNode() {
    this.nodeIndex++;
    if (this.nodeIndex == this.path.length) { this.nodeIndex = 0 }

    this.player.lookAt(this.nextNode(1));
    this.aimedDirection = this.nextNode(1).sub(this.nextNode(0)).normalize();
    this.nextDirection = this.nextNode(2).sub(this.nextNode(1)).normalize();
  }

  setPositionToNode(vector, i) {
    const j = i == this.path.length ? 0 : i;

    vector.set(
      this.path[j][0] * TILE_SIZE + TILE_CENTER_OFFSET,
      CAMERA_HEIGHT,
      this.path[j][1] * TILE_SIZE + TILE_CENTER_OFFSET
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
    // console.log('distance to node', this.player.position.distanceTo(this.nextNode()));
    return this.player.position.distanceTo(this.nextNode()) < SPEED
  }
}
