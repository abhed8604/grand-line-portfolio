import * as THREE from "three";
import {
  MAX_POINTS,
  MIN_POINTS,
  QUALITY_TIERS,
  SIM_HEIGHT,
  SIM_WIDTH,
  type QualityName,
  type QualityTier,
} from "./constants";
import {
  idleDrift,
  pushRadius,
  pushStrength,
  returnSpeed,
  rippleLifetime,
  rippleStrength,
} from "./motion";
import {
  ledFragmentShader,
  ledVertexShader,
  simPositionShader,
  simVelocityShader,
  simVertexShader,
} from "./shaders";
import type { TargetCloud } from "../targets/target-factory";

export interface EngineStats {
  fps: number;
  points: number;
  quality: QualityName;
  label: string;
}

export interface EngineOptions {
  quality: QualityName;
  reducedMotion?: boolean;
}

interface SimUniforms {
  [key: string]: THREE.IUniform;
  uPositions: THREE.IUniform<THREE.Texture>;
  uVelocities: THREE.IUniform<THREE.Texture>;
  uTargets: THREE.IUniform<THREE.Texture>;
  uSimSize: THREE.IUniform<THREE.Vector2>;
  uTime: THREE.IUniform<number>;
  uDelta: THREE.IUniform<number>;
  uTargetTime: THREE.IUniform<number>;
  uSwarm: THREE.IUniform<number>;
  uIdleDrift: THREE.IUniform<number>;
  uAttraction: THREE.IUniform<number>;
  uDamping: THREE.IUniform<number>;
  uReturnSpeed: THREE.IUniform<number>;
  uReducedMotion: THREE.IUniform<number>;
  uBurstTime: THREE.IUniform<number>;
  uBurstStrength: THREE.IUniform<number>;
  uBurstOrigin: THREE.IUniform<THREE.Vector2>;
  uSurgeTime: THREE.IUniform<number>;
  uSurgeStrength: THREE.IUniform<number>;
  uPointer: THREE.IUniform<THREE.Vector2>;
  uPointerActive: THREE.IUniform<number>;
  uPointerVelocity: THREE.IUniform<THREE.Vector2>;
  uPushRadius: THREE.IUniform<number>;
  uPushStrength: THREE.IUniform<number>;
  uRipples: THREE.IUniform<THREE.Vector2[]>;
  uRippleStarts: THREE.IUniform<number[]>;
  uRippleStrengths: THREE.IUniform<number[]>;
  uRippleStrength: THREE.IUniform<number>;
  uRippleLifetime: THREE.IUniform<number>;
}

interface PositionUniforms {
  [key: string]: THREE.IUniform;
  uPositions: THREE.IUniform<THREE.Texture>;
  uVelocities: THREE.IUniform<THREE.Texture>;
  uSimSize: THREE.IUniform<THREE.Vector2>;
  uDelta: THREE.IUniform<number>;
}

function createDataTexture(data: Float32Array, width: number, height: number): THREE.DataTexture {
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function createRenderTarget(): THREE.WebGLRenderTarget {
  return new THREE.WebGLRenderTarget(SIM_WIDTH, SIM_HEIGHT, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    depthBuffer: false,
    stencilBuffer: false,
    generateMipmaps: false,
  });
}

function random(seed: number): number {
  let value = seed >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return (value >>> 0) / 4294967296;
}

class GpuSimulation {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  readonly velocityMaterial: THREE.RawShaderMaterial;
  readonly positionMaterial: THREE.RawShaderMaterial;
  readonly velocityUniforms: SimUniforms;
  readonly positionUniforms: PositionUniforms;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly plane: THREE.Mesh;
  private readonly velocityTargets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private readonly positionTargets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private readonly seedPosition: THREE.DataTexture;
  private readonly seedVelocity: THREE.DataTexture;
  private velocityIndex = 0;
  private positionIndex = 0;
  private firstPass = true;
  private activeRows: number;
  targetTexture: THREE.DataTexture;
  private time = 0;
  private targetTime = 0;
  private burstTime = -100;
  private burstOrigin = new THREE.Vector2();
  private burstStrength = 0;
  private surgeTime = -100;
  private surgeStrength = 0;
  private reducedMotion = false;
  private pointerActive = 0;
  private pointer = new THREE.Vector2(99999, 99999);
  private pointerVelocity = new THREE.Vector2();
  private readonly rippleOrigins: THREE.Vector2[] = [];
  private readonly rippleStarts: number[] = [];
  private readonly rippleStrengths: number[] = [];
  private rippleIndex = 0;

  constructor(
    renderer: THREE.WebGLRenderer,
    plane: THREE.Mesh,
    width: number,
    height: number,
    tier: QualityTier,
  ) {
    this.renderer = renderer;
    this.plane = plane;
    this.activeRows = tier.rows;

    const initialPosition = new Float32Array(MAX_POINTS * 4);
    const initialVelocity = new Float32Array(MAX_POINTS * 4);
    const initialTarget = new Float32Array(MAX_POINTS * 4);
    for (let i = 0; i < MAX_POINTS; i += 1) {
      const px = (random(0xabc000 + i * 37) - 0.5) * width * 1.2;
      const py = (random(0xdef000 + i * 53) - 0.5) * height * 1.2;
      const pz = (random(0x123000 + i * 71) - 0.5) * 90;
      initialPosition[i * 4] = px;
      initialPosition[i * 4 + 1] = py;
      initialPosition[i * 4 + 2] = pz;
      initialPosition[i * 4 + 3] = 1;
      initialVelocity[i * 4] = (random(i * 89 + 1) - 0.5) * 18;
      initialVelocity[i * 4 + 1] = (random(i * 113 + 2) - 0.5) * 18;
      initialVelocity[i * 4 + 2] = (random(i * 157 + 3) - 0.5) * 5;
      initialVelocity[i * 4 + 3] = 1;
      initialTarget[i * 4] = px;
      initialTarget[i * 4 + 1] = py;
      initialTarget[i * 4 + 2] = pz;
      initialTarget[i * 4 + 3] = 1;
    }

    this.seedPosition = createDataTexture(initialPosition, SIM_WIDTH, SIM_HEIGHT);
    this.seedVelocity = createDataTexture(initialVelocity, SIM_WIDTH, SIM_HEIGHT);
    this.targetTexture = createDataTexture(initialTarget, SIM_WIDTH, SIM_HEIGHT);

    this.velocityTargets = [createRenderTarget(), createRenderTarget()];
    this.positionTargets = [createRenderTarget(), createRenderTarget()];

    for (let i = 0; i < 6; i += 1) {
      this.rippleOrigins.push(new THREE.Vector2(99999, 99999));
      this.rippleStarts.push(-100);
      this.rippleStrengths.push(0);
    }

    this.velocityUniforms = {
      uPositions: { value: this.seedPosition },
      uVelocities: { value: this.seedVelocity },
      uTargets: { value: this.targetTexture },
      uSimSize: { value: new THREE.Vector2(SIM_WIDTH, SIM_HEIGHT) },
      uTime: { value: 0 },
      uDelta: { value: 1 / 60 },
      uTargetTime: { value: 0 },
      uSwarm: { value: 0 },
      uIdleDrift: { value: idleDrift },
      uAttraction: { value: 27 },
      uDamping: { value: 6.6 },
      uReturnSpeed: { value: returnSpeed },
      uReducedMotion: { value: 0 },
      uBurstTime: { value: -100 },
      uBurstStrength: { value: 0 },
      uBurstOrigin: { value: new THREE.Vector2() },
      uSurgeTime: { value: -100 },
      uSurgeStrength: { value: 0 },
      uPointer: { value: this.pointer },
      uPointerActive: { value: 0 },
      uPointerVelocity: { value: this.pointerVelocity },
      uPushRadius: { value: pushRadius },
      uPushStrength: { value: pushStrength },
      uRipples: { value: this.rippleOrigins },
      uRippleStarts: { value: this.rippleStarts },
      uRippleStrengths: { value: this.rippleStrengths },
      uRippleStrength: { value: rippleStrength },
      uRippleLifetime: { value: rippleLifetime },
    };

    this.positionUniforms = {
      uPositions: { value: this.seedPosition },
      uVelocities: { value: this.seedVelocity },
      uSimSize: { value: new THREE.Vector2(SIM_WIDTH, SIM_HEIGHT) },
      uDelta: { value: 1 / 60 },
    };

    this.velocityMaterial = new THREE.RawShaderMaterial({
      vertexShader: simVertexShader,
      fragmentShader: simVelocityShader,
      uniforms: this.velocityUniforms,
      depthTest: false,
      depthWrite: false,
    });
    this.positionMaterial = new THREE.RawShaderMaterial({
      vertexShader: simVertexShader,
      fragmentShader: simPositionShader,
      uniforms: this.positionUniforms,
      depthTest: false,
      depthWrite: false,
    });

    // One full-screen plane is shared by both passes; each pass swaps material.
    plane.material = this.velocityMaterial;
    this.velocityMaterial.needsUpdate = true;
    this.scene.add(plane);
  }

  setActiveRows(rows: number): void {
    this.activeRows = rows;
  }

  setTarget(texture: THREE.DataTexture): void {
    const previous = this.targetTexture;
    this.targetTexture = texture;
    this.velocityUniforms.uTargets.value = texture;
    this.targetTime = this.time;
    this.velocityUniforms.uTargetTime.value = this.targetTime;
    previous.dispose();
  }

  /** Reduced-motion path: place every LED on the new artwork immediately. */
  snapTo(texture: THREE.DataTexture, data: Float32Array): void {
    const image = this.seedPosition.image as { data: Float32Array };
    const target = image.data;
    for (let i = 0; i < MAX_POINTS; i += 1) {
      target[i * 4] = data[i * 4];
      target[i * 4 + 1] = data[i * 4 + 1];
      target[i * 4 + 2] = data[i * 4 + 2];
      target[i * 4 + 3] = 1;
    }
    this.seedPosition.needsUpdate = true;
    this.setTarget(texture);
    this.firstPass = true;
    this.velocityIndex = 0;
    this.positionIndex = 0;
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
    this.velocityUniforms.uReducedMotion.value = reduced ? 1 : 0;
    this.velocityUniforms.uIdleDrift.value = reduced ? idleDrift * 0.2 : idleDrift;
    this.velocityUniforms.uAttraction.value = reduced ? 46 : 27;
  }

  burst(x: number, y: number, strength = 4200): void {
    this.burstTime = this.time;
    this.burstOrigin.set(x, y);
    this.burstStrength = strength;
    this.velocityUniforms.uBurstTime.value = this.burstTime;
    this.velocityUniforms.uBurstOrigin.value.set(x, y);
    this.velocityUniforms.uBurstStrength.value = strength;
  }

  surge(strength = 540): void {
    this.surgeTime = this.time;
    this.surgeStrength = strength;
    this.velocityUniforms.uSurgeTime.value = this.surgeTime;
    this.velocityUniforms.uSurgeStrength.value = strength;
  }

  setPointer(x: number, y: number, active: boolean, velocityX = 0, velocityY = 0): void {
    this.pointer.set(x, y);
    this.pointerActive = active ? 1 : 0;
    if (!active) {
      this.pointerVelocity.set(0, 0);
      return;
    }
    this.pointerVelocity.set(
      Math.max(-3600, Math.min(3600, velocityX)),
      Math.max(-3600, Math.min(3600, velocityY)),
    );
  }

  clearPointer(): void {
    this.pointerActive = 0;
    this.pointerVelocity.set(0, 0);
  }

  addRipple(x: number, y: number, strength = 1): void {
    this.rippleOrigins[this.rippleIndex].set(x, y);
    this.rippleStarts[this.rippleIndex] = this.time;
    this.rippleStrengths[this.rippleIndex] = strength;
    this.rippleIndex = (this.rippleIndex + 1) % this.rippleOrigins.length;
  }

  update(dt: number): void {
    this.time += dt;
    const u = this.velocityUniforms;
    u.uTime.value = this.time;
    u.uDelta.value = dt;
    u.uSwarm.value = this.reducedMotion ? 0 : 165;
    u.uTargetTime.value = this.targetTime;
    u.uBurstTime.value = this.burstTime;
    u.uBurstStrength.value = this.burstStrength;
    u.uSurgeTime.value = this.surgeTime;
    u.uSurgeStrength.value = this.surgeStrength;
    u.uPointerActive.value = this.pointerActive;
    this.pointerVelocity.multiplyScalar(0.86);

    const positionTexture = this.firstPass
      ? this.seedPosition
      : this.positionTargets[this.positionIndex].texture;
    const velocityTexture = this.firstPass
      ? this.seedVelocity
      : this.velocityTargets[this.velocityIndex].texture;

    const writeVelocity = 1 - this.velocityIndex;
    u.uPositions.value = positionTexture;
    u.uVelocities.value = velocityTexture;

    const renderer = this.renderer;
    renderer.setRenderTarget(this.velocityTargets[writeVelocity]);
    renderer.setViewport(0, 0, SIM_WIDTH, this.activeRows);
    renderer.render(this.scene, this.camera);

    const writePosition = 1 - this.positionIndex;
    const pu = this.positionUniforms;
    pu.uPositions.value = positionTexture;
    pu.uVelocities.value = this.velocityTargets[writeVelocity].texture;
    pu.uDelta.value = dt;
    renderer.setRenderTarget(this.positionTargets[writePosition]);
    renderer.setViewport(0, 0, SIM_WIDTH, this.activeRows);

    this.plane.material = this.positionMaterial;
    renderer.render(this.scene, this.camera);
    this.plane.material = this.velocityMaterial;

    this.velocityIndex = writeVelocity;
    this.positionIndex = writePosition;
    this.firstPass = false;
  }

  get positionTexture(): THREE.Texture {
    return this.firstPass
      ? this.seedPosition
      : this.positionTargets[this.positionIndex].texture;
  }

  dispose(): void {
    this.seedPosition.dispose();
    this.seedVelocity.dispose();
    this.targetTexture.dispose();
    for (const target of this.velocityTargets) target.dispose();
    for (const target of this.positionTargets) target.dispose();
    this.velocityMaterial.dispose();
    this.positionMaterial.dispose();
  }
}

export class LEDEngine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.OrthographicCamera;

  private readonly canvas: HTMLCanvasElement;
  private readonly planeGeometry: THREE.BufferGeometry;
  private readonly simPlane: THREE.Mesh;
  private readonly sim: GpuSimulation;
  private readonly points: THREE.Points;
  private readonly pointsMaterial: THREE.RawShaderMaterial;
  private tier: QualityTier;
  private width = window.innerWidth;
  private height = window.innerHeight;
  private raf = 0;
  private lastFrame = 0;
  private elapsed = 0;
  private frames = 0;
  private statsElapsed = 0;
  private activePointCount: number;
  private qualityElapsed = 0;
  private qualityFrameSum = 0;
  private qualityFrames = 0;
  private visibilityObserver?: IntersectionObserver;
  private suspended = new Set<string>();
  private destroyed = false;
  private reducedMotion = false;
  private autoQualityEnabled = false;
  private forcedTier = false;
  private readonly onStats?: (stats: EngineStats) => void;
  private readonly onQuality?: (stats: EngineStats) => void;
  private lastPointerAt = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;

  constructor(
    canvas: HTMLCanvasElement,
    options: EngineOptions,
    callbacks: {
      onStats?: (stats: EngineStats) => void;
      onQuality?: (stats: EngineStats) => void;
    } = {},
  ) {
    this.canvas = canvas;
    this.tier = QUALITY_TIERS[options.quality];
    this.activePointCount = this.tier.points;
    this.reducedMotion = Boolean(options.reducedMotion);
    this.forcedTier = Boolean(new URLSearchParams(window.location.search).get("tier"));
    this.onStats = callbacks.onStats;
    this.onQuality = callbacks.onQuality;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      stencil: false,
      depth: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    if (!this.renderer.capabilities.isWebGL2) {
      throw new Error("WebGL 2 is required for the LED engine.");
    }
    if (!this.renderer.extensions.has("EXT_color_buffer_float")) {
      throw new Error("Float render targets are unavailable on this device.");
    }

    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.tier.dpr));
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.OrthographicCamera(
      -this.width / 2,
      this.width / 2,
      this.height / 2,
      -this.height / 2,
      0.1,
      1000,
    );
    this.camera.position.z = 100;

    this.simPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.sim = new GpuSimulation(
      this.renderer,
      this.simPlane,
      this.width,
      this.height,
      this.tier,
    );
    this.sim.setActiveRows(this.tier.rows);
    this.sim.setReducedMotion(this.reducedMotion);

    const refs = new Float32Array(MAX_POINTS * 3);
    for (let i = 0; i < MAX_POINTS; i += 1) {
      refs[i * 3] = ((i % SIM_WIDTH) + 0.5) / SIM_WIDTH;
      refs[i * 3 + 1] = (Math.floor(i / SIM_WIDTH) + 0.5) / SIM_HEIGHT;
      refs[i * 3 + 2] = ((i * 2654435761) >>> 0) / 4294967296;
    }
    this.planeGeometry = new THREE.BufferGeometry();
    this.planeGeometry.setAttribute("position", new THREE.BufferAttribute(refs, 3));
    this.planeGeometry.setDrawRange(0, this.activePointCount);

    this.pointsMaterial = new THREE.RawShaderMaterial({
      vertexShader: ledVertexShader,
      fragmentShader: ledFragmentShader,
      uniforms: {
        uPositions: { value: this.sim.positionTexture },
        uTargets: { value: this.sim.targetTexture },
        uPointer: { value: new THREE.Vector2(99999, 99999) },
        uPointerActive: { value: 0 },
        uTime: { value: 0 },
        uDPR: { value: this.renderer.getPixelRatio() },
        uPixelBoost: { value: this.tier.name === "low" || this.tier.name === "lite" ? 1.4 : 1 },
        uIdleDrift: { value: idleDrift },
        uPushRadius: { value: pushRadius },
        uReducedMotion: { value: this.reducedMotion ? 1 : 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.planeGeometry, this.pointsMaterial);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.lastFrame = performance.now();
    document.addEventListener("visibilitychange", this.handleVisibility);
    this.renderFrame = this.renderFrame.bind(this);
    this.startLoop();
  }

  private handleVisibility = (): void => {
    if (document.hidden) {
      this.hold("hidden");
    } else {
      this.release("hidden");
    }
  };

  /** Stop rendering when the chapter stage scrolls out of view. */
  observeVisibility(element: Element | null): void {
    this.visibilityObserver?.disconnect();
    if (!element || typeof IntersectionObserver === "undefined") return;
    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible) this.release("offscreen");
        else this.hold("offscreen");
      },
      { threshold: 0.01 },
    );
    this.visibilityObserver.observe(element);
  }

  private startLoop(): void {
    if (this.raf || this.destroyed) return;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.renderFrame);
  }

  private stopLoop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private hold(reason: string): void {
    this.suspended.add(reason);
    if (this.suspended.size > 0) this.stopLoop();
  }

  private release(reason: string): void {
    this.suspended.delete(reason);
    if (this.suspended.size === 0 && !document.hidden) {
      this.lastFrame = performance.now();
      this.startLoop();
    }
  }

  pause(reason = "external"): void {
    this.hold(reason);
  }

  resume(reason = "external"): void {
    this.release(reason);
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
    this.sim.setReducedMotion(reduced);
    this.pointsMaterial.uniforms.uReducedMotion.value = reduced ? 1 : 0;
  }

  enableAutoQuality(): void {
    this.autoQualityEnabled = true;
  }

  morphTo(cloud: TargetCloud): void {
    const texture = createDataTexture(cloud.data, SIM_WIDTH, SIM_HEIGHT);
    if (this.reducedMotion) {
      this.sim.snapTo(texture, cloud.data);
    } else {
      this.sim.setTarget(texture);
    }
    this.sim.setActiveRows(Math.max(1, this.activePointCount / SIM_WIDTH));
    const uniforms = this.pointsMaterial.uniforms;
    uniforms.uPositions.value = this.sim.positionTexture;
    uniforms.uTargets.value = texture;
  }

  setQuality(name: QualityName): EngineStats {
    this.tier = QUALITY_TIERS[name];
    // The point budget only steps down for the life of the session, even if a
    // higher tier is requested later.
    this.activePointCount = Math.min(this.tier.points, this.activePointCount);
    this.sim.setActiveRows(Math.max(1, this.activePointCount / SIM_WIDTH));
    this.planeGeometry.setDrawRange(0, this.activePointCount);
    this.pointsMaterial.uniforms.uPixelBoost.value =
      name === "low" || name === "lite" ? 1.4 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.tier.dpr));
    this.renderer.setSize(this.width, this.height, false);
    this.pointsMaterial.uniforms.uDPR.value = this.renderer.getPixelRatio();
    const stats = this.currentStats(0);
    this.onQuality?.(stats);
    return stats;
  }

  /** Step the point budget down without ever stepping back up this session. */
  private reducePoints(factor = 0.7): void {
    const next = Math.max(
      MIN_POINTS,
      Math.floor((this.activePointCount * factor) / SIM_WIDTH) * SIM_WIDTH,
    );
    if (next >= this.activePointCount) return;
    this.activePointCount = next;
    const rows = Math.max(1, next / SIM_WIDTH);
    this.sim.setActiveRows(rows);
    this.planeGeometry.setDrawRange(0, next);
    const stats = this.currentStats(0);
    this.onQuality?.(stats);
  }

  private currentStats(fps: number): EngineStats {
    return {
      fps: Math.round(fps),
      points: this.activePointCount,
      quality: this.tier.name,
      label: this.tier.label,
    };
  }

  resize(width: number, height: number): void {
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.tier.dpr));
    this.renderer.setSize(width, height, false);
    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = -height / 2;
    this.camera.updateProjectionMatrix();
    this.pointsMaterial.uniforms.uDPR.value = this.renderer.getPixelRatio();
  }

  setPointer(clientX: number, clientY: number, active = true): void {
    const rect = this.canvas.getBoundingClientRect();
    const u = this.pointsMaterial.uniforms;
    if (!active) {
      u.uPointerActive.value = 0;
      this.sim.clearPointer();
      return;
    }
    const x = ((clientX - rect.left) / Math.max(1, rect.width)) * this.width - this.width / 2;
    const y = this.height / 2 - ((clientY - rect.top) / Math.max(1, rect.height)) * this.height;
    (u.uPointer.value as THREE.Vector2).set(x, y);
    u.uPointerActive.value = 1;

    const now = performance.now();
    const elapsed = Math.max(8, now - this.lastPointerAt) / 1000;
    const velocityX = this.lastPointerAt === 0 ? 0 : (x - this.lastPointerX) / elapsed;
    const velocityY = this.lastPointerAt === 0 ? 0 : (y - this.lastPointerY) / elapsed;
    this.lastPointerAt = now;
    this.lastPointerX = x;
    this.lastPointerY = y;
    this.sim.setPointer(x, y, true, velocityX, velocityY);
  }

  clearPointer(): void {
    this.pointsMaterial.uniforms.uPointerActive.value = 0;
    this.sim.clearPointer();
    this.lastPointerAt = 0;
  }

  addRipple(clientX: number, clientY: number, strength = 1): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / Math.max(1, rect.width)) * this.width - this.width / 2;
    const y = this.height / 2 - ((clientY - rect.top) / Math.max(1, rect.height)) * this.height;
    this.sim.addRipple(x, y, strength);
  }

  burstAtScreen(clientX: number, clientY: number, strength = 4200): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / Math.max(1, rect.width)) * this.width - this.width / 2;
    const y = this.height / 2 - ((clientY - rect.top) / Math.max(1, rect.height)) * this.height;
    this.sim.burst(x, y, strength);
  }

  surge(strength = 520): void {
    this.sim.surge(strength);
  }

  private renderFrame(now: number): void {
    this.raf = 0;
    if (this.destroyed || this.suspended.size > 0 || document.hidden) return;
    const rawDelta = Math.max(0, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    const dt = Math.min(1 / 30, Math.max(1 / 240, rawDelta || 1 / 60));
    this.elapsed += dt;

    this.sim.update(dt);
    const uniforms = this.pointsMaterial.uniforms;
    uniforms.uPositions.value = this.sim.positionTexture;
    uniforms.uTime.value = this.elapsed;

    const renderer = this.renderer;
    renderer.setRenderTarget(null);
    renderer.setViewport(0, 0, renderer.domElement.width, renderer.domElement.height);
    renderer.clear(true, true, true);
    renderer.render(this.scene, this.camera);

    // Statistics and automatic quality reduction.
    this.frames += 1;
    this.statsElapsed += rawDelta;
    this.qualityElapsed += rawDelta;
    this.qualityFrameSum += rawDelta;
    this.qualityFrames += 1;
    if (this.statsElapsed >= 1) {
      const fps = this.frames / this.statsElapsed;
      const stats = this.currentStats(fps);
      this.onStats?.(stats);
      this.frames = 0;
      this.statsElapsed = 0;
    }
    if (
      this.autoQualityEnabled &&
      !this.forcedTier &&
      this.elapsed > 4.5 &&
      this.qualityElapsed >= 2
    ) {
      const averageFrameMs = (this.qualityFrameSum / Math.max(1, this.qualityFrames)) * 1000;
      if (averageFrameMs > 22) this.reducePoints(0.7);
      this.qualityElapsed = 0;
      this.qualityFrameSum = 0;
      this.qualityFrames = 0;
    }

    this.raf = requestAnimationFrame(this.renderFrame);
  }

  get activeQuality(): QualityName {
    return this.tier.name;
  }

  get activePoints(): number {
    return this.activePointCount;
  }

  destroy(): void {
    this.destroyed = true;
    this.stopLoop();
    this.visibilityObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.scene.remove(this.points);
    this.planeGeometry.dispose();
    this.pointsMaterial.dispose();
    this.sim.dispose();
    this.simPlane.geometry.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
