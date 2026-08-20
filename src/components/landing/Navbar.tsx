"use client";

import { useState } from "react";

const links = [
  ["Platform", "#platform"],
  ["Intelligence", "#intelligence"],
  ["Assessment OS", "#assessment"],
  ["Security", "#security"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="nav-shell">
        <a href="#" className="brand">
          <span className="brand-mark">
            <span>G</span>
          </span>
          GEMLOTUS AI
        </a>

        <nav className="nav-links">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a href="#contact" className="nav-contact">
            Contact
          </a>

          <a href="#platform" className="btn btn-orange">
            Explore Platform
          </a>

          <button
            className="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div
          style={{
            marginTop: 8,
            padding: 12,
            borderRadius: 18,
            background: "#081d3d",
            border: "1px solid rgba(255,255,255,.1)",
            boxShadow: "0 20px 50px rgba(0,0,0,.25)",
          }}
        >
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "13px 12px",
                color: "rgba(255,255,255,.78)",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 9,
              }}
            >
              {label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn btn-orange"
            style={{ width: "100%", marginTop: 7 }}
          >
            Contact GemLotus
          </a>
        </div>
      )}
    </header>
  );
}