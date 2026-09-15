"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/* ─────────────────────────────────────────
   Shaders
   Two ribbons, phase-offset, woven around a shared axis —
   the "two founders, one desk" idea rendered as motion.
   Same simplex-noise/fold approach as the home page's
   HeroScene, parametrized so each ribbon can be tuned
   independently (phase, color, amplitude).
───────────────────────────────────────── */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMotion;
  uniform float uPhase;
  uniform float uAmp;
  uniform float uPulse;
  uniform vec2 uPulseOrigin;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vFold;

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

    // woven fold — offset by uPhase so two instances interlace rather than overlap
    float fold = sin(u * 0.4 + t * 0.16 + uPhase) * uAmp
               + sin(u * 0.18 - t * 0.1 + uPhase * 1.6) * uAmp * 0.55
               + cos(v * 0.6 + t * 0.09 + uPhase * 0.5) * uAmp * 0.28;

    float n = snoise(vec3(u * 0.26, v * 0.34, t * 0.11 + uPhase)) * uAmp * 0.32
            + snoise(vec3(u * 0.6 + 10.0, v * 0.6, t * 0.16)) * uAmp * 0.12;

    vec3 p = pos;
    p.z += fold + n;

    p.z += uMouse.x * 0.4 * sin(u * 0.22 + uPhase);
    p.y += uMouse.y * 0.2 * cos(v * 0.3 + uPhase);

    float distToClick = length(vec2(u, v) * 0.17 - uPulseOrigin);
    float ripple = uPulse * exp(-distToClick * distToClick * 0.75) * sin(distToClick * 7.0 - t * 6.0);
    p.z += ripple * 1.2;

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

    float foldOnly = sin(position.x * 0.4 + t * 0.16 + uPhase) * uAmp
                   + sin(position.x * 0.18 - t * 0.1 + uPhase * 1.6) * uAmp * 0.55;
    vFold = foldOnly;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorDark;
  uniform float uOpacity;

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

    float mixFactor = smoothstep(-2.0, 2.0, vFold);
    vec3 base = mix(uColorA, uColorB, mixFactor);
    vec3 shaded = mix(uColorDark * 0.5, base, diff * 0.65 + 0.35);

    float spec = pow(diff, 28.0) * 0.35;
    vec3 rim = mix(shaded, vec3(1.0), fresnel * 0.32);
    vec3 color = rim + spec;

    gl_FragColor = vec4(color, uOpacity);
  }
`

/* ─────────────────────────────────────────
   A single ribbon instance
───────────────────────────────────────── */
type PulseRef = { current: { value: number; origin: THREE.Vector2 } }

function Ribbon({
  reducedMotion,
  quality,
  position,
  rotation,
  colorA,
  colorB,
  phase,
  amp,
  opacity,
  spin,
  pulseRef,
  mouseRef,
}: {
  reducedMotion: boolean
  quality: "high" | "low"
  position: [number, number, number]
  rotation: [number, number, number]
  colorA: string
  colorB: string
  phase: number
  amp: number
  opacity: number
  spin: number
  pulseRef: PulseRef
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const smoothMouse = useRef({ x: 0, y: 0 })

  const geometry = useMemo(() => {
    const [segX, segY] = quality === "high" ? [140, 60] : [56, 26]
    return new THREE.PlaneGeometry(12, 5.5, segX, segY)
  }, [quality])

  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0.05 : 1 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPhase: { value: phase },
      uAmp: { value: amp },
      uOpacity: { value: opacity },
      uPulse: { value: 0 },
      uPulseOrigin: { value: new THREE.Vector2(999, 999) },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uColorDark: { value: new THREE.Color("#1B1023") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    uniforms.uMotion.value = reducedMotion ? 0.05 : 1
  }, [reducedMotion, uniforms])

  useFrame((_, delta) => {
    const mat = matRef.current
    const mesh = meshRef.current
    if (!mat || !mesh) return

    mat.uniforms.uTime.value += Math.min(delta, 0.05)

    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.03
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.03
    mat.uniforms.uMouse.value.set(smoothMouse.current.x, smoothMouse.current.y)

    mat.uniforms.uPulse.value = pulseRef.current.value
    mat.uniforms.uPulseOrigin.value.copy(pulseRef.current.origin)

    if (!reducedMotion) mesh.rotation.z += delta * spin
  })

  return (
    <mesh ref={meshRef} geometry={geometry} position={position} rotation={rotation}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  )
}

/* ─────────────────────────────────────────
   Floating accent particles (small instanced spheres,
   gold + pink, drifting — reads as "specks of light"
   caught in the weave)
───────────────────────────────────────── */
function Particles({ reducedMotion, count = 46 }: { reducedMotion: boolean; count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 13,
        y: (Math.random() - 0.5) * 6.5,
        z: (Math.random() - 0.5) * 4 - 1.5,
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.035,
      })),
    [count]
  )

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = reducedMotion ? clock.elapsedTime * 0.08 : clock.elapsedTime
    data.forEach((d, i) => {
      const y = d.y + Math.sin(t * d.speed + d.offset) * 0.4
      const x = d.x + Math.cos(t * d.speed * 0.6 + d.offset) * 0.25
      dummy.position.set(x, y, d.z)
      dummy.scale.setScalar(d.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#FFB648" transparent opacity={0.55} />
    </instancedMesh>
  )
}

/* ─────────────────────────────────────────
   Static fallback
───────────────────────────────────────── */
function StaticFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 72% 40%, rgba(255,45,149,0.18) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 25% 60%, rgba(139,47,201,0.24) 0%, transparent 62%)",
      }}
    />
  )
}

/* ─────────────────────────────────────────
   Scene root
───────────────────────────────────────── */
export default function AboutScene({ interactive = true }: { interactive?: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)
  const [quality, setQuality] = useState<"high" | "low">("high")

  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouse = useRef({ x: 0, y: 0 })
  const pulseRef = useRef({ value: 0, origin: new THREE.Vector2(999, 999) })

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

  useEffect(() => {
    if (!interactive) return
    const handlePointerMove = (e: PointerEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      targetMouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const handlePointerDown = (e: PointerEvent) => {
      const u = ((e.clientX / window.innerWidth) * 2 - 1) * 6
      const v = -((e.clientY / window.innerHeight) * 2 - 1) * 2.7
      pulseRef.current.value = 1
      pulseRef.current.origin.set(u * 0.17, v * 0.17)
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerdown", handlePointerDown, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [interactive])

  // smooth the raw target into mouseRef every frame via a tiny ticking effect
  useEffect(() => {
    let raf = 0
    const tick = () => {
      mouseRef.current.x += (targetMouse.current.x - mouseRef.current.x) * 1
      mouseRef.current.y += (targetMouse.current.y - mouseRef.current.y) * 1
      pulseRef.current.value *= 0.94
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!webglSupported) return <StaticFallback />

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.55} />
      <Ribbon
        reducedMotion={reducedMotion}
        quality={quality}
        position={[1.4, 0.3, -1.6]}
        rotation={[-0.22, 0.5, 0.32]}
        colorA="#8B2FC9"
        colorB="#FF2D95"
        phase={0}
        amp={1.35}
        opacity={0.9}
        spin={0.015}
        pulseRef={pulseRef}
        mouseRef={mouseRef}
      />
      <Ribbon
        reducedMotion={reducedMotion}
        quality={quality}
        position={[1.9, -0.5, -2.4]}
        rotation={[0.2, -0.42, -0.28]}
        colorA="#FF2D95"
        colorB="#8B2FC9"
        phase={3.1}
        amp={1.1}
        opacity={0.55}
        spin={-0.02}
        pulseRef={pulseRef}
        mouseRef={mouseRef}
      />
      <Particles reducedMotion={reducedMotion} count={quality === "high" ? 46 : 20} />
    </Canvas>
  )
}