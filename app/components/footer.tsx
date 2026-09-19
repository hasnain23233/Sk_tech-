"use client"
import React, { useState } from "react"
import Logo from "@/assets/logo.png"
import Image from "next/image"

const services = [
  { name: "Web Development", href: "/services/web-development" },
  { name: "Web Designing", href: "/services/web-designing" },
  { name: "Shopify Development", href: "/services/shopify-development" },
  { name: "Application Development", href: "/services/app-development" },
  { name: "Social Media Marketing", href: "/services/social-media-marketing" },
  { name: "SEO & Content Marketing", href: "/services/seo-content-marketing" },
  { name: "Graphic Designing", href: "/services/graphic-designing" },
  { name: "Content Writing", href: "/services/content-writing" },
  { name: "Pay-Per-Click Advertising", href: "/services/ppc-advertising" },
]

const company = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
]

const legal = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms" },
]

const socials = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path
          d="M6.94 8.5H3.56V20.4H6.94V8.5ZM5.25 3.6C4.1 3.6 3.3 4.42 3.3 5.47C3.3 6.5 4.08 7.34 5.21 7.34H5.23C6.4 7.34 7.18 6.5 7.18 5.47C7.16 4.42 6.4 3.6 5.25 3.6ZM20.7 13.42C20.7 10.27 19.02 8.8 16.79 8.8C15 8.8 14.19 9.79 13.74 10.48V8.5H10.36C10.4 9.5 10.36 20.4 10.36 20.4H13.74V13.85C13.74 13.5 13.77 13.15 13.87 12.9C14.15 12.2 14.79 11.48 15.86 11.48C17.27 11.48 17.32 12.6 17.32 13.87V20.4H20.7V13.42Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path
          d="M14.7 20.4v-7.2h2.4l.36-2.8h-2.76V8.6c0-.8.22-1.36 1.38-1.36h1.48V4.74c-.26-.03-1.14-.11-2.17-.11-2.15 0-3.62 1.31-3.62 3.72v2.07H9.4v2.8h2.37v7.2h2.93Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M3.5 3.5l7.2 9.4-7.5 8.6h2.2l6.4-7.3 5 7.3h4.7l-7.5-9.9 7-8.1h-2.2l-6 6.9-4.6-6.9H3.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
]

const Footer = () => {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail("")
  }

  return (
    <footer className="border-t border-neutral-200 bg-white">
      {/* Top: brand + newsletter */}
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <Image src={Logo} alt="SK Techs" className="h-12 w-auto" />
          </a>
          <p className="mt-5 text-[15px] leading-relaxed text-neutral-600">
            We design websites, run the campaigns that bring people to them, and report
            back in numbers you can actually use. Since 2011.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-[#8B2FC9] hover:to-[#FF2D95] hover:text-white"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="w-full max-w-sm">
          <p className="font-display text-sm font-semibold text-neutral-900">Stay in the loop</p>
          <p className="mt-2 text-[15px] text-neutral-600">
            One email a month — what we shipped, what worked, what didn't.
          </p>
          {subscribed ? (
            <p className="mt-4 text-sm font-medium text-[#8B2FC9]">
              You're on the list — thanks for subscribing.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full min-w-0 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#C837AB]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C837AB]/25 transition-transform hover:scale-[1.03]"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Middle: link columns */}
      <div className="border-t border-neutral-100">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-14 sm:grid-cols-4">
          <div>
            <p className="font-display text-sm font-semibold text-neutral-900">Services</p>
            <ul className="mt-4 space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-[15px] text-neutral-600 transition-colors hover:text-[#C837AB]"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-neutral-900">Company</p>
            <ul className="mt-4 space-y-3">
              {company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[15px] text-neutral-600 transition-colors hover:text-[#C837AB]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="hidden">
            <p className="font-display text-sm font-semibold text-neutral-900">Contact</p>
            <ul className="mt-4 space-y-3 text-[15px] text-neutral-600">
              <li>
                <a href="mailto:info@sktechs.com" className="transition-colors hover:text-[#C837AB]">
                  info@sktechs.com
                </a>
              </li>
              <li>
                <a href="tel:+923368007788" className="transition-colors hover:text-[#C837AB]">
                  Pakistan: +92 336 8007788
                </a>
              </li>
              <li>
                <a href="tel:+447708568160" className="transition-colors hover:text-[#C837AB]">
                  UK: +44 7708 568160
                </a>
              </li>
            </ul>
          </div> */}

          <div>
            <p className="font-display text-sm font-semibold text-neutral-900">Office</p>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
              PAK Arab Society, Gulberg
              <br />
              Lahore, Pakistan
            </p>
            <a
              href="/contact"
              className="mt-5 inline-block rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-[#C837AB] hover:text-[#C837AB]"
            >
              Start a Project
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-100">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} SK Techs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legal.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-neutral-500 transition-colors hover:text-[#C837AB]"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer