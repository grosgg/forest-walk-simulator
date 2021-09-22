import * as THREE from "three";

import tentImage from "./images/tent_color.jpeg";

// tent class to instantiate single Tent
// x, y, z represents position of tent
export default class Tent {
  constructor(x, y, z) {
    // tent
    const tentGeometry = new THREE.ConeGeometry(2, 2, 4);
    const tentTexture = new THREE.TextureLoader().load(tentImage);
    const tentMaterial = new THREE.MeshBasicMaterial({
      map: tentTexture,
    });
    const tentMesh = new THREE.Mesh(tentGeometry, tentMaterial);
    // set tent position
    tentMesh.position.set(x, y, z);
    this.tentMesh = tentMesh;
  }
}
