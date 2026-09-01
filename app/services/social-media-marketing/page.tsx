"use client"

import { useRef, useState } from "react"
import { Reveal, TiltCard, MagneticButton, ScrollProgress } from "@/app/components/motion"

/* Assumes the Sora / Inter font variables (--font-display, --font-body)
   are already applied at the root layout, same as the other pages. */

const stats = [
  { value: "4+ platforms", label: "Managed from one calendar" },
  { value: "Weekly", label: "Content planned, not improvised" },
  { value: "Monthly", label: "Reporting, in plain numbers" },
]

const benefits = [
  "A content calendar planned weeks out, not filled in the morning of",
  "Posts built for each platform's actual format, not one image reused everywhere",
  "Paid and organic run as one plan, so ad spend backs up what's already working",
  "Comments and messages answered on a schedule, not whenever someone remembers",
  "Reporting tied to leads and sales, not just likes and follower count",
  "Content ideas that come from what your audience responds to, not a generic monthly theme",
]

const features = [
  {
    title: "Content strategy",
    desc: "A calendar built around your goals and your audience's habits, planned by the month, not the day.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="15" rx="2" stroke="white" strokeWidth="2" />
        <path d="M3 10h18M8 3v4M16 3v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Platform management",
    desc: "Instagram, Facebook, LinkedIn, TikTok — posted, scheduled, and monitored from one place.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
        <path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Paid social ads",
    desc: "Campaigns built around one clear action per ad, tested and adjusted against real performance.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 17l5-5 4 4 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 8h5v5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Community management",
    desc: "Comments, DMs, and reviews answered on a real schedule — the part most brands let slide.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 11.5a8.4 8.4 0 01-8.7 8.5 8.7 8.7 0 01-4-1L3 20l1.2-4.3A8.4 8.4 0 013 11.5 8.5 8.5 0 0112 3a8.5 8.5 0 019 8.5z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Influencer partnerships",
    desc: "Creators matched to your audience, not just follower count, with terms and deliverables set up front.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="8" r="3.2" stroke="white" strokeWidth="2" />
        <path d="M3 20c0-3 2.2-5 5-5s5 2 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 4.3a3.2 3.2 0 010 6.2M17 20c0-2.6-1.5-4.5-3.5-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Analytics & reporting",
    desc: "Monthly reports in plain language — reach, engagement, and what it actually produced for the business.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V10M11 20V4M18 20v-7" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const process = [
  { step: "01", title: "Audit & strategy", body: "We review what's working on your current accounts, benchmark competitors, and set goals worth chasing." },
  { step: "02", title: "Content planning", body: "A monthly calendar built platform by platform, with creative produced ahead of the posting date, not the same day." },
  { step: "03", title: "Publishing & engagement", body: "Posts go out on schedule, and comments, DMs, and mentions get answered as they come in." },
  { step: "04", title: "Reporting & optimization", body: "Monthly numbers reviewed together, and next month's plan adjusted by what actually performed." },
]

const faqs = [
  { q: "Which platforms should we actually be on?", a: "Wherever your audience already spends time — that's rarely all of them. We'll recommend two or three platforms worth doing well, not five done thinly." },
  { q: "Do you create the content, or just post it?", a: "We do both. Content — graphics, captions, short video — is planned and produced as part of the service, not left for you to supply." },
  { q: "How often should we be posting?", a: "Consistency matters more than volume. Most brands do well posting 3–5 times a week per platform, backed by daily engagement." },
  { q: "How do you measure whether it's working?", a: "Against leads and sales where we can track them, alongside reach and engagement. Follower count alone doesn't make the monthly report." },
  { q: "Is ad spend included in your fee?", a: "No — ad spend goes directly to the platform and is billed separately from our management fee, so you always see exactly where it's going." },
]

const relatedLinks = [
  { title: "SEO Optimization", href: "/services/seo-optimization" },
  { title: "Pay Per Click", href: "/services/pay-per-click" },
  { title: "Graphic Designing", href: "/services/graphic-designing" },
  { title: "Content Writing", href: "/services/content-writing" },
]

/* Hero visual: a tilting phone frame showing a social post with
   engagement bubbles floating off it — a platform-specific moment,
   built with the same cursor-tilt physics as the other hero mockups. */
function FeedMockup() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 10, y: -10 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: 10 + py * -10, y: -10 + px * 14 })
  }

  function handleLeave() {
    setTilt({ x: 10, y: -10 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative flex h-[380px] items-center justify-center overflow-hidden rounded-3xl bg-[#FBF7FC] px-8"
      style={{ perspective: "1100px" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-14 -top-10 h-56 w-56 rounded-full opacity-45 blur-3xl"
        style={{
          background: "radial-gradient(circle, #FF2D95, transparent 70%)",
          transform: `translate(${(tilt.y + 10) * -1.2}px, ${(tilt.x - 10) * 1.2}px)`,
          transition: "transform 0.35s ease-out",
        }}
      />

      <div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.28s ease-out",
        }}
      >
        <div className="w-[220px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl shadow-[#6F1F9E]/15">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
            <span className="h-7 w-7 rounded-full bg-gradient-to-br from-[#8B2FC9] to-[#FF2D95]" />
            <div className="space-y-1">
              <div className="h-1.5 w-16 rounded-full bg-neutral-300" />
              <div className="h-1.5 w-10 rounded-full bg-neutral-100" />
            </div>
          </div>
          <div className="h-32 bg-gradient-to-br from-[#F6D3EC] via-[#EBC7EE] to-[#DDB6EE]" />
          <div className="space-y-2 px-4 py-3">
            <div className="flex gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6a4.8 4.8 0 018.8-2.7 4.8 4.8 0 018.8 2.7z" stroke="#8B2FC9" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 12a8.4 8.4 0 01-8.7 8.4 8.7 8.7 0 01-4-1L3 20l1.2-4.3A8.4 8.4 0 013 12 8.5 8.5 0 0112 3.5 8.5 8.5 0 0121 12z" stroke="#8B2FC9" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="h-1.5 w-3/4 rounded-full bg-neutral-100" />
          </div>
        </div>

        <div
          className="absolute -right-7 top-8 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-xl shadow-[#6F1F9E]/15"
          style={{ transform: "translateZ(24px)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6a4.8 4.8 0 018.8-2.7 4.8 4.8 0 018.8 2.7z" fill="#FF2D95" />
          </svg>
          <span className="text-[11px] font-semibold text-neutral-700">248</span>
        </div>
      </div>
    </div>
  )
}

export default function SocialMediaMarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="font-sans text-neutral-900">
      <ScrollProgress />

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="text-sm font-medium text-[#C837AB]">Marketing</p>
          <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Social media that's planned, not posted on the fly.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
            Strategy, content, community management, and paid social, run as one plan
            across the platforms your audience actually uses — reported back in numbers
            that connect to the business, not just the feed.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="/contact"
              className="rounded-full bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#C837AB]/25"
            >
              Start a project
            </MagneticButton>
            <a
              href="/portfolio"
              className="text-sm font-semibold text-neutral-800 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-[#C837AB]"
            >
              See our work
            </a>
          </div>

          <div className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-neutral-200 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-xl font-semibold sm:text-2xl">{s.value}</p>
                <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <FeedMockup />
      </section>

      {/* 2. Overview */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg leading-relaxed text-neutral-700">
            Most social accounts fail quietly — not from bad content, but from no plan
            behind it. We build a calendar around your actual goals, produce content built
            for each platform's format, run paid social alongside it, and answer the
            comments and messages that come back. Then we report on what it did for the
            business, not just the feed.
          </p>
        </Reveal>
      </section>

      {/* 3. Benefits */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What you get</h2>
            <p className="mt-4 max-w-sm text-neutral-600">
              Built into every account we manage, not billed as extras.
            </p>
          </Reveal>
          <ul className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#C837AB] to-[#FF2D95]" />
                <p className="text-[15px] leading-relaxed text-neutral-700">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Features */}
      <section className="bg-[#FBF7FC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What we run</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
            {features.map((f) => (
              <TiltCard
                key={f.title}
                className="rounded-2xl border border-neutral-200 bg-white p-6 hover:shadow-xl hover:shadow-neutral-900/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B2FC9] to-[#FF2D95]">
                  {f.icon}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Process */}
      <section className="relative overflow-hidden bg-[#1B1023] py-24 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #FF2D95, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">How a month runs</h2>
            <p className="mt-4 max-w-sm text-neutral-300">Planned ahead, reviewed after.</p>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="group">
                <span className="font-display text-sm font-semibold text-[#FF83C4] transition-transform duration-300 group-hover:translate-x-1 inline-block">
                  {p.step}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-300">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">Questions, answered</h2>
          </Reveal>
          <div className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-display text-[17px] font-medium">{f.q}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="shrink-0"
                    style={{
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="#171512" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: openFaq === i ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-10 text-[15px] leading-relaxed text-neutral-600">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Related services */}
      <section className="border-t border-neutral-200 bg-[#FBF7FC] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-display text-sm font-semibold text-neutral-500">Related services</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-[#C837AB] hover:text-[#8B2FC9]"
              >
                {l.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Ready for a feed with a plan behind it?
          </h2>
          <MagneticButton
            href="/contact"
            className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#8B2FC9]"
          >
            Get in touch
          </MagneticButton>
        </div>
      </section>
    </div>
  )
}