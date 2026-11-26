import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getCityEraIndex, getTotals, getZoneStations } from "./economy.js";

const CAMERA_PRESETS = [
  { name: "Обзор", pos: new THREE.Vector3(16.2, 15.8, 20.8), target: new THREE.Vector3(4.2, 0.7, 0.2) },
  { name: "Станции", pos: new THREE.Vector3(8.5, 8.2, 11.5), target: new THREE.Vector3(-1.2, 1.0, 2.2) },
  { name: "Плотина", pos: new THREE.Vector3(10.5, 9.5, 7.5), target: new THREE.Vector3(-1.2, 1.6, -4.5) },
  { name: "Город", pos: new THREE.Vector3(21.5, 13.0, 14.0), target: new THREE.Vector3(8.5, 1.8, -0.5) }
];

function flatMat(color, _roughness = 0.8, _metalness = 0.05, extra = {}) {
  return new THREE.MeshLambertMaterial({
    color,
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
  constructor(canvas, onTapWorld, onTapEvent = null) {
    this.canvas = canvas;
    this.onTapWorld = onTapWorld;
    this.onTapEvent = onTapEvent;
    this.clock = new THREE.Clock();
    this.presetIndex = 0;

    // Camera preset + optional hand-panning & wheel zoom state (no rotation)
    this.panEnabled = false;
    this.isPortrait = false;
    this.panOffset = new THREE.Vector3(0, 0, 0);
    this.zoomScale = 1.0;
    this.desiredZoomScale = 1.0;
    this.shakeAmount = 0;
    this.keysHeld = new Set();
    this.cameraPos = CAMERA_PRESETS[0].pos.clone();
    this.targetOffset = CAMERA_PRESETS[0].target.clone();
    this.desiredCameraPos = CAMERA_PRESETS[0].pos.clone();
    this.desiredTarget = CAMERA_PRESETS[0].target.clone();
    this.currentZoneId = "valley";

    this.stationNodes = {};
    this.dockBuoys = [];
    this.haloRings = [];
    this.eraGroups = [];
    this.eraScales = [1, 0.001, 0.001, 0.001, 0.001];
    this.activeEra = 0;
    this._prevUnlockedMask = "";
    this._prevEraDrawn = 0;
    this._tmpA = new THREE.Vector3();
    this._tmpB = new THREE.Vector3();
    this._mobilePerf =
      typeof navigator !== "undefined" &&
      (/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || "") ||
        (navigator.hardwareConcurrency || 4) <= 4);

    this.energyPulses = [];
    this.pulsePaths = [];
    this.splashPool = [];
    this.rainPool = [];
    this.snowPool = [];
    this.trees = [];
    this.cyberRings = [];
    this.vehicles = [];
    this.clouds = [];
    this.windSpinners = [];
    this.stationMats = null;
    this.activeEvent = null;
    this.nextEventInSec = 10;

    this.initRenderer();
    this.initScene();
    this.buildSkyAndClouds();
    this.initStationMaterials();
    this.buildTerrainAndRiver();
    this.buildBridge();
    this.buildZoneLandmarks();
    this.buildStations();
    this.buildPowerLines();
    this.buildCityEras();
    this.buildSplashParticles();
    this.buildRainParticles();
    this.buildSnowParticles();
    this.buildRiverEventModels();
    this.bindInput();
    this.resize();
    this.invalidateShadows();
  }

  invalidateShadows() {
    if (this.renderer && this.renderer.shadowMap) {
      this.renderer.shadowMap.needsUpdate = true;
    }
  }

  initStationMaterials() {
    this.stationMats = {
      wood: flatMat("#8b4513", 0.75, 0.1),
      metal: flatMat("#475569", 0.42, 0.55),
      concrete: flatMat("#cbd5e1", 0.72, 0.1),
      accent: flatMat("#0284c7", 0.35, 0.35),
      blade: flatMat("#38bdf8", 0.35, 0.25),
      copper: flatMat("#d97706", 0.38, 0.6),
      glow: flatMat("#38bdf8", 0.15, 0.1, { emissive: "#0ea5e9", emissiveIntensity: 0.9 }),
      coreGlow: flatMat("#67e8f9", 0.1, 0.1, { emissive: "#22d3ee", emissiveIntensity: 1.35 })
    };
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this._mobilePerf,
      powerPreference: this._mobilePerf ? "default" : "high-performance"
    });
    const maxDpr = this._mobilePerf ? 1.5 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.type = this._mobilePerf ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#73c2fb");
    this.scene.fog = new THREE.Fog("#8dd1fc", 30, 78);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.5, 140);

    const hemi = new THREE.HemisphereLight("#e0f4ff", "#264653", 1.0);
    this.hemiLight = hemi;
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight("#fff6df", 1.75);
    this.sunLight = sun;
    sun.position.set(16, 26, 14);
    sun.castShadow = true;
    const sSize = this._mobilePerf ? 512 : 1024;
    sun.shadow.mapSize.set(sSize, sSize);
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 70;
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 24;
    sun.shadow.camera.bottom = -24;
    sun.shadow.bias = -0.0007;
    this.scene.add(sun);
  }

  buildSkyAndClouds() {
    this.skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTopColor: { value: new THREE.Color("#1d70b8") },
        uHorizonColor: { value: new THREE.Color("#bae6fd") }
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uHorizonColor;
        varying vec3 vWorldPos;
        void main() {
          float h = clamp(normalize(vWorldPos).y, 0.0, 1.0);
          float mixVal = smoothstep(0.0, 0.65, h);
          gl_FragColor = vec4(mix(uHorizonColor, uTopColor, mixVal), 1.0);
        }
      `
    });
    const skyDome = new THREE.Mesh(new THREE.SphereGeometry(95, 24, 16), this.skyMat);
    this.scene.add(skyDome);

    this.cloudMat = new THREE.MeshLambertMaterial({
      color: "#ffffff",
      flatShading: true
    });
    const cloudSeeds = [
      [-18, 17, -22, 1.2], [-4, 19, -26, 1.4], [14, 18, -20, 1.1],
      [-24, 16, 4, 1.0], [22, 17, -6, 1.3], [6, 20, -30, 1.5]
    ];
    for (const [cx, cy, cz, sc] of cloudSeeds) {
      const grp = new THREE.Group();
      const puffs = [[0, 0, 0, 1.6], [1.4, -0.2, 0.2, 1.2], [-1.3, -0.25, -0.1, 1.15], [0.5, 0.55, -0.2, 1.1]];
      for (const [px, py, pz, r] of puffs) {
        const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), this.cloudMat);
        puff.position.set(px, py, pz);
        puff.scale.set(1.2, 0.72, 0.95);
        grp.add(puff);
      }
      grp.position.set(cx, cy, cz);
      grp.scale.setScalar(sc);
      this.scene.add(grp);
      this.clouds.push({ grp, speed: 0.45 + Math.random() * 0.35 });
    }
  }

  buildTerrainAndRiver() {
    this.grassMat = flatMat("#45a85f", 0.88);
    this.darkGrassMat = flatMat("#2f855a", 0.9);
    this.rockMat = flatMat("#64748b", 0.92);
    this.cliffMat = flatMat("#475569", 0.92);
    this.sandMat = flatMat("#d6b98c", 0.95);
    this.leafMat = flatMat("#15803d");

    const grassMat = this.grassMat;
    const darkGrassMat = this.darkGrassMat;
    const rockMat = this.rockMat;
    const cliffMat = this.cliffMat;
    const sandMat = this.sandMat;

    const buckets = new Map();
    const pushStaticBox = (w, h, d, x, y, z, mat) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      geo.translate(x, y, z);
      if (!buckets.has(mat)) buckets.set(mat, []);
      buckets.get(mat).push(geo);
    };

    const baseSlabMat = flatMat("#1e293b", 0.95);
    // Base valley slab (expanded for 16:9 PC widescreen)
    pushStaticBox(76, 3, 68, 2, -1.7, 0, baseSlabMat);

    // Right green plateau (City side) + terraced grass step
    pushStaticBox(32, 1.2, 48, 16.5, -0.2, 0, grassMat);
    pushStaticBox(4.2, 0.5, 29, 4.0, 0.15, 2.5, darkGrassMat);
    // Left hilly canyon bank + terraced cliffs
    pushStaticBox(28, 1.8, 48, -17.5, 0.1, 0, darkGrassMat);
    pushStaticBox(18, 3.6, 22, -15.0, 1.4, -7, rockMat);
    pushStaticBox(12, 2.8, 14, -13.5, 3.4, -12, cliffMat);

    // Upper Reservoir Plateau (North / -Z) & sculpted waterfall gorge
    pushStaticBox(58, 4.4, 18, 0, 1.6, -18, cliffMat);
    pushStaticBox(22, 0.45, 18, 14.5, 3.85, -18, darkGrassMat);
    pushStaticBox(22, 0.45, 18, -15.5, 3.85, -18, rockMat);
    pushStaticBox(2.4, 3.6, 2.2, -5.2, 1.8, -9.2, rockMat);
    pushStaticBox(2.4, 3.6, 2.2, 2.8, 1.8, -9.2, rockMat);

    // Riverbed sand banks & engineered stone retaining walls with buttresses
    pushStaticBox(6.4, 0.35, 26, -1.2, -0.35, 3, sandMat);
    pushStaticBox(0.55, 0.95, 25.5, -4.2, 0.15, 3.2, cliffMat);
    pushStaticBox(0.55, 0.95, 25.5, 1.8, 0.15, 3.2, cliffMat);
    for (let bz = -7; bz <= 13; bz += 4) {
      pushStaticBox(0.85, 0.82, 0.7, -4.45, 0.1, bz, rockMat);
      pushStaticBox(0.85, 0.82, 0.7, 2.05, 0.1, bz, rockMat);
    }

    // Stepped canyon rock ledges on left cliff
    pushStaticBox(8.5, 1.1, 14, -7.8, 1.25, -13.5, rockMat);
    pushStaticBox(6.0, 0.85, 10, -8.5, 0.95, 2.5, rockMat);

    for (const [mat, geos] of buckets.entries()) {
      const merged = mergeGeometries(geos, false);
      geos.forEach((g) => g.dispose());
      if (merged) {
        const mesh = new THREE.Mesh(merged, mat);
        mesh.castShadow = mat === rockMat || mat === cliffMat;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
      }
    }

    // Upper river water (dedicated material without vertexColors)
    this.upperWaterMat = new THREE.MeshLambertMaterial({
      color: "#0ea5e9",
      transparent: true,
      opacity: 0.92
    });
    this.waterMat = new THREE.MeshLambertMaterial({
      color: "#0ea5e9",
      transparent: true,
      opacity: 0.92
    });

    const upperWater = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 11, 4, 4), this.upperWaterMat);
    upperWater.rotation.x = -Math.PI / 2;
    upperWater.position.set(-1.2, 3.94, -14.5);
    upperWater.receiveShadow = true;
    this.scene.add(upperWater);

    // Waterfall cascade + white crest + plunge foam ring
    const fallGeo = new THREE.PlaneGeometry(4.8, 4.2, 4, 6);
    this.waterfallMesh = new THREE.Mesh(fallGeo, this.upperWaterMat);
    this.waterfallMesh.position.set(-1.2, 1.85, -9.05);
    this.waterfallMesh.rotation.x = -0.12;
    this.scene.add(this.waterfallMesh);

    const crestMat = new THREE.MeshBasicMaterial({ color: "#e0f2fe", transparent: true, opacity: 0.88 });
    addBox(this.scene, 4.85, 0.22, 0.35, -1.2, 3.85, -9.15, crestMat, false);
    addBox(this.scene, 4.9, 0.28, 0.85, -1.2, 0.14, -8.65, crestMat, false);

    // Lower animated river mesh with vertex colors (bright shallow shores, deep center)
    const riverGeo = new THREE.PlaneGeometry(5.4, 25, 12, 32);
    riverGeo.rotateX(-Math.PI / 2);
    const rPos = riverGeo.attributes.position;
    const colors = new Float32Array(rPos.count * 3);
    for (let i = 0; i < rPos.count; i += 1) {
      const edge = Math.min(1, Math.abs(rPos.getX(i)) / 2.7);
      // Center deep azure (0.72, 0.92, 1.0), edge bright turquoise foam tint (1.0, 1.0, 1.0)
      colors[i * 3] = 0.72 + edge * 0.28;
      colors[i * 3 + 1] = 0.9 + edge * 0.1;
      colors[i * 3 + 2] = 1.0;
    }
    riverGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.waterMat.vertexColors = true;
    this.riverBaseY = rPos.array.slice();
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
    const leafMat = this.leafMat;
    const treeCoords = [
      [-6.5, 1.0, 9], [-8.2, 1.0, 4], [-7.0, 1.0, -2], [-9.2, 3.2, -8],
      [-5.5, 3.9, -13], [-10.8, 3.9, -15], [-8.2, 3.9, -17], [5.5, 3.9, -14],
      [9.5, 3.9, -16], [14.5, 0.4, 10], [15.8, 0.4, 2], [14.2, 0.4, -7]
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

  buildBridge() {
    const bridge = new THREE.Group();
    bridge.position.set(-1.2, 0, 9.6);
    const stone = flatMat("#64748b", 0.85);
    const deck = flatMat("#94a3b8", 0.7);
    const rail = flatMat("#334155", 0.5, 0.4);
    const lampGlow = flatMat("#fde047", 0.2, 0.1, { emissive: "#facc15", emissiveIntensity: 1.0 });

    // Stone piers & arched deck over river
    addBox(bridge, 1.1, 1.4, 2.0, -3.2, 0.4, 0, stone);
    addBox(bridge, 1.1, 1.4, 2.0, 3.2, 0.4, 0, stone);
    addBox(bridge, 7.6, 0.32, 1.9, 0, 1.15, 0, deck);
    addBox(bridge, 7.6, 0.35, 0.14, 0, 1.48, 0.86, rail);
    addBox(bridge, 7.6, 0.35, 0.14, 0, 1.48, -0.86, rail);

    // Bridge lanterns & arched suspension pylons
    for (const lx of [-2.6, 2.6]) {
      addCyl(bridge, 0.06, 0.08, 1.1, 6, lx, 1.85, 0.86, rail);
      addBox(bridge, 0.22, 0.24, 0.22, lx, 2.45, 0.86, lampGlow, false);
    }
    addBox(bridge, 0.22, 1.4, 0.22, -1.8, 2.0, -0.86, rail);
    addBox(bridge, 0.22, 1.4, 0.22, 1.8, 2.0, -0.86, rail);
    addBox(bridge, 3.8, 0.14, 0.14, 0, 2.68, -0.86, rail);
    this.scene.add(bridge);
  }

  buildStationDock(slot, m) {
    const pad = new THREE.Group();
    const deckMat = flatMat("#475569", 0.78, 0.2);
    const buoyMat = flatMat("#f97316", 0.35, 0.15, { emissive: "#ea580c", emissiveIntensity: 0.45 });
    const pylonCorners = [[-1.65, -1.15], [1.65, -1.15], [-1.65, 1.15], [1.65, 1.15]];
    for (const [px, pz] of pylonCorners) {
      addCyl(pad, 0.11, 0.13, 0.75, 6, px, 0.12, pz, m.wood);
      const buoy = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), buoyMat);
      buoy.position.set(px, 0.58, pz);
      pad.add(buoy);
      this.dockBuoys.push({ mesh: buoy, baseY: 0.58, phase: px + pz });
    }
    addBox(pad, 3.2, 0.1, 0.22, 0, 0.18, -1.12, deckMat, false);
    addBox(pad, 3.2, 0.1, 0.22, 0, 0.18, 1.12, deckMat, false);
    slot.add(pad);
    return pad;
  }

  addStationTiers(model, m) {
    // Tier 10: twin copper capacitor tanks + golden trim collar
    const tier10 = new THREE.Group();
    tier10.visible = false;
    addCyl(tier10, 0.24, 0.26, 0.85, 8, 2.05, 1.25, -0.52, m.copper);
    addCyl(tier10, 0.24, 0.26, 0.85, 8, 2.05, 1.25, 0.52, m.copper);
    addBox(tier10, 0.65, 0.16, 1.25, 2.05, 1.7, 0, m.accent, false);
    model.add(tier10);

    // Tier 25: steel gantry frame + twin glowing spotlights
    const tier25 = new THREE.Group();
    tier25.visible = false;
    addBox(tier25, 0.18, 2.65, 0.18, -1.85, 1.32, 0.82, m.metal);
    addBox(tier25, 0.18, 2.65, 0.18, 1.85, 1.32, 0.82, m.metal);
    addBox(tier25, 3.9, 0.18, 0.18, 0, 2.65, 0.82, m.metal);
    addBox(tier25, 0.34, 0.22, 0.28, -1.1, 2.68, 0.9, m.coreGlow, false);
    addBox(tier25, 0.34, 0.22, 0.28, 1.1, 2.68, 0.9, m.coreGlow, false);
    model.add(tier25);

    // Tier 50: rotating high-voltage energy crown above station
    const tier50 = new THREE.Group();
    tier50.visible = false;
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 6, 18), m.coreGlow);
    halo.position.set(0, 3.2, 0);
    halo.rotation.x = Math.PI / 2;
    tier50.add(halo);
    this.haloRings.push(halo);
    const crystalCap = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), m.glow);
    crystalCap.position.set(0, 3.25, 0);
    tier50.add(crystalCap);
    model.add(tier50);

    return { tier10, tier25, tier50 };
  }

  createWheelMesh(blades, radius, width, rimMat, bladeMat) {
    const wheel = new THREE.Group();

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.09, 6, 18), rimMat);
    ring1.rotation.y = Math.PI / 2;
    ring1.position.x = -width * 0.42;
    wheel.add(ring1);

    const ring2 = ring1.clone();
    ring2.position.x = width * 0.42;
    wheel.add(ring2);

    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, width + 0.55, 8), rimMat);
    axle.rotation.z = Math.PI / 2;
    wheel.add(axle);

    for (let i = 0; i < blades; i += 1) {
      const angle = (i / blades) * Math.PI * 2;
      const paddle = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 0.09, radius * 0.62), bladeMat);
      paddle.position.set(0, Math.cos(angle) * radius * 0.78, Math.sin(angle) * radius * 0.78);
      paddle.rotation.x = -angle;
      wheel.add(paddle);
    }
    return wheel;
  }

  buildStations() {
    const zPositions = [6.2, 2.8, -0.5, -3.8, -7.2, -11.5];
    const yPositions = [0.2, 0.2, 0.2, 0.2, 0.2, 4.0];

    const m = this.stationMats;

    getZoneStations("valley").forEach((def, idx) => {
      const z = zPositions[idx];
      const y = yPositions[idx];
      const slot = new THREE.Group();
      slot.position.set(-1.2, y, z);

      const pad = this.buildStationDock(slot, m);

      const model = new THREE.Group();
      model.visible = false;
      let spinner = null;
      let extraSpinner = null;

      if (idx === 0) {
        addBox(model, 0.3, 1.75, 0.32, -1.35, 0.68, 0, m.wood);
        addBox(model, 0.3, 1.75, 0.32, 1.35, 0.68, 0, m.wood);
        addBox(model, 1.05, 0.85, 1.05, 1.95, 0.55, 0, m.metal);
        addBox(model, 0.35, 0.35, 0.35, 1.95, 1.1, 0, m.glow, false);
        spinner = this.createWheelMesh(8, 1.08, 1.5, m.wood, m.copper);
        spinner.position.set(0, 1.08, 0);
        model.add(spinner);
      } else if (idx === 1) {
        addBox(model, 0.45, 2.05, 0.75, -1.65, 0.78, 0, m.concrete);
        addBox(model, 0.45, 2.05, 0.75, 1.65, 0.78, 0, m.concrete);
        addBox(model, 1.25, 1.05, 1.3, 2.25, 0.62, 0, m.copper);
        addBox(model, 0.45, 0.25, 0.45, 2.25, 1.25, 0, m.glow, false);
        spinner = this.createWheelMesh(10, 1.15, 0.9, m.metal, m.blade);
        spinner.position.set(-0.65, 1.15, 0);
        extraSpinner = this.createWheelMesh(10, 1.15, 0.9, m.metal, m.blade);
        extraSpinner.position.set(0.65, 1.15, 0);
        model.add(spinner, extraSpinner);
      } else if (idx === 2) {
        addBox(model, 3.8, 0.42, 1.45, 0, 0.2, 0, m.metal);
        addBox(model, 1.35, 1.5, 1.45, 2.15, 0.9, 0, m.concrete);
        addBox(model, 0.9, 0.35, 0.9, 2.15, 1.75, 0, m.accent);
        addBox(model, 0.35, 0.25, 0.35, 2.15, 2.0, 0, m.glow, false);
        spinner = this.createWheelMesh(12, 1.22, 1.25, m.accent, m.blade);
        spinner.position.set(-0.2, 1.25, 0);
        model.add(spinner);
      } else if (idx === 3) {
        addBox(model, 5.8, 2.45, 1.35, 0, 1.02, 0, m.concrete);
        addBox(model, 1.55, 0.95, 1.55, 2.15, 1.98, 0, m.accent);
        addBox(model, 1.1, 0.3, 0.28, 0, 1.95, 0.7, m.glow, false);
        addBox(model, 0.35, 1.2, 0.35, -1.8, 1.2, 0.6, m.metal);
        spinner = this.createWheelMesh(14, 0.98, 1.6, m.metal, m.blade);
        spinner.position.set(-0.5, 0.98, 0.88);
        model.add(spinner);
      } else if (idx === 4) {
        addBox(model, 6.2, 3.15, 1.45, 0, 1.42, 0, m.concrete);
        addBox(model, 1.15, 3.7, 1.15, -2.5, 1.65, 0, m.concrete);
        addBox(model, 1.15, 3.7, 1.15, 2.5, 1.65, 0, m.concrete);
        addBox(model, 4.3, 0.24, 0.24, 0, 2.65, 0.74, m.coreGlow, false);
        spinner = this.createWheelMesh(16, 1.08, 1.85, m.accent, m.blade);
        spinner.position.set(0, 1.08, 0.98);
        model.add(spinner);
      } else if (idx === 5) {
        addCyl(model, 1.75, 2.05, 0.85, 8, 0, 0.32, 0, m.metal);
        const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.88, 0), m.coreGlow);
        orb.position.set(0, 2.15, 0);
        model.add(orb);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.1, 6, 22), m.glow);
        ring.position.set(0, 2.15, 0);
        ring.rotation.x = Math.PI / 3;
        model.add(ring);
        spinner = orb;
        extraSpinner = ring;
      }

      const tiers = this.addStationTiers(model, m);
      slot.add(model);
      this.scene.add(slot);
      this.stationNodes[def.id] = {
        slot,
        pad,
        model,
        tiers,
        spinner,
        extraSpinner,
        scaleAnim: 0.01,
        pulseBoost: 0,
        isQuantum: idx === 5
      };
    });
  }

  buildZoneLandmarks() {
    // Location 2: Glacier snow peaks, ice floes, and warm geothermal stacks
    this.glacierProps = new THREE.Group();
    const snowMat = flatMat("#f8fafc", 0.85);
    const iceMat = flatMat("#bae6fd", 0.25, 0.15);
    const warmOrange = flatMat("#f97316", 0.3, 0.2, { emissive: "#ea580c", emissiveIntensity: 0.75 });

    const peaks = [
      [-10.5, 4.6, -15.0, 4.5, 7.5],
      [-14.0, 3.8, -6.0, 4.0, 6.2],
      [-12.5, 2.8, 5.5, 3.6, 5.0],
      [15.0, 4.5, -16.0, 4.2, 6.8]
    ];
    for (const [px, py, pz, r, h] of peaks) {
      const peak = new THREE.Mesh(new THREE.ConeGeometry(r, h, 5), snowMat);
      peak.position.set(px, py, pz);
      peak.castShadow = true;
      this.glacierProps.add(peak);
    }

    const iceFloes = [[-2.6, 0.15, 9.5], [0.4, 0.15, 4.8], [-2.5, 0.15, -2.0], [0.2, 3.9, -13.0]];
    for (const [ix, iy, iz] of iceFloes) {
      addBox(this.glacierProps, 1.3, 0.22, 1.1, ix, iy, iz, iceMat, false);
    }

    // Geothermal warm beacon towers on right bank + crystal ice spires
    addCyl(this.glacierProps, 0.45, 0.6, 2.8, 8, 5.5, 1.4, -7.2, flatMat("#475569"));
    addCyl(this.glacierProps, 0.5, 0.5, 0.35, 8, 5.5, 2.9, -7.2, warmOrange, false);
    addCyl(this.glacierProps, 0.35, 0.48, 2.1, 8, 5.5, 1.05, 6.2, flatMat("#475569"));
    addCyl(this.glacierProps, 0.38, 0.38, 0.28, 8, 5.5, 2.2, 6.2, warmOrange, false);
    for (const [cx, cz] of [[-5.6, 5.0], [3.6, -3.5], [13.5, 6.5]]) {
      const spire = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), iceMat);
      spire.position.set(cx, 1.1, cz);
      spire.scale.set(0.7, 1.9, 0.7);
      this.glacierProps.add(spire);
    }
    this.glacierProps.visible = false;
    this.scene.add(this.glacierProps);

    // Location 3: Cyber Neon Arches over river, canal neon strips & holo pylons
    this.cyberProps = new THREE.Group();
    const darkArch = flatMat("#0f172a", 0.3, 0.8);
    const neonMagenta = flatMat("#f472b6", 0.15, 0.2, { emissive: "#ec4899", emissiveIntensity: 1.4 });
    const neonCyan = flatMat("#22d3ee", 0.15, 0.2, { emissive: "#06b6d4", emissiveIntensity: 1.4 });

    for (const az of [7.8, 0.8, -6.2]) {
      addBox(this.cyberProps, 0.45, 4.6, 0.45, -4.2, 2.3, az, darkArch);
      addBox(this.cyberProps, 0.45, 4.6, 0.45, 1.8, 2.3, az, darkArch);
      addBox(this.cyberProps, 6.4, 0.45, 0.45, -1.2, 4.6, az, darkArch);
      addBox(this.cyberProps, 5.6, 0.16, 0.16, -1.2, 4.35, az, az === 0.8 ? neonMagenta : neonCyan, false);
    }

    // Glowing cyber canal edge rails + city holo-pylons
    addBox(this.cyberProps, 0.12, 0.14, 25.0, -4.05, 0.72, 3.2, neonCyan, false);
    addBox(this.cyberProps, 0.12, 0.14, 25.0, 1.65, 0.72, 3.2, neonMagenta, false);
    for (const [px, pz, mat] of [[6.2, 7.6, neonCyan], [6.2, -7.8, neonMagenta], [14.6, 4.5, neonCyan]]) {
      addBox(this.cyberProps, 0.35, 3.8, 0.35, px, 2.1, pz, darkArch);
      addBox(this.cyberProps, 0.42, 0.8, 0.42, px, 4.2, pz, mat, false);
    }

    const skyRing = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.12, 6, 28), neonMagenta);
    skyRing.position.set(-1.2, 7.6, -12.0);
    skyRing.rotation.x = Math.PI / 2.3;
    this.cyberProps.add(skyRing);
    this.cyberRings.push(skyRing);

    this.cyberProps.visible = false;
    this.scene.add(this.cyberProps);
  }

  buildPowerLines() {
    const poleMat = flatMat("#475569", 0.6, 0.4);
    const wireMat = new THREE.LineBasicMaterial({ color: "#38bdf8", transparent: true, opacity: 0.78 });
    const coilMat = flatMat("#0284c7", 0.3, 0.5, { emissive: "#38bdf8", emissiveIntensity: 0.6 });

    // Transformer Substation on riverbank (connects hydro canyon to city)
    addBox(this.scene, 1.6, 0.45, 2.2, 4.8, 0.55, 0.5, flatMat("#334155"));
    addCyl(this.scene, 0.25, 0.25, 0.9, 8, 4.8, 1.15, -0.1, coilMat);
    addCyl(this.scene, 0.25, 0.25, 0.9, 8, 4.8, 1.15, 1.1, coilMat);

    const spans = [
      [1.9, 3.1, 6.2, 4.8, 3.2, 1.1],
      [1.9, 3.1, 0.5, 4.8, 3.2, 0.5],
      [1.9, 3.1, -4.5, 4.8, 3.2, -0.1],
      [4.8, 3.2, 1.1, 8.8, 3.0, 2.8],
      [4.8, 3.2, 0.5, 9.2, 3.2, -0.2],
      [4.8, 3.2, -0.1, 8.8, 3.4, -5.8]
    ];

    for (const [x1, y1, z1, x2, y2, z2] of spans) {
      addCyl(this.scene, 0.08, 0.11, y1, 6, x1, y1 * 0.5, z1, poleMat);
      addCyl(this.scene, 0.08, 0.11, y2, 6, x2, y2 * 0.5, z2, poleMat);
      const start = new THREE.Vector3(x1, y1, z1);
      const end = new THREE.Vector3(x2, y2, z2);
      const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
      this.scene.add(new THREE.Line(geo, wireMat));
      this.pulsePaths.push({ start, end });
    }

    const pulseGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: "#67e8f9" });
    for (let i = 0; i < this.pulsePaths.length * 3; i += 1) {
      const mesh = new THREE.Mesh(pulseGeo, pulseMat);
      this.scene.add(mesh);
      this.energyPulses.push({
        mesh,
        pathIndex: i % this.pulsePaths.length,
        t: (i * 0.29) % 1
      });
    }
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

    // Era 0: Camp & Shack + Paved Avenue & Dashed Centerline + Streetlight
    const era0 = new THREE.Group();
    const roadMat = flatMat("#334155", 0.9);
    const curbMat = flatMat("#94a3b8", 0.85);
    const stripeMat = flatMat("#f8fafc", 0.7);
    addBox(era0, 1.8, 0.08, 18.2, -1.8, 0.04, 0, roadMat, false);
    addBox(era0, 0.14, 0.11, 18.2, -2.75, 0.055, 0, curbMat, false);
    addBox(era0, 0.14, 0.11, 18.2, -0.85, 0.055, 0, curbMat, false);
    for (let dz = -7.5; dz <= 7.5; dz += 2.2) {
      addBox(era0, 0.1, 0.09, 0.9, -1.8, 0.048, dz, stripeMat, false);
    }
    const tent = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.15, 4), flatMat("#f97316"));
    tent.position.set(-0.1, 0.58, 4.4);
    tent.rotation.y = Math.PI / 4;
    tent.castShadow = true;
    era0.add(tent);
    addBox(era0, 1.7, 1.15, 1.5, 1.4, 0.58, 3.2, wood);
    addBox(era0, 0.25, 0.6, 0.25, 1.9, 1.5, 2.8, flatMat("#64748b"));
    const shackRoof = new THREE.Mesh(new THREE.ConeGeometry(1.38, 0.85, 4), roofRed);
    shackRoof.position.set(1.4, 1.55, 3.2);
    shackRoof.rotation.y = Math.PI / 4;
    era0.add(shackRoof);
    addBox(era0, 0.35, 0.38, 0.08, 1.4, 0.62, 3.97, windowGlow, false);

    // Era 1: Cozy Village Houses + Streetlamps
    const era1 = new THREE.Group();
    const houseCoords = [
      [-0.2, 0.2, roofBlue],
      [2.1, -0.4, roofRed],
      [0.4, -3.5, roofBlue]
    ];
    for (const [hx, hz, rMat] of houseCoords) {
      addBox(era1, 1.65, 1.25, 1.55, hx, 0.62, hz, wallCream);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.36, 0.88, 4), rMat);
      roof.position.set(hx, 1.68, hz);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      era1.add(roof);
      addBox(era1, 0.36, 0.38, 0.08, hx - 0.35, 0.72, hz + 0.79, windowGlow, false);
      addBox(era1, 0.36, 0.38, 0.08, hx + 0.35, 0.72, hz + 0.79, windowGlow, false);
      addBox(era1, 0.32, 0.56, 0.08, hx, 0.28, hz + 0.79, wood, false);
    }

    // Era 2: Industrial Town + Animated City Vehicles
    const era2 = new THREE.Group();
    addBox(era2, 2.2, 2.5, 1.9, 3.2, 1.25, 2.0, brick);
    addBox(era2, 1.5, 0.35, 0.1, 3.2, 1.85, 2.96, windowGlow, false);
    addBox(era2, 1.5, 0.35, 0.1, 3.2, 1.15, 2.96, windowGlow, false);
    addBox(era2, 2.1, 2.9, 2.1, -0.2, 1.45, -6.2, brick);
    addBox(era2, 1.4, 0.35, 0.1, -0.2, 2.15, -5.12, windowGlow, false);

    const carColors = ["#facc15", "#38bdf8", "#f472b6"];
    for (let ci = 0; ci < 3; ci += 1) {
      const car = new THREE.Group();
      addBox(car, 0.55, 0.26, 0.95, 0, 0.2, 0, flatMat(carColors[ci]));
      addBox(car, 0.44, 0.18, 0.5, 0, 0.4, 0, flatMat("#e2e8f0"));
      car.position.set(-1.8 + (ci % 2 === 0 ? -0.32 : 0.32), 0.06, -6 + ci * 5);
      era2.add(car);
      this.vehicles.push({ mesh: car, dir: ci % 2 === 0 ? 1 : -1, speed: 2.2 + ci * 0.45 });
    }

    // Era 3: Modern Eco-City + Wind Turbine
    const era3 = new THREE.Group();
    addBox(era3, 2.1, 4.2, 2.1, 0.4, 2.1, -7.0, wallCream);
    addBox(era3, 1.8, 3.6, 2.15, 0.4, 2.1, -7.0, glass, false);
    addBox(era3, 2.2, 3.5, 1.9, 3.5, 1.75, -3.2, wallCream);
    addBox(era3, 2.25, 2.7, 1.6, 3.5, 1.8, -3.2, glass, false);
    // Eco Wind Turbine
    addCyl(era3, 0.12, 0.18, 4.2, 8, 5.2, 2.1, 5.2, wallCream);
    const rotor = new THREE.Group();
    rotor.position.set(5.2, 4.15, 5.4);
    for (let bi = 0; bi < 3; bi += 1) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.5, 0.06), wallCream);
      const ang = (bi / 3) * Math.PI * 2;
      blade.position.set(Math.cos(ang) * 0.65, Math.sin(ang) * 0.65, 0);
      blade.rotation.z = ang - Math.PI / 2;
      rotor.add(blade);
    }
    era3.add(rotor);
    this.windSpinners.push(rotor);

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
    this.splashInstanced.frustumCulled = false;
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

  buildRainParticles() {
    const count = 110;
    const geo = new THREE.BoxGeometry(0.05, 0.55, 0.05);
    const mat = new THREE.MeshBasicMaterial({ color: "#bae6fd", transparent: true, opacity: 0.72 });
    this.rainInstanced = new THREE.InstancedMesh(geo, mat, count);
    this.rainInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.rainInstanced.visible = false;
    this.rainInstanced.frustumCulled = false;
    this.scene.add(this.rainInstanced);

    for (let i = 0; i < count; i += 1) {
      this.rainPool.push({
        x: (Math.random() - 0.5) * 32,
        y: Math.random() * 14,
        z: (Math.random() - 0.5) * 28,
        speed: 14 + Math.random() * 6
      });
    }
  }

  buildSnowParticles() {
    const count = 90;
    const geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const mat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.85 });
    this.snowInstanced = new THREE.InstancedMesh(geo, mat, count);
    this.snowInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.snowInstanced.visible = false;
    this.snowInstanced.frustumCulled = false;
    this.scene.add(this.snowInstanced);

    for (let i = 0; i < count; i += 1) {
      this.snowPool.push({
        x: (Math.random() - 0.5) * 36,
        y: Math.random() * 14,
        z: (Math.random() - 0.5) * 32,
        speed: 2.4 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  buildRiverEventModels() {
    // 1. Floating Golden Energy Crate
    const crate = new THREE.Group();
    const goldMat = flatMat("#fbbf24", 0.25, 0.4, { emissive: "#f59e0b", emissiveIntensity: 0.45 });
    const trimMat = flatMat("#0ea5e9", 0.3, 0.5, { emissive: "#38bdf8", emissiveIntensity: 0.65 });
    addBox(crate, 1.15, 0.95, 1.15, 0, 0.45, 0, goldMat);
    addBox(crate, 1.25, 0.18, 1.25, 0, 0.85, 0, trimMat, false);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const crateHit = new THREE.Mesh(new THREE.SphereGeometry(1.6, 6, 6), hitMat);
    crateHit.position.set(0, 0.5, 0);
    crate.add(crateHit);
    crate.visible = false;
    this.scene.add(crate);

    // 2. Crystal Cargo Drone
    const drone = new THREE.Group();
    const bodyMat = flatMat("#1e293b", 0.3, 0.7);
    const podMat = flatMat("#c084fc", 0.15, 0.2, { emissive: "#a855f7", emissiveIntensity: 1.1 });
    addBox(drone, 1.4, 0.35, 1.0, 0, 0, 0, bodyMat);
    const pod = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), podMat);
    pod.position.set(0, -0.55, 0);
    drone.add(pod);
    const rotors = [];
    const rotorMat = flatMat("#67e8f9", 0.2, 0.1, { emissive: "#38bdf8", emissiveIntensity: 0.9 });
    for (const [rx, rz] of [[-0.85, -0.6], [0.85, -0.6], [-0.85, 0.6], [0.85, 0.6]]) {
      const r = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.14), rotorMat);
      r.position.set(rx, 0.24, rz);
      drone.add(r);
      rotors.push(r);
    }
    const droneHit = new THREE.Mesh(new THREE.SphereGeometry(1.85, 6, 6), hitMat);
    drone.add(droneHit);
    drone.visible = false;
    this.scene.add(drone);

    this.eventPrefabs = { crate, drone, rotors };
  }

  spawnRiverEvent(forcedType = null) {
    if (this.activeEvent || !this.eventPrefabs) return null;
    const type = forcedType || (Math.random() < 0.5 ? "crate" : "drone");
    const mesh = this.eventPrefabs[type];
    mesh.visible = true;
    if (type === "crate") {
      mesh.position.set(-1.2 + (Math.random() - 0.5) * 1.4, 0.12, -8.2);
    } else {
      mesh.position.set(-12.0, 4.7, -1.0 + (Math.random() - 0.5) * 6);
    }
    this.activeEvent = { type, mesh, life: 0 };
    return type;
  }

  collectActiveEvent() {
    if (!this.activeEvent) return null;
    const { type, mesh } = this.activeEvent;
    const worldPos = mesh.position.clone();
    mesh.visible = false;
    this.activeEvent = null;
    this.nextEventInSec = 18 + Math.random() * 12;
    this.spawnSplash(worldPos.x, Math.max(0.4, worldPos.y), worldPos.z, 14);
    const projected = worldPos.project(this.camera);
    const rect = this.canvas.getBoundingClientRect();
    return {
      type,
      screenX: rect.left + ((projected.x + 1) * 0.5) * rect.width,
      screenY: rect.top + ((-projected.y + 1) * 0.5) * rect.height
    };
  }

  setZoneTheme(zoneId) {
    if (this.currentZoneId === zoneId) return;
    this.currentZoneId = zoneId;
    if (this.glacierProps) this.glacierProps.visible = zoneId === "glacier";
    if (this.cyberProps) this.cyberProps.visible = zoneId === "cyber";
    for (const tree of this.trees) {
      tree.visible = zoneId !== "cyber";
    }

    if (zoneId === "glacier") {
      this.scene.background.set("#b6e1ff");
      this.scene.fog.color.set("#cdeaff");
      if (this.skyMat) {
        this.skyMat.uniforms.uTopColor.value.set("#3b82f6");
        this.skyMat.uniforms.uHorizonColor.value.set("#e0f2fe");
      }
      if (this.cloudMat) this.cloudMat.color.set("#f8fafc");
      this.grassMat.color.set("#e2f1ff");
      this.darkGrassMat.color.set("#bae6fd");
      this.rockMat.color.set("#64748b");
      this.cliffMat.color.set("#475569");
      this.sandMat.color.set("#cbd5e1");
      this.leafMat.color.set("#0f766e");
      this.waterMat.color.set("#06b6d4");
      this.waterMat.emissive.set("#000000");
      this.waterMat.emissiveIntensity = 0;
      if (this.upperWaterMat) {
        this.upperWaterMat.color.set("#06b6d4");
        this.upperWaterMat.emissive.set("#000000");
        this.upperWaterMat.emissiveIntensity = 0;
      }
      this.sunLight.color.set("#f0f9ff");
      this.sunLight.intensity = 1.95;

      // Transform station materials into Frost & Geothermal kit
      this.stationMats.wood.color.set("#bae6fd");
      this.stationMats.metal.color.set("#475569");
      this.stationMats.concrete.color.set("#f1f5f9");
      this.stationMats.accent.color.set("#0284c7");
      this.stationMats.blade.color.set("#e0f2fe");
      this.stationMats.copper.color.set("#f97316");
      this.stationMats.glow.color.set("#7dd3fc");
      this.stationMats.glow.emissive.set("#38bdf8");
      this.stationMats.coreGlow.color.set("#e0f2fe");
      this.stationMats.coreGlow.emissive.set("#0ea5e9");
    } else if (zoneId === "cyber") {
      this.scene.background.set("#070d1f");
      this.scene.fog.color.set("#0b132b");
      if (this.skyMat) {
        this.skyMat.uniforms.uTopColor.value.set("#020617");
        this.skyMat.uniforms.uHorizonColor.value.set("#311042");
      }
      if (this.cloudMat) this.cloudMat.color.set("#38bdf8");
      this.grassMat.color.set("#1e293b");
      this.darkGrassMat.color.set("#0f172a");
      this.rockMat.color.set("#334155");
      this.cliffMat.color.set("#1e1b4b");
      this.sandMat.color.set("#312e81");
      this.leafMat.color.set("#22d3ee");
      this.waterMat.color.set("#06b6d4");
      this.waterMat.emissive.set("#0891b2");
      this.waterMat.emissiveIntensity = 0.55;
      if (this.upperWaterMat) {
        this.upperWaterMat.color.set("#06b6d4");
        this.upperWaterMat.emissive.set("#0891b2");
        this.upperWaterMat.emissiveIntensity = 0.55;
      }
      this.sunLight.color.set("#a5f3fc");
      this.sunLight.intensity = 1.35;

      // Transform station materials into Obsidian & Neon Cyber kit
      this.stationMats.wood.color.set("#1e293b");
      this.stationMats.metal.color.set("#0f172a");
      this.stationMats.concrete.color.set("#312e81");
      this.stationMats.accent.color.set("#ec4899");
      this.stationMats.blade.color.set("#22d3ee");
      this.stationMats.copper.color.set("#f472b6");
      this.stationMats.glow.color.set("#f472b6");
      this.stationMats.glow.emissive.set("#ec4899");
      this.stationMats.coreGlow.color.set("#67e8f9");
      this.stationMats.coreGlow.emissive.set("#22d3ee");
    } else {
      this.scene.background.set("#73c2fb");
      this.scene.fog.color.set("#8dd1fc");
      if (this.skyMat) {
        this.skyMat.uniforms.uTopColor.value.set("#0284c7");
        this.skyMat.uniforms.uHorizonColor.value.set("#bae6fd");
      }
      if (this.cloudMat) this.cloudMat.color.set("#ffffff");
      this.grassMat.color.set("#45a85f");
      this.darkGrassMat.color.set("#2f855a");
      this.rockMat.color.set("#64748b");
      this.cliffMat.color.set("#475569");
      this.sandMat.color.set("#d6b98c");
      this.leafMat.color.set("#15803d");
      this.waterMat.color.set("#0ea5e9");
      this.waterMat.emissive.set("#000000");
      this.waterMat.emissiveIntensity = 0;
      if (this.upperWaterMat) {
        this.upperWaterMat.color.set("#0ea5e9");
        this.upperWaterMat.emissive.set("#000000");
        this.upperWaterMat.emissiveIntensity = 0;
      }
      this.sunLight.color.set("#fff6df");
      this.sunLight.intensity = 1.85;

      // Classic Valley oak & brass hydro kit
      this.stationMats.wood.color.set("#8b4513");
      this.stationMats.metal.color.set("#475569");
      this.stationMats.concrete.color.set("#cbd5e1");
      this.stationMats.accent.color.set("#0284c7");
      this.stationMats.blade.color.set("#38bdf8");
      this.stationMats.copper.color.set("#d97706");
      this.stationMats.glow.color.set("#38bdf8");
      this.stationMats.glow.emissive.set("#0ea5e9");
      this.stationMats.coreGlow.color.set("#67e8f9");
      this.stationMats.coreGlow.emissive.set("#22d3ee");
    }
    this.invalidateShadows();
  }

  setPanEnabled(enabled) {
    this.panEnabled = Boolean(enabled);
  }

  setCameraPreset(index) {
    const safeIdx = Math.max(0, Math.min(CAMERA_PRESETS.length - 1, index));
    this.presetIndex = safeIdx;
    const preset = CAMERA_PRESETS[safeIdx];
    this.panOffset.set(0, 0, 0);
    this.desiredZoomScale = 1.0;
    this.updateDesiredCamera();
    return preset.name;
  }

  updateDesiredCamera() {
    const preset = CAMERA_PRESETS[this.presetIndex];
    this._tmpA.copy(preset.target).add(this.panOffset);
    let scale = this.desiredZoomScale;
    if (this.isPortrait && this.presetIndex === 0) {
      this._tmpA.set(-0.2 + this.panOffset.x, 0.85, 2.4 + this.panOffset.z);
      scale *= 1.06;
    }
    this._tmpB.copy(preset.pos).sub(preset.target).multiplyScalar(scale);
    this.desiredTarget.copy(this._tmpA);
    this.desiredCameraPos.copy(this._tmpA).add(this._tmpB);
  }

  panByDelta(dxWorld, dzWorld) {
    this.panOffset.x = THREE.MathUtils.clamp(this.panOffset.x + dxWorld, -13, 15);
    this.panOffset.z = THREE.MathUtils.clamp(this.panOffset.z + dzWorld, -15, 14);
    this.updateDesiredCamera();
  }

  triggerStationPulse(stationId) {
    const node = this.stationNodes[stationId];
    if (node) {
      node.pulseBoost = 1.0;
    }
  }

  triggerShake(intensity = 0.25) {
    this.shakeAmount = Math.max(this.shakeAmount, intensity);
  }

  getStationScreenPosition(stationId) {
    const node = this.stationNodes[stationId];
    if (!node) return null;
    this._tmpA.copy(node.slot.position);
    this._tmpA.y += 2.3;
    const projected = this._tmpA.project(this.camera);
    if (projected.z > 1) return null;
    const rect = this._canvasRect || this.canvas.getBoundingClientRect();
    return {
      x: rect.left + ((projected.x + 1) * 0.5) * rect.width,
      y: rect.top + ((-projected.y + 1) * 0.5) * rect.height
    };
  }

  bindInput() {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let activePointerId = null;
    let movedDist = 0;
    let lastX = 0;
    let lastY = 0;

    const resetPointer = () => {
      activePointerId = null;
    };

    const onDown = (e) => {
      if (activePointerId !== null && activePointerId !== e.pointerId) return;
      activePointerId = e.pointerId;
      movedDist = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      this.canvas.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
      if (activePointerId !== e.pointerId || !this.panEnabled) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      movedDist += Math.hypot(dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;

      const stepX = (-dx * 0.035) - (dy * 0.02);
      const stepZ = (-dy * 0.035) + (dx * 0.02);
      this.panByDelta(stepX, stepZ);
    };

    const onUp = (e) => {
      if (activePointerId !== e.pointerId) return;
      activePointerId = null;
      if (movedDist < 10 || !this.panEnabled) {
        const rect = this.canvas.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, this.camera);

        if (this.activeEvent) {
          const evHit = raycaster.intersectObject(this.activeEvent.mesh, true);
          if (evHit.length > 0 && this.onTapEvent) {
            const collected = this.collectActiveEvent();
            if (collected) this.onTapEvent(collected);
            return;
          }
        }

        const hit = raycaster.intersectObject(this.riverMesh);
        if (hit.length > 0) {
          this.spawnSplash(hit[0].point.x, hit[0].point.y + 0.2, hit[0].point.z, 10);
        } else {
          let hitStation = false;
          for (const [sid, node] of Object.entries(this.stationNodes)) {
            if (node.model.visible && raycaster.intersectObject(node.model, true).length > 0) {
              this.triggerStationPulse(sid);
              this.spawnSplash(node.slot.position.x, node.slot.position.y + 1.0, node.slot.position.z, 10);
              hitStation = true;
              break;
            }
          }
          if (!hitStation) {
            this.spawnSplash(-1.2, 0.5, 2.0, 6);
          }
        }
        if (this.onTapWorld) {
          this.onTapWorld(e.clientX, e.clientY);
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const unitScale = e.deltaMode === 1 ? 24 : e.deltaMode === 2 ? 120 : 1;
      this.desiredZoomScale = THREE.MathUtils.clamp(
        this.desiredZoomScale + e.deltaY * unitScale * 0.0008,
        0.6,
        1.55
      );
      this.updateDesiredCamera();
    };

    const onKeyDown = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      this.keysHeld.add(e.code);
    };
    const onKeyUp = (e) => this.keysHeld.delete(e.code);
    const onBlur = () => {
      this.keysHeld.clear();
      resetPointer();
    };
    const onContextLost = (e) => e.preventDefault();

    this.canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", resetPointer);
    this.canvas.addEventListener("wheel", onWheel, { passive: false });
    this.canvas.addEventListener("webglcontextlost", onContextLost);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    this._cleanupInput = () => {
      this.canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", resetPointer);
      this.canvas.removeEventListener("wheel", onWheel);
      this.canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }

  dispose() {
    this._cleanupInput?.();
    this.renderer?.dispose();
  }

  resize() {
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;
    if (width <= 0 || height <= 0) return;
    const aspect = width / height;
    const nextPortrait = aspect < 0.85;
    this.camera.fov = nextPortrait ? 52 : 42;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this._canvasRect = this.canvas.getBoundingClientRect();
    if (nextPortrait !== this.isPortrait) {
      this.isPortrait = nextPortrait;
      this.updateDesiredCamera();
    }
  }

  render(state) {
    const dt = Math.min(0.05, this.clock.getDelta());
    const t = this.clock.elapsedTime;

    this.setZoneTheme(state.activeZoneId || "valley");

    const { totalWatts, overdriveMult } = getTotals(state);
    const rainSpeed = (state.boosters?.rain_2x || 0) > 0 ? 1.55 : 1;
    const flowSpeed = (1 + (state.upgrades.u0 || 0) * 0.14) * overdriveMult * rainSpeed;

    // Keyboard WASD / Arrow camera pan
    let kx = 0;
    let kz = 0;
    if (this.keysHeld.has("KeyW") || this.keysHeld.has("ArrowUp")) kz -= 1;
    if (this.keysHeld.has("KeyS") || this.keysHeld.has("ArrowDown")) kz += 1;
    if (this.keysHeld.has("KeyA") || this.keysHeld.has("ArrowLeft")) kx -= 1;
    if (this.keysHeld.has("KeyD") || this.keysHeld.has("ArrowRight")) kx += 1;
    if (kx !== 0 || kz !== 0) {
      const speed = 14 * dt;
      this.panByDelta((kx * 0.72 + kz * 0.68) * speed, (kz * 0.72 - kx * 0.68) * speed);
    }

    // Smooth dt-independent preset camera transition + micro-shake
    const camAlpha = 1 - Math.exp(-7.5 * dt);
    this.cameraPos.lerp(this.desiredCameraPos, camAlpha);
    this.targetOffset.lerp(this.desiredTarget, camAlpha);
    this.camera.position.copy(this.cameraPos);
    if (this.shakeAmount > 0.005) {
      this.camera.position.x += (Math.random() - 0.5) * this.shakeAmount;
      this.camera.position.y += (Math.random() - 0.5) * this.shakeAmount;
      this.shakeAmount *= Math.exp(-10.0 * dt);
    } else {
      this.shakeAmount = 0;
    }
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

    // Waterfall splash (dt-normalized)
    if (Math.random() < Math.min(0.95, 16 * dt * Math.min(2.5, flowSpeed))) {
      this.spawnSplash(-1.2, 0.15, -8.6, 2);
    }

    // Update stations + invalidate baked shadow cache on unlock changes
    let unlockedMask = "";
    for (const def of getZoneStations(state.activeZoneId)) {
      const st = state.stations[def.id];
      const node = this.stationNodes[def.id];
      if (!node || !st) continue;
      unlockedMask += st.unlocked ? "1" : "0";

      if (st.unlocked) {
        node.pad.visible = false;
        node.model.visible = true;
        if (node.tiers) {
          node.tiers.tier10.visible = st.level >= 10;
          node.tiers.tier25.visible = st.level >= 25;
          node.tiers.tier50.visible = st.level >= 50;
        }
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
          if (Math.random() < Math.min(0.6, 4.5 * dt * overdriveMult)) {
            this.spawnSplash(node.slot.position.x, node.slot.position.y + 0.25, node.slot.position.z, 1);
          }
        }
      } else {
        node.pad.visible = true;
        node.model.visible = false;
        node.scaleAnim = 0.01;
      }
    }
    if (unlockedMask !== this._prevUnlockedMask) {
      this._prevUnlockedMask = unlockedMask;
      this.invalidateShadows();
    }

    // Update City Eras
    this.activeEra = getCityEraIndex(state, totalWatts);
    if (this.activeEra !== this._prevEraDrawn) {
      this._prevEraDrawn = this.activeEra;
      this.invalidateShadows();
    }
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

    // Update splash particles (compacted count)
    let activeSplashes = 0;
    for (let i = 0; i < this.splashPool.length; i += 1) {
      const p = this.splashPool[i];
      if (!p.active) continue;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
      } else {
        p.vel.y -= 9.5 * dt;
        p.pos.addScaledVector(p.vel, dt);
        const fade = 1 - p.life / p.maxLife;
        this.dummy.position.copy(p.pos);
        this.dummy.scale.setScalar(fade);
        this.dummy.updateMatrix();
        this.splashInstanced.setMatrixAt(activeSplashes, this.dummy.matrix);
        activeSplashes += 1;
      }
    }
    this.splashInstanced.count = activeSplashes;
    if (activeSplashes > 0) {
      this.splashInstanced.instanceMatrix.needsUpdate = true;
    }

    // Rainstorm booster FX
    const raining = (state.boosters?.rain_2x || 0) > 0;
    this.rainInstanced.visible = raining;
    if (raining) {
      for (let i = 0; i < this.rainPool.length; i += 1) {
        const r = this.rainPool[i];
        r.y -= r.speed * dt;
        if (r.y < 0) {
          r.y = 14;
          r.x = (Math.random() - 0.5) * 32;
          r.z = (Math.random() - 0.5) * 28;
        }
        this.dummy.position.set(r.x, r.y, r.z);
        this.dummy.scale.setScalar(1);
        this.dummy.updateMatrix();
        this.rainInstanced.setMatrixAt(i, this.dummy.matrix);
      }
      this.rainInstanced.instanceMatrix.needsUpdate = true;
    }

    // Snowfall in Glacier biome & rotating rings in Cyber biome
    const snowing = state.activeZoneId === "glacier";
    this.snowInstanced.visible = snowing;
    if (snowing) {
      for (let i = 0; i < this.snowPool.length; i += 1) {
        const s = this.snowPool[i];
        s.y -= s.speed * dt;
        s.x += Math.sin(t + s.phase) * 0.5 * dt;
        if (s.y < 0) {
          s.y = 14;
          s.x = (Math.random() - 0.5) * 36;
          s.z = (Math.random() - 0.5) * 32;
        }
        this.dummy.position.set(s.x, s.y, s.z);
        this.dummy.scale.setScalar(1);
        this.dummy.updateMatrix();
        this.snowInstanced.setMatrixAt(i, this.dummy.matrix);
      }
      this.snowInstanced.instanceMatrix.needsUpdate = true;
    }
    if (state.activeZoneId === "cyber") {
      for (const ring of this.cyberRings) {
        ring.rotation.z += dt * 0.9;
      }
    }
    if (this.activeEra >= 2) {
      for (const v of this.vehicles) {
        v.mesh.position.z += v.dir * v.speed * dt;
        if (v.mesh.position.z > 8.2) v.mesh.position.z = -8.2;
        if (v.mesh.position.z < -8.2) v.mesh.position.z = 8.2;
      }
    }
    if (this.activeEra >= 3) {
      for (const rotor of this.windSpinners) {
        rotor.rotation.z += dt * 1.8;
      }
    }
    for (const c of this.clouds) {
      c.grp.position.x += c.speed * dt;
      if (c.grp.position.x > 34) c.grp.position.x = -34;
    }
    for (const b of this.dockBuoys) {
      if (b.mesh.parent?.visible) {
        b.mesh.position.y = b.baseY + Math.sin(t * 2.8 + b.phase) * 0.08;
        b.mesh.rotation.y += dt * 1.1;
      }
    }
    for (const ring of this.haloRings) {
      if (ring.parent?.visible) {
        ring.rotation.z += dt * 1.6;
      }
    }

    // Active 3D River / Drone Events
    if (this.activeEvent) {
      this.activeEvent.life += dt;
      if (this.activeEvent.type === "crate") {
        this.activeEvent.mesh.position.z += dt * 1.35 * Math.min(2.0, flowSpeed);
        this.activeEvent.mesh.position.y = 0.14 + Math.sin(t * 4.0) * 0.08;
        this.activeEvent.mesh.rotation.y += dt * 0.9;
        if (this.activeEvent.mesh.position.z > 14.5) {
          this.activeEvent.mesh.visible = false;
          this.activeEvent = null;
          this.nextEventInSec = 16 + Math.random() * 10;
        }
      } else {
        this.activeEvent.mesh.position.x += dt * 2.2;
        this.activeEvent.mesh.position.y = 4.6 + Math.sin(t * 3.2) * 0.25;
        for (const r of this.eventPrefabs.rotors) r.rotation.y += dt * 18;
        if (this.activeEvent.mesh.position.x > 16.0) {
          this.activeEvent.mesh.visible = false;
          this.activeEvent = null;
          this.nextEventInSec = 16 + Math.random() * 10;
        }
      }
    } else {
      this.nextEventInSec -= dt;
      if (this.nextEventInSec <= 0) {
        this.spawnRiverEvent();
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
