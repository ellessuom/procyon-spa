import { CUTOFF, RADIUS, RES } from './constants'

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

export const fragmentShader = /* glsl */ `
  uniform sampler2D uField;
  uniform float uTime, uVis, uMorph, uSpin, uDistort, uFill, uGlitch;
  varying vec2 vUv;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }

  // Signed distance (plane uv units, negative inside) of the shape mid-morph.
  float shape(vec2 uv) {
    vec2 q = uv - 0.5;
    float c = cos(uSpin), s = sin(uSpin);
    q = vec2(c * q.x - s * q.y, s * q.x + c * q.y) + 0.5;
    float circle = length(q - 0.5) - 0.3 + (noise(q * 7.0 + uTime * 3.0) - 0.5) * 0.09 * uDistort;
    float skull = (${(1 - CUTOFF).toFixed(2)} - texture2D(uField, vec2(q.x, 1.0 - q.y)).r) * ${RADIUS.toFixed(1)} / ${RES.toFixed(1)};
    return mix(circle, skull, uMorph);
  }

  // ring outline + fill
  float cover(float d, float aa) {
    float fill = smoothstep(aa, -aa, d) * uFill;
    float edge = 1.0 - smoothstep(0.003, 0.003 + aa, abs(d));
    return max(fill, edge);
  }

  void main() {
    vec2 uv = vUv;
    float frame = floor(uTime * 24.0);

    // horizontal slice jitter: random bands shift sideways, re-rolled 24×/s
    float band = floor(uv.y * 28.0);
    if (hash(vec2(band, frame)) < uGlitch * 0.4) uv.x += (hash(vec2(frame, band)) - 0.5) * 0.3 * uGlitch;

    // RGB split: red and blue see the shape shifted either way; the centre stays white (no green fringe)
    float split = 0.004 + 0.035 * uGlitch;
    float dG = shape(uv);
    float aa = fwidth(dG) + 1e-4;
    float g = cover(dG, aa);
    vec3 cov = vec3(max(g, cover(shape(uv + vec2(split, 0.0)), aa)), g, max(g, cover(shape(uv - vec2(split, 0.0)), aa)));

    float scan = mix(1.0, 0.7 + 0.3 * sin(vUv.y * 900.0), uGlitch);
    float flicker = mix(1.0, step(0.3, hash(vec2(frame, 3.1))), uGlitch * 0.7);
    gl_FragColor = vec4(vec3(1.0, 0.96, 0.9) * cov * 2.2 * scan * flicker * uVis, 1.0);
  }
`
