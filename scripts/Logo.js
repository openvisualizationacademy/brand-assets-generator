import * as THREE from "three";
import * as d3 from "d3";

export default class Logo {
  constructor(world) {
    this.world = world;

    // Define how many lines will be drawn (including first, excluding last);
    this.steps = 64 - 1;

    // Will store references to drawn lines
    this.list = [];

    this.setup();
  }

  blend(steps, extremes) {

    // Will be populated with blended (interpolated) lines
    const lines = [];

    // Store starting and ending points for both lines
    const first = extremes.at(0);
    const last = extremes.at(-1);

    // Add first line to list
    lines.push(first)

    // For each step after first
    for (let step = 1; step <= steps; step++) {

      // Will be filled during following for loops
      const blended = {}

      for (let point of ["a", "b"]) {

        // Empty array will be filled below with x, y, z coords
        blended[point] = [];

        // Calculate “in-between” value for x, y, z coordinates
        for (let i = 0; i < 3; i++) { 
          
          const from = first[point][i];
          const to = last[point][i];
          const diff = to - from;
          const increment = diff / steps;

          blended[point][i] = from + increment * step;
        }
      }

      // Add in-between line to array
      lines.push(blended);
    }

    return lines;
  }
  palette(t) {

    if (!this.colorScale) {
      // Make colors avoid extremes (either too light or too dark)
      this.colorScale = d3.scaleLinear().domain([0, 1]).range([0.2, 0.8]);
    }

    return d3.interpolateYlOrRd(this.colorScale(t));
  }

  setup() {
    const lines = this.blend(this.steps, this.world.app.data.lines);;

    console.log(lines);

    lines.forEach((line, index) => {

      // Get value between 0-1
      const t = index / (lines.length - 1);

      const material = new THREE.LineBasicMaterial( { color: this.palette(t) } );
      const points = [];
      points.push( new THREE.Vector3( ...line.a ) );
      points.push( new THREE.Vector3( ...line.b) );
      const geometry = new THREE.BufferGeometry().setFromPoints( points );
      const mesh = new THREE.Line( geometry, material );

      this.world.scene.instance.add( mesh );

    });
    
    // photos.forEach((photo) => {
    //   const w = photo.w * 0.001;
    //   const h = photo.h * 0.001;
    //   const x = photo.x * 0.75;
    //   const y = photo.y * 0.75;
    //   const z = photo.z * 0.75;

    //   const path = `./media/${photo.filename}`;
    //   const texture = this.world.textureLoader.load(path);

    //   const geometry = new THREE.PlaneGeometry(w, h);
    //   const material = new THREE.MeshBasicMaterial({
    //     map: texture,
    //     side: THREE.FrontSide,
    //   });

    //   const plane = new THREE.Mesh(geometry, material);
    //   plane.position.set(x, y, z);
    //   plane.userData.type = "cat";
    //   plane.userData.title = photo.title;

    //   this.list.push(plane);
    //   this.world.scene.instance.add(plane);
    // });
  }

  update() {
    // this.list.forEach((plane) => {
    //   plane.lookAt(this.world.camera.instance.position);

    //   if (plane.userData.hover) {
    //     plane.material.color.set(0xffff00);
    //   } else {
    //     plane.material.color.set(0xffffff);
    //   }
    // });
  }
}
