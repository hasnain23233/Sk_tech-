"use client"

import React, { useRef, useState, ReactNode } from "react"

/* ─────────────────────────────────────────
   Tilt3D
   Wraps any card in a mouse-reactive 3D tilt with a moving
   glare sheen and a soft directional shadow that follows the
   tilt. Pointer-driven only (respects prefers-reduced-motion
   implicitly, since it does nothing without pointer input).
───────────────────────────────────────── */
export function Tilt3D({
  children,
  max = 9,
  scale = 1.015,
  glare = true,
  shadow = true,
  className = "",
  style = {},
}: {
  children: ReactNode
  max?: number
  scale?: number
  glare?: boolean
  shadow?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const ry = (px - 0.5) * max * 2
    const rx = -(py - 0.5) * max * 2
    setT({ rx, ry, gx: px * 100, gy: py * 100, active: true })
  }

  const onLeave = () => setT((prev) => ({ ...prev, rx: 0, ry: 0, active: false }))

  const shadowX = -(t.ry / max) * 14
  const shadowY = (t.rx / max) * 14

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.active ? scale : 1})`,
        transition: t.active ? "transform 0.1s linear" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: shadow
          ? `${shadowX}px ${shadowY + 14}px ${t.active ? 34 : 20}px rgba(27,16,35,${t.active ? 0.16 : 0.08})`
          : undefined,
        ...style,
      }}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            opacity: t.active ? 1 : 0,
            transition: "opacity 0.3s ease",
            background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.4), transparent 55%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   Magnetic
   Lightweight magnetic-pull wrapper for small interactive
   controls (pills, icon buttons) — pulls toward the cursor
   within its bounds, springs back on leave.
───────────────────────────────────────── */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
  style = {},
  as: Tag = "div",
  onClick,
}: {
  children: ReactNode
  strength?: number
  className?: string
  style?: React.CSSProperties
  as?: "div" | "button"
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement & HTMLButtonElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * strength
    const y = (e.clientY - r.top - r.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)"
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={className}
      style={{ transition: "transform 0.2s ease-out", ...style }}
    >
      {children}
    </Tag>
  )
}