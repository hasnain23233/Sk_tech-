"use client"

import { useEffect, useRef, useState } from "react"

/* ---------------------------------------------------------------- */
/* Shared interaction primitives used across the site: scroll        */
/* reveal, count-up, 3D tilt, magnetic buttons, scroll progress.     */
/* Extracted from the homepage so every page shares one design       */
/* system instead of re-implementing these per route.                */
/* ---------------------------------------------------------------- */

export function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [ref, inView] = useInView(0.3)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(18px)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  )
}

export function Counter({ value }: { value: string }) {
  const match = value.match(/^([\d.]+)(.*)$/)
  const numeric = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : ""
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0
  const [ref, inView] = useInView(0.6)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf: number
    let start: number | null = null
    const duration = 1300
    function tick(ts: number) {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(eased * numeric)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, numeric])

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
    transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
  })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateZ(6px)`,
      transition: "transform 0.12s ease-out",
    })
  }

  function handleLeave() {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform", ...style }}
      className={className}
    >
      {children}
    </div>
  )
}

export function MagneticButton({
  children,
  className = "",
  href,
  strength = 14,
}: {
  children: React.ReactNode
  className?: string
  href: string
  strength?: number
}) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [resting, setResting] = useState(true)

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setResting(false)
    setPos({ x: x * strength, y: y * strength })
  }

  function handleLeave() {
    setResting(true)
    setPos({ x: 0, y: 0 })
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: resting ? "transform 0.5s cubic-bezier(0.22,1,0.36,1)" : "transform 0.08s linear",
        display: "inline-block",
      }}
      className={className}
    >
      {children}
    </a>
  )
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop
      const scrollHeight = doc.scrollHeight - doc.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95]"
        style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
      />
    </div>
  )
}