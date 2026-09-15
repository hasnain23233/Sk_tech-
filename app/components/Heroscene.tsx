"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/* ─────────────────────────────────────────
   Shaders
   A large plane is bent into a sweeping fold (like a dropped ribbon
   of silk) and then perturbed with 3D simplex noise for soft,
   fabric-like surface detail. Normals are reconstructed per-vertex
   from finite differences so lighting responds to the fold.
───────────────────────────────────────── */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMotion;
  uniform float uPulse;
  uniform vec2 uPulseOrigin;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vFold;

  // Ashima simplex noise (3D) — classic public-domain implementation
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0,0.5,1.0,2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 displace(vec3 pos, float t){
    float u = pos.x;
    float v = pos.y;

    // large, bold sweeping fold — the "ribbon" shape, thicker + faster than before
    float fold = sin(u * 0.34 + t * 0.11) * 2.6
               + sin(u * 0.15 - t * 0.075 + 1.4) * 1.7
               + cos(v * 0.55 + t * 0.065) * 0.6;

    // fuller organic surface detail
    float n = snoise(vec3(u * 0.22, v * 0.3, t * 0.09)) * 0.65
            + snoise(vec3(u * 0.6 + 10.0, v * 0.6, t * 0.14)) * 0.22;

    vec3 p = pos;
    p.z += fold + n;

    // responsive mouse-driven bend — snappier, more visible
    p.z += uMouse.x * 0.55 * sin(u * 0.2 + 1.0);
    p.y += uMouse.y * 0.26 * cos(v * 0.3);

    // click / tap ripple — localized, decaying pulse
    float distToClick = length(vec2(u, v) * 0.16 - uPulseOrigin);
    float ripple = uPulse * exp(-distToClick * distToClick * 0.7) * sin(distToClick * 7.0 - t * 6.0);
    p.z += ripple * 1.4;

    return p;
  }

  void main() {
    float t = uTime * uMotion;
    float eps = 0.06;

    vec3 p0 = displace(position, t);
    vec3 p1 = displace(position + vec3(eps, 0.0, 0.0), t);
    vec3 p2 = displace(position + vec3(0.0, eps, 0.0), t);

    vec3 tangentU = normalize(p1 - p0);
    vec3 tangentV = normalize(p2 - p0);
    vec3 n = normalize(cross(tangentU, tangentV));

    vNormal = normalize(normalMatrix * n);
    vWorldPos = (modelMatrix * vec4(p0, 1.0)).xyz;

    float foldOnly = sin(position.x * 0.34 + t * 0.11) * 2.6
                   + sin(position.x * 0.15 - t * 0.075 + 1.4) * 1.7;
    vFold = foldOnly;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorDark;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vFold;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 normal = normalize(vNormal);
    if (dot(normal, viewDir) < 0.0) normal = -normal;

    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.4);

    vec3 lightDir = normalize(vec3(0.35, 0.65, 0.75));
    float diff = max(dot(normal, lightDir), 0.0);

    float mixFactor = smoothstep(-2.4, 2.4, vFold);
    vec3 base = mix(uColorA, uColorB, mixFactor);
    vec3 shaded = mix(uColorDark * 0.5, base, diff * 0.65 + 0.35);

    float spec = pow(diff, 28.0) * 0.35;
    vec3 rim = mix(shaded, vec3(1.0), fresnel * 0.3);
    vec3 color = rim + spec;

    gl_FragColor = vec4(color, 1.0);
  }
`

/* ─────────────────────────────────────────
   Mesh
───────────────────────────────────────── */
function FabricMesh({ reducedMotion, quality }: { reducedMotion: boolean; quality: "high" | "low" }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const targetMouse = useRef({ x: 0, y: 0 })

  const geometry = useMemo(() => {
    const [segX, segY] = quality === "high" ? [180, 80] : [70, 32]
    return new THREE.PlaneGeometry(17, 7.5, segX, segY)
  }, [quality])

  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0.06 : 1 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#8B2FC9") },
      uColorB: { value: new THREE.Color("#FF2D95") },
      uColorDark: { value: new THREE.Color("#1B1023") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    uniforms.uMotion.value = reducedMotion ? 0.06 : 1
  }, [reducedMotion, uniforms])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      targetMouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [])

  useFrame((_, delta) => {
    const mat = matRef.current
    if (!mat) return
    mat.uniforms.uTime.value += Math.min(delta, 0.05)

    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.025
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.025
    mat.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y)
  })

  return (
    <mesh geometry={geometry} rotation={[-0.32, 0.55, 0.4]} position={[2.2, -0.6, -2.5]}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ─────────────────────────────────────────
   Static fallback (no WebGL / reduced motion edge case)
───────────────────────────────────────── */
function StaticFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 65% 55% at 68% 65%, rgba(255,45,149,0.28) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 30% 30%, rgba(139,47,201,0.4) 0%, transparent 62%)",
      }}
    />
  )
}

/* ─────────────────────────────────────────
   Scene root — mounted client-only via dynamic import
───────────────────────────────────────── */
export default function HeroScene() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)
  const [quality, setQuality] = useState<"high" | "low">("high")

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener("change", onChange)

    setQuality(window.innerWidth < 768 ? "low" : "high")

    try {
      const testCanvas = document.createElement("canvas")
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")
      if (!gl) setWebglSupported(false)
    } catch {
      setWebglSupported(false)
    }

    return () => mq.removeEventListener("change", onChange)
  }, [])

  if (!webglSupported) return <StaticFallback />

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 40 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.5} />
      <FabricMesh reducedMotion={reducedMotion} quality={quality} />
    </Canvas>
  )
}