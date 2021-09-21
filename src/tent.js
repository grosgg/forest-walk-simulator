import * as THREE from "three";

import tentImage from "./images/tent_color.jpeg";

// tent class to instantiate single Tent
// x, y, z represents position of tent
export default class Tent {
  constructor(x, y, z) {
    console.log("tentimage", tentImage);
    // cone(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
    const geometry = new THREE.ConeGeometry(5, 5, 4);
    const planeGeometry = new THREE.PlaneGeometry(1, 1.4);
    const entranceMaterial = new THREE.MeshBasicMaterial({ color: 0x03083c });
    const tentMaterial = new THREE.MeshBasicMaterial({
      map: tentImage,
    });
    const tent = new THREE.Mesh(geometry, tentMaterial);
    const entrance = new THREE.Mesh(planeGeometry, entranceMaterial);
    tent.position.x = x;
    tent.position.y = y;
    tent.position.z = z;
    entrance.position.x = x - 1.8;
    entrance.position.y = y - 1.7;
    entrance.position.z = z + 3;
    entrance.rotateX(-0.5);
    entrance.rotateY(-0.4);
    entrance.rotateZ(-0.4);

    const group = new THREE.Group();
    group.add(tent);
    group.add(entrance);
    console.log("group", group);
    this.tentGroup = group;
  }
}
