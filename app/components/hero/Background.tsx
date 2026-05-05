"use client";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;

  // Linear-space equivalents — Three converts to sRGB on output.
  // deep ≈ #08060F, ink ≈ #100822 (subtle lift only)
  void main() {
    vec3 deep = vec3(0.0024, 0.0014, 0.0070);
    vec3 ink  = vec3(0.0070, 0.0028, 0.0180);

    vec2 center = vec2(0.5, 0.55);
    vec2 d = (vUv - center) / vec2(0.50, 0.36);
    float falloff = exp(-dot(d, d) * 2.6);

    vec3 col = mix(deep, ink, falloff);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Background() {
  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[60, 35]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
}
