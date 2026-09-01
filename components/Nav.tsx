"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  {
    href: "/", label: "Home", icon: (
      <path d="M4 12 12 5l8 7M6 11v8h5v-5h2v5h5v-8" />
    ),
  },
  {
    href: "/services", label: "Services", icon: (
      <path d="M13 2 5 14h5l-1 8 8-12h-5l1-8z" fill="currentColor" stroke="none" />
    ),
  },
  {
    href: "/projects", label: "Our Clients", icon: (
      <>
        <circle cx="8.5" cy="8" r="3" />
        <path d="M2.5 20a6 6 0 0 1 12 0" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M14.5 20a5 5 0 0 1 7-4.6" />
      </>
    ),
  },
  {
    href: "/gallery", label: "Gallery", icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8" cy="9" r="1.6" />
        <path d="M21 17l-6-6-4 4-3-3-5 5" />
      </>
    ),
  },
  {
    href: "/about", label: "About Us", icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6" />
        <circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    href: "/faq", label: "FAQ", icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.3 9.8a2.7 2.7 0 1 1 3.9 2.4c-.9.5-1.2 1-1.2 2" />
        <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    href: "/presence", label: "Our Presence", icon: (
      <>
        <path d="M12 21s6.5-6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5 6.5 11 6.5 11z" />
        <circle cx="12" cy="10" r="2.2" />
      </>
    ),
  },
  {
    href: "/contact", label: "Contact", icon: (
      <path d="M5 4h3l1.3 4-1.9 1.9a11 11 0 0 0 5.7 5.7l1.9-1.9 4 1.3v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" fill="currentColor" stroke="none" />
    ),
  },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("ajp-theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      setDark(true);
    }
  }, []);

  function toggleTheme() {
    const goingDark = !dark;
    document.documentElement.setAttribute("data-theme", goingDark ? "dark" : "light");
    localStorage.setItem("ajp-theme", goingDark ? "dark" : "light");
    setDark(goingDark);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header>
      <nav>
        <Link className="brand" href="/" aria-label="AJ Power Solutions home">
          <span className="mk" id="mk">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-icon.webp"
              alt="AJ Power Solutions logo"
              onError={(e) => {
                (e.currentTarget.closest(".mk") as HTMLElement)?.classList.add("nofile");
              }}
            />
            <svg className="fb" width="42" height="42" viewBox="0 0 56 56" aria-hidden="true">
              <path d="M28 3 L49 15 L49 41 L28 53 L7 41 L7 15 Z" fill="none" stroke="#0a3f6e" strokeWidth="3" />
              <path d="M30 15 L19 31 L27 31 L24 43 L37 25 L29 25 Z" fill="#12a150" />
            </svg>
          </span>
          <span className="txt"><b>AJ POWER</b><small>SOLUTIONS</small></span>
        </Link>

        <div className={"navlinks" + (open ? " open" : "")} id="navlinks">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={isActive(l.href) ? "on" : undefined}
            >
              <svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {l.icon}
              </svg>
              <span className="lbl">{l.label}</span>
            </Link>
          ))}
        </div>

        <button className="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode" onClick={toggleTheme}>
          <svg className="i-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: dark ? "none" : "block" }}>
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg className="i-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: dark ? "block" : "none" }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>
          <span></span><span></span><span></span>
        </button>
      </nav>
    </header>
  );
}