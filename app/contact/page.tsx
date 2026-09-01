"use client"

import { useState } from "react"

const services = [
  "Web Development",
  "Web Designing",
  "Shopify Development",
  "Application Development",
  "Social Media Marketing",
  "SEO & Content Marketing",
  "Graphic Designing",
  "Content Writing",
  "Pay-Per-Click Advertising",
  "Not sure yet",
]

const budgets = ["Under $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000+", "Let's discuss"]

const steps = [
  { step: "01", title: "You reach out", body: "Send the form or an email — takes about a minute." },
  { step: "02", title: "We reply within 2 days", body: "A straight answer on scope, timeline, and rough cost." },
  { step: "03", title: "Free scoping call", body: "30 minutes to walk through what you actually need." },
  { step: "04", title: "Fixed quote", body: "No hourly guesswork — a number you can plan around." },
]

const offices = [
  {
    country: "Pakistan",
    address: "PAK Arab Society, Gulberg, Lahore",
    phone: "+92 336 8007788",
    phoneHref: "tel:+923368007788",
  },
  {
    country: "United Kingdom",
    address: "Remote team, London-based hours",
    phone: "+44 7708 568160",
    phoneHref: "tel:+447708568160",
  },
]

type FormState = {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  message: string
}

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  budget: "",
  message: "",
}

function MagneticButton({
  children,
  className = "",
  type = "button",
  onClick,
  strength = 12,
  disabled = false,
}: {
  children: React.ReactNode
  className?: string
  type?: "button" | "submit"
  onClick?: () => void
  strength?: number
  disabled?: boolean
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [resting, setResting] = useState(true)

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: resting ? "transform 0.5s cubic-bezier(0.22,1,0.36,1)" : "transform 0.08s linear",
      }}
      className={className}
    >
      {children}
    </button>
  )
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-neutral-700">
      {children}
    </label>
  )
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#C837AB] focus:ring-2 focus:ring-[#C837AB]/15"

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = "Tell us your name."
    if (!form.email.trim()) {
      next.email = "We'll need an email to reply."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "That email doesn't look right."
    }
    if (!form.message.trim()) next.message = "A few lines about the project helps."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    // Simulated network delay — wire this up to your form endpoint / API route.
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 900)
  }

  if (submitted) {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8B2FC9] to-[#FF2D95]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold">Message sent.</h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-600">
          Thanks, {form.name.split(" ")[0] || "there"} — we'll get back to you within two business days at{" "}
          <span className="font-medium text-neutral-800">{form.email}</span>.
        </p>
        <button
          onClick={() => {
            setForm(initialForm)
            setSubmitted(false)
          }}
          className="mt-8 text-sm font-semibold text-[#8B2FC9] underline underline-offset-4"
        >
          Send another message
        </button>
      </section>
    )
  }

  return (
    <div className="text-neutral-900">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-4 pt-20 lg:pt-28">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#C837AB]">Contact</p>
        <h1 className="mt-4 max-w-xl font-display text-[2.5rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Let's start something.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-600">
          Tell us what you're building. We reply within two business days with a real
          answer, not a form-letter.
        </p>
      </section>

      {/* Form + info */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-neutral-200 p-7 sm:p-9">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jordan Smith"
                className={inputClass}
              />
              {errors.name && <p className="mt-1.5 text-sm text-[#C0257A]">{errors.name}</p>}
            </div>
            <div>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@company.com"
                className={inputClass}
              />
              {errors.email && <p className="mt-1.5 text-sm text-[#C0257A]">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+92 3XX XXXXXXX"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="service">Service you need</FieldLabel>
              <select
                id="service"
                value={form.service}
                onChange={(e) => update("service", e.target.value)}
                className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22 fill=%22none%22><path d=%22M2.5 4.5L6 8l3.5-3.5%22 stroke=%22%23737373%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10`}
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <FieldLabel htmlFor="budget">Rough budget</FieldLabel>
            <div className="flex flex-wrap gap-2.5">
              {budgets.map((b) => {
                const active = form.budget === b
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => update("budget", b)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] text-white shadow-md shadow-[#C837AB]/25"
                        : "border border-neutral-200 text-neutral-600 hover:border-[#C837AB] hover:text-[#C837AB]"
                    }`}
                  >
                    {b}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5">
            <FieldLabel htmlFor="message">Tell us about the project</FieldLabel>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="What are you trying to build or fix, and what does success look like?"
              className={`${inputClass} resize-none`}
            />
            {errors.message && <p className="mt-1.5 text-sm text-[#C0257A]">{errors.message}</p>}
          </div>

          <MagneticButton
            type="submit"
            disabled={submitting}
            className="mt-7 w-full rounded-full bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#C837AB]/25 disabled:opacity-70 sm:w-auto"
          >
            {submitting ? "Sending…" : "Send message"}
          </MagneticButton>
          <p className="mt-4 text-xs text-neutral-400">
            We'll only use these details to reply about your project.
          </p>
        </form>

        {/* Info sidebar */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-[#FBF7FC] p-7">
            <p className="font-display text-sm font-semibold">Prefer email or a call?</p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="mailto:info@sktechs.com"
                className="flex items-center gap-3 text-[15px] font-medium text-neutral-800 transition-colors hover:text-[#C837AB]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16v12H4V6Z" stroke="#8B2FC9" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M4 7l8 6 8-6" stroke="#8B2FC9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                info@sktechs.com
              </a>
              {offices.map((o) => (
                <a
                  key={o.country}
                  href={o.phoneHref}
                  className="flex items-center gap-3 text-[15px] font-medium text-neutral-800 transition-colors hover:text-[#C837AB]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2C10.6 20 4 13.4 4 6a2 2 0 0 1 1-2Z"
                        stroke="#8B2FC9"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {o.country}: {o.phone}
                </a>
              ))}
            </div>
          </div>

          {offices.map((o) => (
            <div key={o.country} className="rounded-2xl border border-neutral-200 p-7">
              <p className="font-display text-sm font-semibold">{o.country} office</p>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{o.address}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-neutral-200 p-7">
            <p className="font-display text-sm font-semibold">Response time</p>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
              We reply within two business days, usually sooner. If it's urgent, call the
              Pakistan office directly.
            </p>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-[#FBF7FC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-3xl font-semibold">What happens after you reach out</h2>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step}>
                <span className="font-display text-sm font-semibold text-[#C837AB]">{s.step}</span>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}