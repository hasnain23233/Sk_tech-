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

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
]

const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-2">
          <Image src={Logo} alt="SK Techs" className="h-12 w-auto" />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 lg:flex">
          <a
            href="/"
            className="text-[15px] font-medium text-neutral-700 transition-colors hover:text-[#C837AB]"
          >
            Home
          </a>

          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="flex items-center gap-1.5 text-[15px] font-medium text-neutral-700 transition-colors hover:text-[#C837AB]"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
            >
              Services
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-4">
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl shadow-neutral-900/5">
                  {services.map((service) => (
                    <a
                      key={service.name}
                      href={service.href}
                      className="rounded-lg px-4 py-3 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-[#C837AB]"
                    >
                      {service.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLinks.slice(1).map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[15px] font-medium text-neutral-700 transition-colors hover:text-[#C837AB]"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden items-center gap-5 lg:flex">
          <a
            href="tel:+923368007788"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-[#C837AB]"
          >
            +92 336 8007788
          </a>
          <a
            href="/contact"
            className="rounded-full bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C837AB]/25 transition-transform hover:scale-[1.03]"
          >
            Start a Project
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-6 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col">
            {navLinks.slice(0, 1).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="border-b border-neutral-100 py-3.5 text-[15px] font-medium text-neutral-700"
              >
                {link.name}
              </a>
            ))}

            <button
              className="flex items-center justify-between border-b border-neutral-100 py-3.5 text-[15px] font-medium text-neutral-700"
              onClick={() => setMobileServicesOpen((v) => !v)}
              aria-expanded={mobileServicesOpen}
            >
              Services
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {mobileServicesOpen && (
              <div className="flex flex-col bg-neutral-50 pl-3">
                {services.map((service) => (
                  <a
                    key={service.name}
                    href={service.href}
                    className="border-b border-neutral-100 py-3 text-sm text-neutral-600"
                  >
                    {service.name}
                  </a>
                ))}
              </div>
            )}

            {navLinks.slice(1).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="border-b border-neutral-100 py-3.5 text-[15px] font-medium text-neutral-700"
              >
                {link.name}
              </a>
            ))}

            <a
              href="/contact"
              className="mt-5 rounded-full bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] px-6 py-3 text-center text-sm font-semibold text-white"
            >
              Start a Project
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar