import * as THREE from "three";

export default class Box {
  constructor(world) {
    this.world = world;
    this.setup();
  }

  setup() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    this.instance = new THREE.Mesh(geometry, material);

    this.world.scene.instance.add(this.instance);
  }

  update() {
    const currentX = this.instance.rotation.x;
    const targetX = this.world.pointer.coords.x * Math.PI * 0.5;

    const currentY = this.instance.rotation.y;
    const targetY = this.world.pointer.coords.y * Math.PI * 0.5;

    const x = this.world.animation.expDecay(currentX, targetX);
    const y = this.world.animation.expDecay(currentY, targetY);

    this.instance.rotation.x = x;
    this.instance.rotation.y = y;
  }
}
