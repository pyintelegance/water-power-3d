import * as THREE from "three";
import { STATION_DEFS, getCityEraIndex, getTotals } from "./economy.js";

const CAMERA_PRESETS = [
  { name: "Обзор", pos: new THREE.Vector3(18.5, 17.5, 22.0), target: new THREE.Vector3(2.8, 0.8, 0.8) },
  { name: "Станции", pos: new THREE.Vector3(8.5, 8.2, 11.5), target: new THREE.Vector3(-1.2, 1.0, 2.2) },
  { name: "Плотина", pos: new THREE.Vector3(10.5, 9.5, 7.5), target: new THREE.Vector3(-1.2, 1.6, -4.5) },
  { name: "Город", pos: new THREE.Vector3(21.5, 13.0, 14.0), target: new THREE.Vector3(8.5, 1.8, -0.5) }
];

function flatMat(color, roughness = 0.78, metalness = 0.05, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    flatShading: true,
    ...extra
  });
}

function addBox(parent, w, h, d, x, y, z, mat, castShadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addCyl(parent, rt, rb, h, seg, x, y, z, mat, castShadow = true) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export class WaterPowerWorld {
  constructor(canvas, onTapWorld) {
    this.canvas = canvas;
    this.onTapWorld = onTapWorld;
    this.clock = new THREE.Clock();
    this.presetIndex = 0;

    // Camera preset smooth state (no touch-drag movement)
    this.cameraPos = CAMERA_PRESETS[0].pos.clone();
    this.targetOffset = CAMERA_PRESETS[0].target.clone();
    this.desiredCameraPos = CAMERA_PRESETS[0].pos.clone();
    this.desiredTarget = CAMERA_PRESETS[0].target.clone();

    this.stationNodes = {};
    this.eraGroups = [];
    this.eraScales = [1, 0.001, 0.001, 0.001, 0.001];
    this.activeEra = 0;

    this.energyPulses = [];
    this.pulsePaths = [];
    this.splashPool = [];
    this.trees = [];

    this.initRenderer();
    this.initScene();
    this.buildTerrainAndRiver();
    this.buildStations();
    this.buildPowerLines();
    this.buildCityEras();
    this.buildSplashParticles();
    this.bindInput();
    this.resize();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#73c2fb");
    this.scene.fog = new THREE.Fog("#8dd1fc", 28, 72);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.5, 140);

    const hemi = new THREE.HemisphereLight("#d8f3ff", "#264653", 0.95);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight("#fff6df", 1.85);
    sun.position.set(16, 26, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 65;
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.bias = -0.0006;
    this.scene.add(sun);

    const rim = new THREE.DirectionalLight("#38bdf8", 0.45);
    rim.position.set(-14, 10, -12);
    this.scene.add(rim);
  }

  buildTerrainAndRiver() {
    const grassMat = flatMat("#45a85f", 0.88);
    const darkGrassMat = flatMat("#2f855a", 0.9);
    const rockMat = flatMat("#64748b", 0.92);
    const cliffMat = flatMat("#475569", 0.92);
    const sandMat = flatMat("#d6b98c", 0.95);

    // Base valley slab
    addBox(this.scene, 44, 3, 40, 2, -1.7, 0, flatMat("#1e293b", 0.95), false);

    // Right green plateau (City side)
    addBox(this.scene, 18, 1.2, 32, 9.5, -0.2, 0, grassMat, true);
    // Left hilly canyon bank
    addBox(this.scene, 14, 1.8, 32, -10.5, 0.1, 0, darkGrassMat, true);
    addBox(this.scene, 11, 3.6, 16, -11.5, 1.4, -7, rockMat, true);

    // Upper Reservoir Plateau (North / -Z)
    addBox(this.scene, 34, 4.4, 12, 0, 1.6, -15, cliffMat, true);
    addBox(this.scene, 12, 0.4, 12, 9.5, 3.85, -15, darkGrassMat, true);
    addBox(this.scene, 12, 0.4, 12, -10.5, 3.85, -15, rockMat, true);

    // Riverbed sand banks
    addBox(this.scene, 6.2, 0.35, 25, -1.2, -0.35, 3, sandMat, false);

    // Upper river water
    this.waterMat = new THREE.MeshStandardMaterial({
      color: "#0ea5e9",
      roughness: 0.18,
      metalness: 0.15,
      flatShading: true,
      transparent: true,
      opacity: 0.92
    });

    const upperWater = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 11, 8, 10), this.waterMat);
    upperWater.rotation.x = -Math.PI / 2;
    upperWater.position.set(-1.2, 3.82, -14.5);
    upperWater.receiveShadow = true;
    this.scene.add(upperWater);

    // Waterfall cascade
    const fallGeo = new THREE.PlaneGeometry(4.8, 4.2, 8, 12);
    this.waterfallMesh = new THREE.Mesh(fallGeo, this.waterMat);
    this.waterfallMesh.position.set(-1.2, 1.85, -9.05);
    this.waterfallMesh.rotation.x = -0.12;
    this.scene.add(this.waterfallMesh);

    // Lower animated river mesh
    const riverGeo = new THREE.PlaneGeometry(5.4, 25, 10, 32);
    riverGeo.rotateX(-Math.PI / 2);
    this.riverBaseY = riverGeo.attributes.position.array.slice();
    this.riverMesh = new THREE.Mesh(riverGeo, this.waterMat);
    this.riverMesh.position.set(-1.2, 0.05, 3.5);
    this.riverMesh.receiveShadow = true;
    this.scene.add(this.riverMesh);

    // Animated foam streaks
    const foamMat = new THREE.MeshBasicMaterial({ color: "#e0f2fe", transparent: true, opacity: 0.72 });
    this.foamStrips = [];
    for (let i = 0; i < 16; i += 1) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 1.4), foamMat);
      strip.position.set(-2.9 + (i % 5) * 0.85, 0.12, -8 + (i * 1.55) % 22);
      this.scene.add(strip);
      this.foamStrips.push(strip);
    }

    // Low-poly pine trees & rocks for life
    const trunkMat = flatMat("#78350f");
    const leafMat = flatMat("#15803d");
    const treeCoords = [
      [-6.5, 1.0, 9], [-8.2, 1.0, 4], [-7.0, 1.0, -2], [-9.2, 3.2, -8],
      [-5.5, 3.9, -13], [14.5, 0.4, 10], [15.8, 0.4, 2], [14.2, 0.4, -7]
    ];
    for (const [tx, ty, tz] of treeCoords) {
      const tree = new THREE.Group();
      tree.position.set(tx, ty, tz);
      addCyl(tree, 0.15, 0.22, 0.9, 6, 0, 0.45, 0, trunkMat);
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.5, 6), leafMat);
      c1.position.y = 1.45;
      c1.castShadow = true;
      tree.add(c1);
      const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.2, 6), leafMat);
      c2.position.y = 2.25;
      c2.castShadow = true;
      tree.add(c2);
      this.scene.add(tree);
      this.trees.push(tree);
    }

    // Decorative rocks along river edge
    const rockCoords = [
      [1.7, 0.3, 8.5], [1.9, 0.25, 2.2], [1.8, 0.35, -5.5],
      [-4.2, 0.3, 6.2], [-4.1, 0.35, -1.8], [-4.3, 0.4, -8.2]
    ];
    for (const [rx, ry, rz] of rockCoords) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), rockMat);
      rock.position.set(rx, ry, rz);
      rock.scale.set(1.2, 0.75, 1.0);
      rock.rotation.y = rx * 1.3;
      rock.castShadow = true;
      this.scene.add(rock);
    }
  }

  createWheelMesh(blades, radius, width, rimColor, bladeColor) {
    const wheel = new THREE.Group();
    const rimMat = flatMat(rimColor, 0.5, 0.35);
    const bladeMat = flatMat(bladeColor, 0.65, 0.15);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.09, 6, 16), rimMat);
    ring1.rotation.y = Math.PI / 2;
    ring1.position.x = -width * 0.42;
    ring1.castShadow = true;
    wheel.add(ring1);

    const ring2 = ring1.clone();
    ring2.position.x = width * 0.42;
    wheel.add(ring2);

    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, width + 0.5, 8), rimMat);
    axle.rotation.z = Math.PI / 2;
    wheel.add(axle);

    for (let i = 0; i < blades; i += 1) {
      const angle = (i / blades) * Math.PI * 2;
      const paddle = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 0.08, radius * 0.62), bladeMat);
      paddle.position.set(0, Math.cos(angle) * radius * 0.78, Math.sin(angle) * radius * 0.78);
      paddle.rotation.x = -angle;
      paddle.castShadow = true;
      wheel.add(paddle);
    }
    return wheel;
  }

  buildStations() {
    const zPositions = [6.2, 2.8, -0.5, -3.8, -7.2, -11.5];
    const yPositions = [0.2, 0.2, 0.2, 0.2, 0.2, 4.0];

    const blueprintMat = new THREE.MeshBasicMaterial({
      color: "#38bdf8",
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    STATION_DEFS.forEach((def, idx) => {
      const z = zPositions[idx];
      const y = yPositions[idx];
      const slot = new THREE.Group();
      slot.position.set(-1.2, y, z);

      // Hologram placeholder when locked
      const pad = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.25, 2.4), blueprintMat);
      pad.position.set(0, 0.1, 0);
      slot.add(pad);

      // Actual station root
      const model = new THREE.Group();
      model.visible = false;
      let spinner = null;
      let extraSpinner = null;

      if (def.id === "wood_wheel") {
        const wood = flatMat("#92400e");
        const iron = flatMat("#475569", 0.4, 0.5);
        addBox(model, 0.3, 1.7, 0.3, -1.35, 0.65, 0, wood);
        addBox(model, 0.3, 1.7, 0.3, 1.35, 0.65, 0, wood);
        addBox(model, 0.9, 0.8, 0.9, 1.85, 0.55, 0, iron);
        spinner = this.createWheelMesh(8, 1.05, 1.5, "#78350f", "#b45309");
        spinner.position.set(0, 1.05, 0);
        model.add(spinner);
      } else if (def.id === "twin_paddle") {
        const stone = flatMat("#64748b");
        const copper = flatMat("#d97706", 0.4, 0.6);
        addBox(model, 0.45, 2.0, 0.7, -1.6, 0.75, 0, stone);
        addBox(model, 0.45, 2.0, 0.7, 1.6, 0.75, 0, stone);
        addBox(model, 1.1, 1.0, 1.2, 2.2, 0.6, 0, copper);
        spinner = this.createWheelMesh(10, 1.15, 0.9, "#334155", "#0284c7");
        spinner.position.set(-0.65, 1.15, 0);
        extraSpinner = this.createWheelMesh(10, 1.15, 0.9, "#334155", "#0284c7");
        extraSpinner.position.set(0.65, 1.15, 0);
        model.add(spinner, extraSpinner);
      } else if (def.id === "pelton_jet") {
        const steel = flatMat("#cbd5e1", 0.35, 0.65);
        const cyanGlow = flatMat("#06b6d4", 0.2, 0.2, { emissive: "#0ea5e9", emissiveIntensity: 0.7 });
        addBox(model, 3.6, 0.4, 1.4, 0, 0.2, 0, flatMat("#334155"));
        addBox(model, 1.2, 1.4, 1.4, 2.1, 0.85, 0, steel);
        addBox(model, 0.3, 0.3, 0.3, 2.1, 1.65, 0, cyanGlow);
        spinner = this.createWheelMesh(12, 1.2, 1.2, "#0284c7", "#38bdf8");
        spinner.position.set(-0.2, 1.25, 0);
        model.add(spinner);
      } else if (def.id === "concrete_dam") {
        const concrete = flatMat("#cbd5e1", 0.8);
        const accent = flatMat("#0284c7", 0.4, 0.3);
        const glow = flatMat("#38bdf8", 0.2, 0.1, { emissive: "#38bdf8", emissiveIntensity: 0.85 });
        addBox(model, 5.8, 2.4, 1.3, 0, 1.0, 0, concrete);
        addBox(model, 1.5, 0.95, 1.5, 2.2, 1.95, 0, accent);
        addBox(model, 0.9, 0.25, 0.25, 0, 1.9, 0.65, glow);
        spinner = this.createWheelMesh(14, 0.95, 1.6, "#1e293b", "#38bdf8");
        spinner.position.set(-0.5, 0.95, 0.85);
        model.add(spinner);
      } else if (def.id === "arch_megadam") {
        const whiteWall = flatMat("#f8fafc", 0.5, 0.2);
        const neon = flatMat("#22d3ee", 0.15, 0.1, { emissive: "#06b6d4", emissiveIntensity: 1.0 });
        addBox(model, 6.2, 3.1, 1.4, 0, 1.4, 0, whiteWall);
        addBox(model, 1.1, 3.6, 1.1, -2.5, 1.6, 0, whiteWall);
        addBox(model, 1.1, 3.6, 1.1, 2.5, 1.6, 0, whiteWall);
        addBox(model, 4.2, 0.22, 0.22, 0, 2.6, 0.72, neon);
        spinner = this.createWheelMesh(16, 1.05, 1.8, "#0ea5e9", "#67e8f9");
        spinner.position.set(0, 1.05, 0.95);
        model.add(spinner);
      } else if (def.id === "quantum_hydro") {
        const darkMetal = flatMat("#0f172a", 0.3, 0.8);
        const coreMat = flatMat("#67e8f9", 0.1, 0.1, { emissive: "#22d3ee", emissiveIntensity: 1.4 });
        addCyl(model, 1.7, 2.0, 0.8, 8, 0, 0.3, 0, darkMetal);
        const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), coreMat);
        orb.position.set(0, 2.1, 0);
        model.add(orb);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.09, 6, 20), coreMat);
        ring.position.set(0, 2.1, 0);
        ring.rotation.x = Math.PI / 3;
        model.add(ring);
        spinner = orb;
        extraSpinner = ring;
      }

      slot.add(model);
      this.scene.add(slot);
      this.stationNodes[def.id] = {
        slot,
        pad,
        model,
        spinner,
        extraSpinner,
        scaleAnim: 0.01,
        pulseBoost: 0,
        isQuantum: def.id === "quantum_hydro"
      };
    });
  }

  buildPowerLines() {
    const poleMat = flatMat("#475569", 0.6, 0.4);
    const wireMat = new THREE.LineBasicMaterial({ color: "#38bdf8", transparent: true, opacity: 0.75 });
    const poleXs = [2.2, 5.2];
    const poleZs = [6.5, 0.5, -5.5];

    const points = [];
    for (const pz of poleZs) {
      addCyl(this.scene, 0.09, 0.12, 3.2, 6, poleXs[0], 1.6, pz, poleMat);
      addCyl(this.scene, 0.09, 0.12, 3.2, 6, poleXs[1], 1.8, pz, poleMat);
      const start = new THREE.Vector3(poleXs[0], 3.1, pz);
      const end = new THREE.Vector3(poleXs[1], 3.3, pz);
      const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
      this.scene.add(new THREE.Line(geo, wireMat));
      this.pulsePaths.push({ start, end });
    }

    const pulseGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: "#67e8f9" });
    for (let i = 0; i < this.pulsePaths.length * 2; i += 1) {
      const mesh = new THREE.Mesh(pulseGeo, pulseMat);
      this.scene.add(mesh);
      this.energyPulses.push({
        mesh,
        pathIndex: i % this.pulsePaths.length,
        t: (i * 0.37) % 1
      });
    }
    void points;
  }

  buildCityEras() {
    const cityRoot = new THREE.Group();
    cityRoot.position.set(8.8, 0.4, 0);
    this.scene.add(cityRoot);

    const wood = flatMat("#9a3412");
    const roofRed = flatMat("#dc2626");
    const roofBlue = flatMat("#0284c7");
    const wallCream = flatMat("#f1f5f9");
    const brick = flatMat("#b45309");
    const glass = flatMat("#38bdf8", 0.2, 0.6, { emissive: "#0284c7", emissiveIntensity: 0.35 });
    const windowGlow = flatMat("#fde047", 0.2, 0.1, { emissive: "#facc15", emissiveIntensity: 0.85 });
    const neonCyan = flatMat("#67e8f9", 0.1, 0.2, { emissive: "#22d3ee", emissiveIntensity: 1.2 });

    // Era 0: Camp & Shack
    const era0 = new THREE.Group();
    const tent = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.1, 4), flatMat("#f97316"));
    tent.position.set(-1.5, 0.55, 4.0);
    tent.rotation.y = Math.PI / 4;
    tent.castShadow = true;
    era0.add(tent);
    addBox(era0, 1.6, 1.1, 1.4, 0.8, 0.55, 3.2, wood);
    const shackRoof = new THREE.Mesh(new THREE.ConeGeometry(1.25, 0.75, 4), roofRed);
    shackRoof.position.set(0.8, 1.45, 3.2);
    shackRoof.rotation.y = Math.PI / 4;
    era0.add(shackRoof);

    // Era 1: Cozy Village Houses
    const era1 = new THREE.Group();
    const houseCoords = [
      [-1.8, 0.2, roofBlue],
      [1.4, -0.4, roofRed],
      [-0.2, -3.5, roofBlue]
    ];
    for (const [hx, hz, rMat] of houseCoords) {
      addBox(era1, 1.6, 1.2, 1.5, hx, 0.6, hz, wallCream);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.85, 4), rMat);
      roof.position.set(hx, 1.6, hz);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      era1.add(roof);
      addBox(era1, 0.35, 0.35, 0.08, hx, 0.7, hz + 0.76, windowGlow, false);
    }

    // Era 2: Industrial Town
    const era2 = new THREE.Group();
    addBox(era2, 2.2, 2.4, 1.8, 3.2, 1.2, 2.0, brick);
    addBox(era2, 1.5, 0.3, 0.1, 3.2, 1.8, 2.91, windowGlow, false);
    addBox(era2, 2.0, 2.8, 2.0, -2.5, 1.4, -6.2, brick);
    addBox(era2, 1.4, 0.35, 0.1, -2.5, 2.1, -5.18, windowGlow, false);

    // Era 3: Modern Eco-City
    const era3 = new THREE.Group();
    addBox(era3, 2.1, 4.2, 2.1, 0.4, 2.1, -7.0, wallCream);
    addBox(era3, 1.8, 3.6, 2.15, 0.4, 2.1, -7.0, glass, false);
    addBox(era3, 2.2, 3.5, 1.9, 3.5, 1.75, -3.2, wallCream);
    addBox(era3, 2.25, 2.7, 1.6, 3.5, 1.8, -3.2, glass, false);

    // Era 4: Futuristic Green Metropolis
    const era4 = new THREE.Group();
    addBox(era4, 2.2, 6.4, 2.2, 2.8, 3.2, -7.4, wallCream);
    addBox(era4, 2.3, 0.22, 2.3, 2.8, 5.8, -7.4, neonCyan, false);
    addBox(era4, 1.8, 5.4, 1.8, -2.4, 2.7, 6.4, wallCream);
    addBox(era4, 1.9, 0.2, 1.9, -2.4, 4.9, 6.4, neonCyan, false);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.1, 6, 18), neonCyan);
    halo.position.set(2.8, 6.9, -7.4);
    halo.rotation.x = Math.PI / 2;
    era4.add(halo);
    this.cityHalo = halo;

    this.eraGroups = [era0, era1, era2, era3, era4];
    this.eraGroups.forEach((grp, idx) => {
      grp.scale.set(1, idx === 0 ? 1 : 0.001, 1);
      grp.visible = idx === 0;
      cityRoot.add(grp);
    });
  }

  buildSplashParticles() {
    const count = 90;
    const geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const mat = new THREE.MeshBasicMaterial({ color: "#e0f2fe" });
    this.splashInstanced = new THREE.InstancedMesh(geo, mat, count);
    this.splashInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.splashInstanced);

    for (let i = 0; i < count; i += 1) {
      this.splashPool.push({
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0.6
      });
    }
    this.dummy = new THREE.Object3D();
  }

  spawnSplash(x, y, z, amount = 4) {
    let spawned = 0;
    for (const p of this.splashPool) {
      if (!p.active) {
        p.active = true;
        p.pos.set(
          x + (Math.random() - 0.5) * 1.4,
          y + Math.random() * 0.4,
          z + (Math.random() - 0.5) * 0.9
        );
        p.vel.set(
          (Math.random() - 0.5) * 2.2,
          1.8 + Math.random() * 2.6,
          (Math.random() - 0.5) * 2.2
        );
        p.life = 0;
        p.maxLife = 0.45 + Math.random() * 0.35;
        spawned += 1;
        if (spawned >= amount) break;
      }
    }
  }

  setCameraPreset(index) {
    const safeIdx = Math.max(0, Math.min(CAMERA_PRESETS.length - 1, index));
    this.presetIndex = safeIdx;
    const preset = CAMERA_PRESETS[safeIdx];
    this.desiredCameraPos.copy(preset.pos);
    this.desiredTarget.copy(preset.target);
    return preset.name;
  }

  triggerStationPulse(stationId) {
    const node = this.stationNodes[stationId];
    if (node) {
      node.pulseBoost = 1.0;
    }
  }

  getStationScreenPosition(stationId) {
    const node = this.stationNodes[stationId];
    if (!node) return null;
    const worldPos = node.slot.position.clone().add(new THREE.Vector3(0, 2.3, 0));
    const projected = worldPos.project(this.camera);
    if (projected.z > 1) return null;
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: rect.left + ((projected.x + 1) * 0.5) * rect.width,
      y: rect.top + ((-projected.y + 1) * 0.5) * rect.height
    };
  }

  bindInput() {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // Screen stays locked; tapping anywhere on the 3D scene boosts water & spawns splash
    this.canvas.addEventListener("pointerdown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, this.camera);
      const hit = raycaster.intersectObject(this.riverMesh);
      if (hit.length > 0) {
        this.spawnSplash(hit[0].point.x, hit[0].point.y + 0.2, hit[0].point.z, 10);
      } else {
        this.spawnSplash(-1.2, 0.5, 2.0, 8);
      }
      if (this.onTapWorld) {
        this.onTapWorld(e.clientX, e.clientY);
      }
    });
  }

  resize() {
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;
    if (width <= 0 || height <= 0) return;
    const aspect = width / height;
    this.camera.fov = aspect < 0.8 ? 48 : 42;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  render(state) {
    const dt = Math.min(0.05, this.clock.getDelta());
    const t = this.clock.elapsedTime;

    const { totalWatts, overdriveMult } = getTotals(state);
    const flowSpeed = (1 + state.upgrades.riverFlow * 0.14) * overdriveMult;

    // Smooth preset camera transition
    this.cameraPos.lerp(this.desiredCameraPos, 0.12);
    this.targetOffset.lerp(this.desiredTarget, 0.12);
    this.camera.position.copy(this.cameraPos);
    this.camera.lookAt(this.targetOffset);

    // Animate river waves
    const posAttr = this.riverMesh.geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i += 1) {
      const ix = i * 3;
      const vx = this.riverBaseY[ix];
      const vz = this.riverBaseY[ix + 2];
      posAttr.array[ix + 1] =
        Math.sin(vz * 0.9 - t * 3.4 * flowSpeed + vx * 0.7) * 0.06 +
        Math.cos(vx * 1.4 + t * 2.1) * 0.025;
    }
    posAttr.needsUpdate = true;

    // Animate foam strips downstream
    for (const strip of this.foamStrips) {
      strip.position.z += dt * 3.2 * flowSpeed;
      if (strip.position.z > 15.5) strip.position.z = -8.6;
    }

    // Waterfall splash
    if (Math.random() < 0.35 * Math.min(2.5, flowSpeed)) {
      this.spawnSplash(-1.2, 0.15, -8.6, 2);
    }

    // Update stations
    for (const def of STATION_DEFS) {
      const st = state.stations[def.id];
      const node = this.stationNodes[def.id];
      if (!node) continue;

      if (st.unlocked) {
        node.pad.visible = false;
        node.model.visible = true;
        node.scaleAnim = Math.min(1, node.scaleAnim + dt * 3.5);
        node.pulseBoost = Math.max(0, (node.pulseBoost || 0) - dt * 2.8);
        const s = (1 - Math.pow(1 - node.scaleAnim, 3)) * (1 + node.pulseBoost * 0.12);
        node.model.scale.setScalar(s);

        const spinSpeed = (1.6 + Math.min(6, st.level * 0.06)) * flowSpeed;
        if (node.isQuantum) {
          if (node.spinner) {
            node.spinner.rotation.y += dt * spinSpeed * 0.9;
            node.spinner.position.y = 2.1 + Math.sin(t * 2.5) * 0.18;
          }
          if (node.extraSpinner) {
            node.extraSpinner.rotation.z += dt * spinSpeed * 1.4;
          }
        } else {
          if (node.spinner) node.spinner.rotation.x += dt * spinSpeed;
          if (node.extraSpinner) node.extraSpinner.rotation.x += dt * spinSpeed;
          if (Math.random() < 0.08 * overdriveMult) {
            this.spawnSplash(node.slot.position.x, node.slot.position.y + 0.25, node.slot.position.z, 1);
          }
        }
      } else {
        node.pad.visible = true;
        node.model.visible = false;
        node.scaleAnim = 0.01;
      }
    }

    // Update City Eras
    this.activeEra = getCityEraIndex(totalWatts);
    for (let i = 0; i < this.eraGroups.length; i += 1) {
      const unlocked = i <= this.activeEra;
      const grp = this.eraGroups[i];
      if (unlocked) {
        grp.visible = true;
        this.eraScales[i] = Math.min(1, this.eraScales[i] + dt * 2.4);
        grp.scale.set(1, this.eraScales[i], 1);
      } else {
        grp.visible = false;
        this.eraScales[i] = 0.001;
      }
    }
    if (this.cityHalo && this.activeEra >= 4) {
      this.cityHalo.rotation.z += dt * 1.2;
      this.cityHalo.position.y = 6.9 + Math.sin(t * 2) * 0.16;
    }

    // Energy pulses on power lines
    const pulseRate = totalWatts > 0 ? 0.55 * Math.min(3.5, flowSpeed) : 0;
    for (const ep of this.energyPulses) {
      ep.mesh.visible = totalWatts > 0;
      if (!ep.mesh.visible) continue;
      ep.t = (ep.t + dt * pulseRate) % 1;
      const path = this.pulsePaths[ep.pathIndex];
      ep.mesh.position.lerpVectors(path.start, path.end, ep.t);
    }

    // Update splash particles
    for (let i = 0; i < this.splashPool.length; i += 1) {
      const p = this.splashPool[i];
      if (p.active) {
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          this.dummy.scale.setScalar(0);
        } else {
          p.vel.y -= 9.5 * dt;
          p.pos.addScaledVector(p.vel, dt);
          const fade = 1 - p.life / p.maxLife;
          this.dummy.position.copy(p.pos);
          this.dummy.scale.setScalar(fade);
        }
      } else {
        this.dummy.scale.setScalar(0);
      }
      this.dummy.updateMatrix();
      this.splashInstanced.setMatrixAt(i, this.dummy.matrix);
    }
    this.splashInstanced.instanceMatrix.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }
}
