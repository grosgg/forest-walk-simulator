import * as THREE from "three";

import Tent from "./Tent.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// adding tent with entrance
const { group } = new Tent(0, 0, 0);
scene.add(group);

// test for showing random tents
for (let i = 0; i < 10; i++) {
  const randomPos = Math.random() < 0.5 ? -1 : 1;
  const randomX = Math.floor(Math.random() * randomPos * 10) * i;
  const randomZ = Math.floor(Math.random() * randomPos * 5) * i;
  const { group } = new Tent(randomX, 0, randomZ);
  scene.add(group);
}

camera.position.z = 5;
const animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

// scene.add(tent.group);
animate();
