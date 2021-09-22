import * as THREE from 'three';

import TrunkTexture from './images/trees/trunk-1.jpeg';
import LeafTexture from './images/trees/leaves-1.jpeg';

export default class Tree {
  constructor(x, z) {
    // Tree Textures
    const trunkTexture = new THREE.TextureLoader().load(TrunkTexture);
    const leavesTexture = new THREE.TextureLoader().load(LeafTexture);

    // Trunk
    const cylinderGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2, 30);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ map: trunkTexture });
    const trunk = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
    trunk.position.set(x, 1, z);

    // Conical leaves
    const coneGeometry = new THREE.ConeGeometry( 1, 2, 20 );
    const coneMaterial = new THREE.MeshBasicMaterial({ map: leavesTexture });
    const leaves = new THREE.Mesh( coneGeometry, coneMaterial );
    leaves.position.set(x, trunk.position.y + 1.75, z);

    const group = new THREE.Object3D();
    group.add(trunk);
    group.add(leaves);

    this.group = group
  }
}
