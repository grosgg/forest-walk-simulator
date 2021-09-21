import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer( { canvas } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// Tree
// Tree Textures
const trunkTexture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1616108738832-504f7b6addf2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80');
const leavesTexture = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bc502803-57e4-4628-9e9c-e7b36d03edce/djtlyu-a1026af9-fb3c-4a9f-8fdd-11545158c0ba.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JjNTAyODAzLTU3ZTQtNDYyOC05ZTljLWU3YjM2ZDAzZWRjZVwvZGp0bHl1LWExMDI2YWY5LWZiM2MtNGE5Zi04ZmRkLTExNTQ1MTU4YzBiYS5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.FXYntG9XSqrfWr7C9MTHdJnmE9uQeY4JIG_TswUIWew');

// Trunk
const cylinderGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2, 30);
const cylinderMaterial = new THREE.MeshBasicMaterial( { map: trunkTexture } );
let trunk = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
scene.add( trunk );

// Conical leaves
const coneGeometry = new THREE.ConeGeometry( 1, 2, 20 );
const coneMaterial = new THREE.MeshBasicMaterial( { map: leavesTexture } );
let leaves = new THREE.Mesh( coneGeometry, coneMaterial );
leaves.position.y = trunk.position.y + 1.75
leaves.position.x = trunk.position.x
scene.add( leaves );

camera.position.z = 5;

// Animate tree
const animate = function () {
  requestAnimationFrame( animate );

  // cube.rotation.x += 0.01;
  trunk.rotation.y += 0.01;
  // cone.rotation.x += 0.01;
  leaves.rotation.y += 0.01;

  renderer.render( scene, camera );
};

animate();
