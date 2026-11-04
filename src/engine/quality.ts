import * as THREE from "three";
import { QUALITY_TIERS, type QualityName } from "./constants";

type BenchNavigator = Navigator & {
  deviceMemory?: number;
  gpu?: unknown;
};

function readTierOverride(): QualityName | null {
  const value = new URLSearchParams(window.location.search).get("tier");
  if (value === "high" || value === "medium" || value === "low" || value === "lite") return value;
  return null;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/**
 * A deliberately short draw benchmark: fill rate plus shader work, not a
 * guessed device class. The loader runs while this happens.
 */
export async function chooseQualityTier(): Promise<QualityName> {
  const override = readTierOverride();
  if (override) return override;

  if (window.innerWidth < 880 || window.matchMedia("(pointer: coarse)").matches) {
    return "lite";
  }

  const nav = navigator as BenchNavigator;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  if (memory <= 4) return "lite";
  let fallbackTier: QualityName = cores <= 4 || memory <= 4 ? "medium" : "high";

  let renderer: THREE.WebGLRenderer | null = null;
  let canvas: HTMLCanvasElement | null = null;
  try {
    canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 540;
    canvas.style.cssText = "position:fixed;left:-10000px;top:-10000px;opacity:0;pointer-events:none";
    document.body.appendChild(canvas);
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: false,
    });
    renderer.setPixelRatio(1);
    renderer.setSize(960, 540, false);
    renderer.setClearColor(0x000000, 1);

    const gl = renderer.getContext();
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const rendererName = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      : "";
    if (/swiftshader|llvmpipe|software/i.test(rendererName)) {
      return "low";
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform float uTime;
        void main() {
          vec2 uv = gl_FragCoord.xy / vec2(960.0, 540.0);
          float v = 0.0;
          vec3 p = vec3(uv * 5.0, uTime);
          for (int i = 0; i < 28; i++) {
            p.xy = mat2(0.82, 0.57, -0.57, 0.82) * p.xy;
            v += sin(p.x * 2.3 + p.y * 1.7 + float(i));
          }
          gl_FragColor = vec4(vec3(abs(v) * 0.008), 1.0);
        }
      `,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const samples: number[] = [];
    for (let frame = 0; frame < 9; frame += 1) {
      material.uniforms.uTime.value = frame * 0.1;
      const start = performance.now();
      renderer.render(scene, camera);
      gl.finish();
      const elapsed = performance.now() - start;
      if (frame >= 3) samples.push(elapsed);
    }
    const avg = median(samples);
    geometry.dispose();
    material.dispose();

    if (avg > 23 || cores <= 2) fallbackTier = "low";
    else if (avg > 10.5 || cores <= 4 || memory <= 4) fallbackTier = "medium";
    else fallbackTier = "high";
  } catch {
    fallbackTier = "low";
  } finally {
    renderer?.dispose();
    renderer?.forceContextLoss();
    canvas?.remove();
  }

  // Respect the hard caps from the brief even if the test is unusually fast.
  return QUALITY_TIERS[fallbackTier].name;
}
