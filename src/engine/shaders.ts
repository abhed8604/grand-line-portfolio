export const simVertexShader = /* glsl */ `
  precision highp float;
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const simVelocityShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uPositions;
  uniform sampler2D uVelocities;
  uniform sampler2D uTargets;
  uniform vec2 uSimSize;
  uniform float uTime;
  uniform float uDelta;
  uniform float uTargetTime;
  uniform float uSwarm;
  uniform float uIdleDrift;
  uniform float uAttraction;
  uniform float uDamping;
  uniform float uReturnSpeed;
  uniform float uReducedMotion;
  uniform float uBurstTime;
  uniform float uBurstStrength;
  uniform vec2 uBurstOrigin;
  uniform float uSurgeTime;
  uniform float uSurgeStrength;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform vec2 uPointerVelocity;
  uniform float uPushRadius;
  uniform float uPushStrength;
  uniform vec2 uRipples[6];
  uniform float uRippleStarts[6];
  uniform float uRippleStrengths[6];
  uniform float uRippleStrength;
  uniform float uRippleLifetime;

  vec3 permute(vec3 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
    );
    vec3 m = max(
      0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
      0.0
    );
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  vec2 curlNoise(vec2 p) {
    const float e = 0.22;
    float n1 = snoise(p + vec2(0.0, e));
    float n2 = snoise(p - vec2(0.0, e));
    float n3 = snoise(p + vec2(e, 0.0));
    float n4 = snoise(p - vec2(e, 0.0));
    return vec2(n1 - n2, -(n3 - n4)) / (2.0 * e);
  }

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uSimSize;
    vec4 posData = texture2D(uPositions, uv);
    vec4 velData = texture2D(uVelocities, uv);
    vec3 target = texture2D(uTargets, uv).xyz;
    vec3 pos = posData.xyz;
    vec3 vel = velData.xyz;

    float seed = hash12(uv * 931.7);
    float seed2 = hash12(uv * 331.9 + 18.2);
    float delay = seed * 0.48;
    float age = max(0.0, uTime - uTargetTime - delay);
    float ramp = smoothstep(0.0, 0.48, age);
    float settle = smoothstep(0.0, 2.5, age);
    float transitionLight = 1.0 - settle;

    // A small, permanent drift keeps the shape alive; the larger curl is only
    // present while the swarm is travelling.
    vec2 noiseField = pos.xy * 0.0042 + vec2(seed * 19.0, seed2 * 23.0);
    noiseField += vec2(uTime * 0.075, -uTime * 0.052);
    vec2 curl = curlNoise(noiseField);
    vec2 to = target.xy - pos.xy;
    float dist = length(to);
    vec2 direction = to / max(dist, 0.001);

    // The spring is only stiffened once the current morph has fully settled,
    // so transitions keep their original timing and easing.
    float returnBlend = smoothstep(2.5, 3.1, age);
    float spring = mix(uAttraction, uAttraction * uReturnSpeed, returnBlend);
    float attraction = spring * ramp * (0.72 + seed2 * 0.56);
    vec3 acc = vec3(to * attraction, 0.0);

    float swirl = (uSwarm * transitionLight + uIdleDrift) * (0.45 + seed * 1.1);
    vec2 tangent = vec2(-direction.y, direction.x);
    acc.xy += curl * swirl * 1.35;
    acc.xy += tangent * swirl * 0.33 * (seed2 - 0.5) * 2.0;
    acc.z += (target.z - pos.z) * 7.0 * ramp;

    float burstAge = uTime - uBurstTime;
    if (burstAge >= 0.0 && burstAge < 1.15) {
      vec2 away = pos.xy - uBurstOrigin;
      away = away / max(length(away), 0.001);
      away += vec2(seed - 0.5, seed2 - 0.5) * 1.6;
      acc.xy += away * uBurstStrength * exp(-burstAge * 6.5) * (0.4 + seed * 1.2);
    }

    float surgeAge = uTime - uSurgeTime;
    if (surgeAge >= 0.0 && surgeAge < 1.45) {
      float wave = sin(pos.x * 0.015 - surgeAge * 8.0 + seed * 5.0);
      vec2 along = normalize(vec2(1.0, 0.08 + wave * 0.12));
      acc.xy += along * uSurgeStrength * exp(-surgeAge * 2.8) * (0.55 + seed * 0.9);
    }

    // Water displacement under the cursor. The force fades with distance and
    // is fed back through the attraction spring above, so the LEDs part a
    // little and then settle exactly where they were.
    if (uPointerActive > 0.5) {
      vec2 away = pos.xy - uPointer;
      float pointerDist = length(away);
      float pointerRadius = uPushRadius;
      if (pointerDist < pointerRadius) {
        vec2 awayDir = away / max(pointerDist, 0.001);
        float falloff = 1.0 - pointerDist / pointerRadius;
        falloff *= falloff;
        float speed = length(uPointerVelocity);
        float push = uPushStrength * (1.0 + min(speed * 0.0072, 2.0));
        acc.xy += awayDir * falloff * push * (0.55 + seed * 0.9);
        acc.xy += vec2(-awayDir.y, awayDir.x) * falloff * uPushStrength * 0.1889 * (seed2 - 0.5);
      }
    }

    // Expanding rings stir any LEDs the wavefront passes through.
    for (int i = 0; i < 6; i++) {
      float rippleAge = uTime - uRippleStarts[i];
      if (rippleAge > 0.0 && rippleAge < uRippleLifetime) {
        vec2 fromRipple = pos.xy - uRipples[i];
        float rippleDist = length(fromRipple);
        float radius = rippleAge * 255.0;
        float ringWidth = 4.0 + rippleAge * 10.0;
        float ring = 1.0 - smoothstep(0.0, ringWidth, abs(rippleDist - radius));
        ring *= step(radius - ringWidth, rippleDist);
        float decay = exp(-rippleAge * 3.6);
        float strength = ring * decay * uRippleStrengths[i];
        acc.xy += (fromRipple / max(rippleDist, 0.001)) * strength * uRippleStrength;
        acc.xy += vec2(-fromRipple.y, fromRipple.x) / max(rippleDist, 0.001) * strength * uRippleStrength * 0.16 * (seed - 0.5);
      }
    }

    vel += acc * uDelta;

    // Keep the solver well-behaved if a frame is lost or a tab wakes up.
    float speed = length(vel);
    float maxSpeed = mix(2100.0, 520.0, uReducedMotion);
    if (speed > maxSpeed) vel *= maxSpeed / speed;

    float damping = mix(uDamping, uDamping * uReturnSpeed, returnBlend);
    damping = mix(damping, max(12.0, damping), uReducedMotion);
    vel *= exp(-damping * uDelta);
    gl_FragColor = vec4(vel, 1.0);
  }
`;

export const simPositionShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uPositions;
  uniform sampler2D uVelocities;
  uniform vec2 uSimSize;
  uniform float uDelta;
  void main() {
    vec2 uv = gl_FragCoord.xy / uSimSize;
    vec4 pos = texture2D(uPositions, uv);
    vec3 vel = texture2D(uVelocities, uv).xyz;
    pos.xyz += vel * uDelta;
    gl_FragColor = vec4(pos.xyz, 1.0);
  }
`;

export const ledVertexShader = /* glsl */ `
  precision highp float;
  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;
  uniform sampler2D uPositions;
  uniform sampler2D uTargets;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uTime;
  uniform float uDPR;
  uniform float uPixelBoost;
  uniform float uIdleDrift;
  uniform float uPushRadius;
  uniform float uReducedMotion;

  attribute vec3 position;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vCore;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec2 ref = position.xy;
    vec4 simulated = texture2D(uPositions, ref);
    vec3 led = simulated.xyz;
    float seed = position.z;
    float seedAngle = seed * 6.2831853;
    float depth = clamp((led.z + 55.0) / 110.0, 0.0, 1.0);
    // Alpha in the target texture carries a per-point edge weight. Outline
    // points burn brighter and slightly larger; interior fill stays soft.
    float edgeWeight = texture2D(uTargets, ref).a;

    float motion = 1.0 - uReducedMotion * 0.8;

    // Every LED has its own almost-still current. Drift stays under a pixel
    // and there is no shape-wide sway, bob, flap or breathing.
    float driftAmp = uIdleDrift * (0.35 + seed * 0.65) * motion;
    vec2 drift = vec2(
      sin(uTime * 0.13 + seedAngle + led.y * 0.012),
      cos(uTime * 0.11 + seed * 4.7 + led.x * 0.009)
    ) * driftAmp;
    led.xy += drift;

    float shapeGlow = 1.0;

    // Only a small share of the field shimmers, and it does so very slowly.
    float shimmerPick = step(0.86, seed);
    float shimmer = 0.5 + 0.5 * sin(uTime * (0.08 + seed * 0.12) + seed * 39.0);
    float twinkle = 0.7 + shimmer * mix(0.08, 0.3, shimmerPick);

    float mTime = floor(uTime * 0.4);
    float sparkle = step(0.9965, hash12(vec2(seed * 917.0, mTime + seed * 31.0)));
    sparkle *= shimmerPick * motion * (0.4 + edgeWeight * 0.6);
    twinkle += sparkle * 0.45;

    float near = 0.0;
    if (uPointerActive > 0.5) {
      near = 1.0 - smoothstep(uPushRadius * 0.18, uPushRadius * 1.15, distance(led.xy, uPointer));
      near = clamp(near, 0.0, 1.0);
    }

    vec3 deep = vec3(0.118, 0.435, 0.851);
    vec3 accent = vec3(0.361, 0.784, 1.000);
    vec3 mid = vec3(0.749, 0.902, 1.000);
    vec3 core = vec3(1.0);

    float coolness = smoothstep(0.0, 1.0, seed);
    vec3 color = mix(deep, accent, 0.48 + coolness * 0.52);
    color = mix(color, mid, smoothstep(0.5, 1.0, seed) * 0.68);
    color = mix(color, core, twinkle * 0.31 + depth * 0.2 + near * 0.55 + sparkle * 0.45);
    color = mix(color, mid, edgeWeight * 0.16);
    color *= shapeGlow;

    float size = mix(1.55, 3.25, seed) * (0.74 + depth * 0.78);
    size *= mix(0.8, 1.16, edgeWeight);
    size *= 1.0 + near * 1.1 + sparkle * 1.2;
    size *= uPixelBoost;
    gl_PointSize = clamp(size * uDPR, 1.0, 38.0);

    vColor = color;
    vAlpha = (0.27 + twinkle * 0.43 + depth * 0.17) * (0.8 + near * 1.25);
    vAlpha *= shapeGlow * mix(0.62, 1.18, edgeWeight) * (1.0 + sparkle * 0.9);
    vCore = depth;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(led, 1.0);
  }
`;

export const ledFragmentShader = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vCore;

  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float radius = length(centered) * 2.0;
    if (radius > 1.0) discard;

    float halo = pow(max(0.0, 1.0 - radius), 2.1);
    float core = pow(max(0.0, 1.0 - radius / 0.33), 2.0);
    float alpha = (halo * 0.64 + core * 0.92) * vAlpha;
    if (alpha < 0.008) discard;

    vec3 color = vColor * (0.82 + core * 0.52 + vCore * 0.14);
    gl_FragColor = vec4(color, alpha);
  }
`;
