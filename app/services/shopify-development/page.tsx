"use client"

import { useRef, useState } from "react"
import { Reveal, TiltCard, MagneticButton, ScrollProgress } from "@/app/components/motion"

/* Assumes the Sora / Inter font variables (--font-display, --font-body)
   are already applied at the root layout, same as the other pages. */

const stats = [
  { value: "2–4 wks", label: "Store build, theme to checkout" },
  { value: "Online Store 2.0", label: "Theme architecture, section-based" },
  { value: "Plus & Hydrogen", label: "Ready for scale when you are" },
]

const benefits = [
  "Custom Liquid theme built around your products, not a stock theme with a new logo",
  "Checkout tuned for mobile, where most Shopify traffic actually converts",
  "Clean data migration from your current platform — products, orders, and customers intact",
  "Only the apps you need, chosen and configured so they don't collide or slow the store down",
  "Page speed treated as a launch requirement, not an afterthought",
  "Support after launch for theme updates, app changes, and seasonal campaigns",
]

const features = [
  {
    title: "Custom theme development",
    desc: "Liquid themes built section-by-section on Online Store 2.0, styled to your brand from the ground up.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 3l1 4h10l1-4M4 8h16l-1.5 12a2 2 0 01-2 1.7H7.5a2 2 0 01-2-1.7L4 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Store migration",
    desc: "Moving from WooCommerce, Magento, or another platform, with products, history, and SEO redirects preserved.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 12h13M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "App integrations",
    desc: "Reviews, subscriptions, loyalty, ERP, or a custom app built against the Shopify API when nothing off-the-shelf fits.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
        <path d="M16.5 14v6M13.5 17h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Shopify Plus & headless",
    desc: "Custom checkout extensibility on Plus, or a Hydrogen storefront when the front end needs to break from Liquid entirely.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 3v18M4 7.5l8 4.5 8-4.5" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Checkout & conversion",
    desc: "Cart flow, shipping and payment options, and page speed, all tuned against where shoppers actually drop off.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h2l2 11h10l2-8H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.4" fill="white" />
        <circle cx="16" cy="20" r="1.4" fill="white" />
      </svg>
    ),
  },
  {
    title: "Ongoing support",
    desc: "Theme updates, seasonal changes, and app troubleshooting, on retainer or as needed after launch.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="white" strokeWidth="2" />
        <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const process = [
  { step: "01", title: "Store audit & planning", body: "We review your catalog, current platform, and goals, and scope the theme, apps, and migration needed." },
  { step: "02", title: "Design & theme build", body: "Section-based Liquid theme built around your products, reviewed page by page as it's built." },
  { step: "03", title: "Apps & data migration", body: "Products, customers, and order history migrated; apps configured and tested against the live catalog." },
  { step: "04", title: "Launch & growth", body: "Go-live, then speed checks, conversion tracking, and support through your first campaigns." },
]

const faqs = [
  { q: "Do we need Shopify Plus?", a: "Only if you need custom checkout logic, higher API limits, or multi-store management. Most stores run well on Shopify's standard plans." },
  { q: "Can you migrate our existing store without losing data?", a: "Yes. Products, customers, and order history move over, and we set up redirects so existing SEO rankings and bookmarked links keep working." },
  { q: "Will a custom theme be slower than a template?", a: "No — done properly it's usually faster, since we're not carrying unused template code. We treat page speed as a requirement, not an extra." },
  { q: "What ongoing costs should we expect?", a: "Shopify's own plan fee, plus whatever apps you keep active. We help pick apps that earn their monthly cost rather than stacking subscriptions." },
  { q: "Can you build a headless storefront on Shopify?", a: "Yes, using Hydrogen and the Storefront API, when the front end needs more flexibility than a Liquid theme allows." },
]

const relatedLinks = [
  { title: "Web Development", href: "/services/web-development" },
  { title: "Web Designing", href: "/services/web-designing" },
  { title: "SEO Optimization", href: "/services/seo-optimization" },
  { title: "Pay Per Click", href: "/services/pay-per-click" },
]

/* Hero visual: a tilting product-page mockup with a price, an add-to-
   cart button, and a floating cart badge — a storefront-specific
   moment, built with the same cursor-tilt physics as the other
   service pages' hero mockups for family resemblance. */
function StorefrontMockup() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 10, y: -12 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: 10 + py * -10, y: -12 + px * 14 })
  }

  function handleLeave() {
    setTilt({ x: 10, y: -12 })
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
        className="pointer-events-none absolute -left-14 -top-14 h-56 w-56 rounded-full opacity-45 blur-3xl"
        style={{
          background: "radial-gradient(circle, #8B2FC9, transparent 70%)",
          transform: `translate(${(tilt.y + 12) * -1.2}px, ${(tilt.x - 10) * 1.2}px)`,
          transition: "transform 0.35s ease-out",
        }}
      />

      <div
        className="relative w-full max-w-sm"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.28s ease-out",
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl shadow-[#6F1F9E]/15">
          <div className="flex items-center gap-1.5 border-b border-neutral-100 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF2D95]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#C837AB]/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8B2FC9]/40" />
            <span className="ml-3 text-[11px] font-medium text-neutral-400">product page</span>
          </div>
          <div className="px-5 py-6">
            <div className="h-32 rounded-lg bg-gradient-to-br from-[#F6D3EC] via-[#EBC7EE] to-[#DDB6EE]" />
            <div className="mt-4 h-2.5 w-2/3 rounded-full bg-neutral-200" />
            <div className="mt-2 h-2.5 w-1/3 rounded-full bg-neutral-100" />
            <div className="mt-5 flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-neutral-800">$68.00</span>
              <span className="rounded-full bg-gradient-to-r from-[#8B2FC9] to-[#FF2D95] px-4 py-2 text-[12px] font-semibold text-white">
                Add to cart
              </span>
            </div>
          </div>
        </div>

        <div
          className="absolute -right-5 -top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xl shadow-[#6F1F9E]/15"
          style={{ transform: "translateZ(24px)" }}
        >
          <span className="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6h15l-1.5 9h-12L6 6z" stroke="#8B2FC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L4.5 2.5H2" stroke="#8B2FC9" strokeWidth="2" strokeLinecap="round" />
              <circle cx="9.5" cy="20" r="1.4" fill="#8B2FC9" />
              <circle cx="17.5" cy="20" r="1.4" fill="#8B2FC9" />
            </svg>
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF2D95] text-[9px] font-bold text-white">
              3
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ShopifyDevelopmentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="font-sans text-neutral-900">
      <ScrollProgress />

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="text-sm font-medium text-[#C837AB]">E-commerce</p>
          <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Shopify stores built to sell, not just to launch.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
            Custom themes, clean migrations, and checkout tuned for conversion — built on
            Shopify's platform and unlocked further with Plus or a headless storefront
            when you need it.
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

        <StorefrontMockup />
      </section>

      {/* 2. Overview */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg leading-relaxed text-neutral-700">
            Shopify handles hosting, payments, and security — what determines whether a
            store actually sells is the theme, the checkout experience, and how well the
            apps behind it are chosen. We build custom Liquid themes, migrate stores
            cleanly from other platforms, and keep the whole thing fast on mobile, where
            most Shopify traffic converts or doesn't.
          </p>
        </Reveal>
      </section>

      {/* 3. Benefits */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What you get</h2>
            <p className="mt-4 max-w-sm text-neutral-600">
              Built into every store we ship, not sold back as add-ons.
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
            <h2 className="font-display text-3xl font-semibold">What we build</h2>
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
            <h2 className="font-display text-3xl font-semibold">How a store build runs</h2>
            <p className="mt-4 max-w-sm text-neutral-300">Four stages, catalog to checkout.</p>
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
            Ready for a store that earns its traffic?
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