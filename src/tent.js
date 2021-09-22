import * as THREE from "three";

import tentImage from "./images/tent_color.jpeg";

// tent class to instantiate single Tent
// x, y, z represents position of tent
export default class Tent {
  constructor(x, y, z) {
    // tent
    const tentGeometry = new THREE.ConeGeometry(1, 1, 4);
    const tentTexture = new THREE.TextureLoader().load(tentImage);
    const tentMaterial = new THREE.MeshBasicMaterial({
      map: tentTexture,
    });
    const tentMesh = new THREE.Mesh(tentGeometry, tentMaterial);

    // entrance
    const entranceGeometry = new THREE.PlaneGeometry(0.23, 0.2);
    const entranceMaterial = new THREE.MeshBasicMaterial({ color: 0x03083c });
    const entranceMesh = new THREE.Mesh(entranceGeometry, entranceMaterial);

    // set tent position
    tent.position.set(x, y, z);

    // set entrance position
    entrance.position.x = x - 0.4;
    entrance.position.y = y - 0.35;
    entrance.position.z = z + 1;
    entrance.rotateX(-0.5);
    entrance.rotateY(-0.3);
    entrance.rotateZ(-0.27);

    const group = new THREE.Group();
    group.add(tentMesh);
    group.add(entranceMesh);
    this.tentGroup = group;
  }
}
