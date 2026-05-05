export const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uWaveSpeed;
  uniform vec2  uPanelSize;

  varying vec2 vUv;

  // IQ palette — magenta-dominant cycle (R floor lifted, G suppressed).
  vec3 palette(float t) {
    vec3 a = vec3(0.70, 0.20, 0.55);
    vec3 b = vec3(0.30, 0.15, 0.30);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.5, 0.25);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec3 iridescent = palette(uTime * 0.04 + uPhase);

    // Stock-chart wave — three non-harmonic sines so the pattern never loops
    // cleanly: big trend swings + medium moves + small ticks.
    float wave = sin(vUv.x * 2.5  + uTime * uWaveSpeed)        * 0.14
               + sin(vUv.x * 7.0  + uTime * uWaveSpeed * 1.3)  * 0.05
               + sin(vUv.x * 19.0 + uTime * uWaveSpeed * 0.5)  * 0.02;
    float waveY = 0.5 + wave;

    float worldYDiff = abs(vUv.y - waveY) * uPanelSize.y;
    float waveLine = smoothstep(0.022, 0.0, worldYDiff);
    vec3 waveColor = iridescent * waveLine * 1.4;

    // Traveling dot — slower sweep, smaller world-space radius.
    float dotPos = fract(uTime * 0.06 + uPhase);
    float dotEdgeFade =
      smoothstep(0.0, 0.06, dotPos) * (1.0 - smoothstep(0.94, 1.0, dotPos));
    float waveAtDot = sin(dotPos * 2.5  + uTime * uWaveSpeed)        * 0.14
                    + sin(dotPos * 7.0  + uTime * uWaveSpeed * 1.3)  * 0.05
                    + sin(dotPos * 19.0 + uTime * uWaveSpeed * 0.5)  * 0.02;
    float dotY = 0.5 + waveAtDot;

    vec2 worldUv      = vUv * uPanelSize;
    vec2 dotWorldPos  = vec2(dotPos, dotY) * uPanelSize;
    float dotDist     = distance(dotWorldPos, worldUv);
    float dotGlow     = smoothstep(0.22, 0.0, dotDist) * dotEdgeFade;
    vec3  dotColor    = vec3(1.0) * dotGlow * 1.4 + iridescent * dotGlow * 1.8;

    vec3 col = waveColor + dotColor;
    float finalAlpha = clamp(waveLine + dotGlow, 0.0, 1.0);

    gl_FragColor = vec4(col, finalAlpha);
  }
`;
