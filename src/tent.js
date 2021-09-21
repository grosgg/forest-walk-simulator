import * as THREE from "three";

import tentImage from "./images/tent_color.jpeg";

// tent class to instantiate single Tent
// x, y, z represents position of tent
export default class Tent {
  constructor(x, y, z) {
    // tent
    const geometry = new THREE.ConeGeometry(1, 1, 4);
    const texture = new THREE.TextureLoader().load(tentImage);
    const tentMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });
    const tent = new THREE.Mesh(geometry, tentMaterial);

    console.log("tent", tent);

    // entrance
    const planeGeometry = new THREE.PlaneGeometry(0.23, 0.2);
    const entranceMaterial = new THREE.MeshBasicMaterial({ color: 0x03083c });
    const entrance = new THREE.Mesh(planeGeometry, entranceMaterial);

    console.log("entrance", entrance);

    // set tent position
    tent.position.x = x;
    tent.position.y = y;
    tent.position.z = z;

    // set entrance position
    entrance.position.x = x - 0.4;
    entrance.position.y = y - 0.35;
    entrance.position.z = z + 1;
    entrance.rotateX(-0.5);
    entrance.rotateY(-0.3);
    entrance.rotateZ(-0.27);

    this.mesh = tent;

    const group = new THREE.Group();
    group.add(tent);
    group.add(entrance);
    console.log("group", group);
    this.group = group;
  }
}
