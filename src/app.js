import * as THREE from "three";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import spark from "./img/spark.png";
import bird from "./img/bird.png";
import logo from "./img/logo.png";
import gsap from "gsap";

import Stats from "stats-js";

export default class Sketch {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    this.camera.position.z = 600;

    this.scene = new THREE.Scene();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.point = new THREE.Vector2();

    this.textures = [
      new THREE.TextureLoader().load(bird),
      new THREE.TextureLoader().load(logo),
    ];
    this.spark = new THREE.TextureLoader().load(spark);

    this.time = 0;
    this.move = 0;

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    this.addMesh();

    this.mouseEffects();
    this.render();
  }

  mouseEffects() {
    this.test = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshBasicMaterial()
    );

    window.addEventListener("mousedown", (e) => {
      gsap.to(this.material.uniforms.mousePressed, {
        duration: 0.3,
        value: 1,
        ease: "ease.out(1, 0.3)",
      });
    });

    window.addEventListener("mouseup", (e) => {
      gsap.to(this.material.uniforms.mousePressed, {
        duration: 0.3,
        value: 0,
        ease: "ease.out(1, 0.3)",
      });
    });

    window.addEventListener("mousewheel", (e) => {
      this.move += e.wheelDeltaY / 4000;
    });

    window.addEventListener(
      "mousemove",
      (event) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersects = this.raycaster.intersectObjects([this.test]);

        this.point.x = intersects[0].point.x;
        this.point.y = intersects[0].point.y;
      },
      false
    );
  }

  addMesh() {
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      uniforms: {
        progress: { type: "f", value: 0 },
        bird: { type: "t", value: this.textures[0] },
        logo: { type: "t", value: this.textures[1] },
        spark: { type: "t", value: this.spark },
        // transition: {type: "f", value: null},
        mouse: { type: "v2", value: null },
        mousePressed: { type: "f", value: 0 },
        move: { type: "f", value: 0 },
        time: { type: "f", value: 0 },
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    let number = 512 * 512;
    this.geometry = new THREE.BufferGeometry();
    this.positions = new THREE.BufferAttribute(new Float32Array(number * 3), 3);
    this.coordinates = new THREE.BufferAttribute(
      new Float32Array(number * 3),
      3
    );
    this.speeds = new THREE.BufferAttribute(new Float32Array(number), 1);
    this.offset = new THREE.BufferAttribute(new Float32Array(number), 1);
    this.direction = new THREE.BufferAttribute(new Float32Array(number), 1);
    this.press = new THREE.BufferAttribute(new Float32Array(number), 1);
    function rand(a, b) {
      return a + (b - a) * Math.random();
    }

    let index = 0;
    for (let i = 0; i < 512; i++) {
      let posX = i - 256;
      for (let j = 0; j < 512; j++) {
        this.positions.setXYZ(index, posX * 2, (j - 256) * 2, 0);
        this.coordinates.setXYZ(index, i, j, 0);
        this.speeds.setX(index, rand(-1000, 1000));
        this.offset.setX(index, rand(0.4, 1));
        this.direction.setX(index, Math.random() > 0.5 ? 1 : -1);
        this.press.setX(index, rand(0.4, 1));
        index++;
      }
    }

    this.geometry.setAttribute("position", this.positions);
    this.geometry.setAttribute("aCoordinates", this.coordinates);
    this.geometry.setAttribute("aSpeed", this.speeds);
    this.geometry.setAttribute("aOffset", this.offset);
    this.geometry.setAttribute("aDirection", this.direction);
    this.geometry.setAttribute("aPress", this.press);

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  render() {
    this.stats.begin();

    this.time++;

    // let next = Math.floor(this.move + 40)%2;
    // let prev = (Math.floor(this.move + 40) + 1)%2;

    // this.material.uniforms.logo.value = this.textures[prev];
    // this.material.uniforms.bird.value = this.textures[next];
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.move.value = this.move;
    this.material.uniforms.mouse.value = this.point;

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));

    this.stats.end();
  }
}

new Sketch();
