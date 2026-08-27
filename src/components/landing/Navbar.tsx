"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const links = [
  ["Platform", "#platform"],
  ["Intelligence", "#intelligence"],
  ["Assessment OS", "#assessment"],
  ["Security", "#security"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUserEmail(user?.email ?? null);
        setLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUserEmail(session?.user?.email ?? null);
          setLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();

    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (
    <header className="site-nav">
      <div className="nav-shell">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <span>G</span>
          </span>
          GEMLOTUS AI
        </Link>

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

          {!loading && userEmail ? (
            <>
              <Link href="/profile" className="nav-contact">
                Profile
              </Link>

              <Link
                href="/assessment"
                className="btn btn-orange"
              >
                Assessment
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="nav-contact"
              >
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link href="/login" className="nav-contact">
                Login
              </Link>

              <Link
                href="/signup"
                className="btn btn-orange"
              >
                Sign Up
              </Link>
            </>
          ) : null}

          <button
            type="button"
            className="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
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

          {!loading && userEmail ? (
            <>
              <Link
                href="/profile"
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
                Profile
              </Link>

              <Link
                href="/assessment"
                onClick={() => setOpen(false)}
                className="btn btn-orange"
                style={{
                  width: "100%",
                  marginTop: 7,
                }}
              >
                Start Assessment
              </Link>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="btn"
                style={{
                  width: "100%",
                  marginTop: 7,
                  color: "rgba(255,255,255,.78)",
                }}
              >
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/login"
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
                Login
              </Link>

              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="btn btn-orange"
                style={{
                  width: "100%",
                  marginTop: 7,
                }}
              >
                Create Account
              </Link>
            </>
          ) : null}
        </div>
      )}
    </header>
  );
}
