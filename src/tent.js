import * as THREE from "three";

// cone(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
const geometry = new THREE.ConeGeometry(2.8, 3, 4);
const planeGeometry = new THREE.PlaneGeometry(0.7, 1);
const entranceMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const colorTexture = new THREE.TextureLoader().load(
  "https://upload.wikimedia.org/wikipedia/commons/2/29/MARPAT_woodland_pattern.jpg"
);
const tentMaterial = new THREE.MeshBasicMaterial({
  map: colorTexture,
});
const tent = new THREE.Mesh(geometry, tentMaterial);
const entrance = new THREE.Mesh(planeGeometry, entranceMaterial);
entrance.position.x = -0.8;
entrance.position.y = -0.88;
entrance.position.z = 2;
entrance.rotateX(-0.3);
entrance.rotateY(-0.4);
entrance.rotateZ(-0.4);

export { tent, entrance };
