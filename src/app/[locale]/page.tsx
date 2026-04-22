"use client";

import { use, useState, useEffect, useRef } from "react";
import { translations } from "@/lib/translations";

/* ─── helpers ──────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── real photos from TripAdvisor (Nou Bar Maó) ───────────────────── */
const BASE = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o";
const PHOTOS = {
  // Hero — ample format, ambient del bar
  hero:  `${BASE}/2b/ec/28/ef/caption.jpg?w=1600&h=900&s=1`,
  // About — interior / detall
  about: `${BASE}/2c/6e/c2/c2/caption.jpg?w=800&h=1000&s=1`,
  // Gallery — 6 fotos de l'establiment
  gallery: [
    `${BASE}/2b/ec/28/f0/caption.jpg?w=900&h=900&s=1`,
    `${BASE}/2b/ec/28/f1/caption.jpg?w=900&h=900&s=1`,
    `${BASE}/2b/ec/28/f2/caption.jpg?w=900&h=900&s=1`,
    `${BASE}/2c/07/1c/d7/caption.jpg?w=900&h=900&s=1`,
    `${BASE}/2c/07/1c/d8/caption.jpg?w=900&h=900&s=1`,
    `${BASE}/30/e2/9a/8c/caption.jpg?w=900&h=900&s=1`,
  ],
  // Menu section banner
  menuBg: `${BASE}/31/31/49/59/caption.jpg?w=1400&h=600&s=1`,
};

/* ─── colours (Menorca / Nou Bar palette) ──────────────────────────── */
const C = {
  // Backgrounds
  cream:     "#F5EDE0",   // warm parchment — Menorcan stone walls
  warmWhite: "#FBF6EF",   // lightest cream
  dark:      "#1C1007",   // deep espresso — dark wood
  dark2:     "#2A1A0A",   // slightly lighter espresso
  section:   "#F2E8D8",   // warm sand — alternate sections

  // Accents
  amber:     "#B85C1E",   // cognac / pomada amber
  amberHov:  "#CD6F2E",   // hover lighter
  gold:      "#C99A60",   // Mediterranean golden light
  terra:     "#8B5E3C",   // terracotta / earth

  // Text
  stone:     "#7A5C3E",   // warm stone — body text
  muted:     "#A8866A",   // muted warm tone

  // Borders
  border:    "#DDD0BC",   // sand border
  borderDk:  "rgba(251,246,239,0.1)",
};

/* ─── types ────────────────────────────────────────────────────────── */
interface PageProps {
  params: Promise<{ locale: string }>;
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════════ */
export default function NouBarPage({ params }: PageProps) {
  // React 19: use() unwraps the Promise in a client component
  const { locale: initialLocale } = use(params);

  const [locale, setLocale] = useState(initialLocale);
  const [activeTab, setActiveTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const t = translations[locale as keyof typeof translations] ?? translations.ca;

  const menuData = [
    t.menu.tapes,
    t.menu.entrepans,
    t.menu.ensalades,
    t.menu.postres,
    t.menu.begudes,
  ];

  const mapsUrl = "https://www.google.com/maps/place/Bar+Nou/@39.888971,4.2619561,17z";
  const igUrl   = "https://www.instagram.com/noubarmao/";

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  /* nav link style */
  const navLink: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer",
    fontSize: "0.78rem", fontWeight: 600, color: C.stone,
    letterSpacing: "0.08em", textTransform: "uppercase",
    transition: "color 0.2s", fontFamily: "inherit",
  };

  return (
    <div style={{ background: C.cream, color: C.dark, minHeight: "100vh" }}>

      {/* ══ NAV ════════════════════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 3rem", height: "60px",
        background: `rgba(245,237,224,0.93)`,
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={() => scrollTo("hero")} style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "1.2rem", fontWeight: 600, letterSpacing: "-0.01em",
          color: C.dark, background: "none", border: "none", cursor: "pointer",
        }}>
          Nou Bar
        </button>

        {/* Desktop */}
        <div className="desktop-nav" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {([["about", t.nav.elBar], ["menu", t.nav.carta], ["agenda", t.nav.agenda],
            ["gallery", t.nav.galeria], ["contact", t.nav.trobaNos]] as [string,string][]).map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={navLink}
              onMouseOver={e => (e.currentTarget.style.color = C.amber)}
              onMouseOut={e => (e.currentTarget.style.color = C.stone)}
            >
              {label}
            </button>
          ))}
          <div style={{ display: "flex", gap: "4px", marginLeft: "1rem" }}>
            {(["ca", "es"] as const).map(l => (
              <button key={l} onClick={() => setLocale(l)} style={{
                background: locale === l ? C.amber : "transparent",
                color: locale === l ? "#fff" : C.stone,
                border: `1px solid ${locale === l ? C.amber : C.border}`,
                borderRadius: "4px", padding: "2px 9px",
                fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "0.08em",
                transition: "all 0.2s", fontFamily: "inherit",
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          color: C.dark, fontSize: "1.4rem", lineHeight: 1,
        }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "60px", left: 0, right: 0, zIndex: 99,
          background: C.warmWhite, borderBottom: `1px solid ${C.border}`,
          padding: "1.5rem 2rem 2rem",
          display: "flex", flexDirection: "column", gap: "1.25rem",
        }}>
          {([["about", t.nav.elBar], ["menu", t.nav.carta], ["agenda", t.nav.agenda],
            ["gallery", t.nav.galeria], ["contact", t.nav.trobaNos]] as [string,string][]).map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "1.1rem", fontWeight: 500, color: C.dark,
              textAlign: "left", letterSpacing: "0.01em", fontFamily: "inherit",
            }}>
              {label}
            </button>
          ))}
          <div style={{ display: "flex", gap: "6px" }}>
            {(["ca", "es"] as const).map(l => (
              <button key={l} onClick={() => { setLocale(l); setMenuOpen(false); }} style={{
                background: locale === l ? C.amber : "transparent",
                color: locale === l ? "#fff" : C.stone,
                border: `1px solid ${locale === l ? C.amber : C.border}`,
                borderRadius: "4px", padding: "4px 12px",
                fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
                textTransform: "uppercase", fontFamily: "inherit",
              }}>{l}</button>
            ))}
          </div>
        </div>
      )}

      {/* ══ HERO ═══════════════════════════════════════════════════ */}
      <section id="hero" style={{
        minHeight: "100svh", background: C.dark2,
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end", padding: "0 3rem 6rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* Real photo background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTOS.hero} alt="Nou Bar Maó" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          opacity: 0.35,
        }} />
        {/* Dark gradient over photo */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(to top, rgba(26,16,7,0.98) 0%, rgba(26,16,7,0.55) 45%, rgba(26,16,7,0.2) 100%)
          `,
        }} />

        <div style={{ maxWidth: "700px", position: "relative", zIndex: 1 }}>
          <p style={{
            color: C.gold, fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1.75rem",
          }}>
            {t.hero.eyebrow}
          </p>
          <h1 style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(3.5rem, 8.5vw, 6.5rem)",
            fontWeight: 600, color: C.warmWhite,
            lineHeight: 1.05, marginBottom: "1.75rem",
            whiteSpace: "pre-line", letterSpacing: "-0.02em",
          }}>
            {t.hero.title}
          </h1>
          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "rgba(251,246,239,0.62)", lineHeight: 1.7,
            maxWidth: "460px", marginBottom: "3rem",
          }}>
            {t.hero.subtitle}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("menu")} style={{
              background: C.amber, color: "#fff", border: "none",
              borderRadius: "100px", padding: "0.85rem 2.25rem",
              fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
              letterSpacing: "0.02em", fontFamily: "inherit",
              transition: "background 0.2s",
            }}
              onMouseOver={e => (e.currentTarget.style.background = C.amberHov)}
              onMouseOut={e => (e.currentTarget.style.background = C.amber)}
            >
              {t.hero.ctaMenu}
            </button>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{
              background: "transparent", color: "rgba(251,246,239,0.75)",
              border: "1px solid rgba(251,246,239,0.22)", borderRadius: "100px",
              padding: "0.85rem 2.25rem", fontSize: "0.875rem", fontWeight: 500,
              cursor: "pointer", letterSpacing: "0.02em", textDecoration: "none",
              display: "inline-block", transition: "border-color 0.2s, color 0.2s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(251,246,239,0.55)"; e.currentTarget.style.color = C.warmWhite; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(251,246,239,0.22)"; e.currentTarget.style.color = "rgba(251,246,239,0.75)"; }}
            >
              {t.hero.ctaLocation}
            </a>
          </div>
        </div>

        {/* Scroll line */}
        <div style={{
          position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
          width: "1px", height: "52px",
          background: `linear-gradient(to bottom, transparent, rgba(201,154,96,0.4))`,
        }} />
      </section>

      {/* ══ ABOUT ══════════════════════════════════════════════════ */}
      <section id="about" style={{ padding: "8rem 3rem", background: C.warmWhite }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <p style={{
              color: C.amber, fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1rem",
            }}>
              {t.about.eyebrow}
            </p>
          </FadeIn>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: "5rem", alignItems: "start",
          }}>
            <div>
              <FadeIn delay={0.06}>
                <h2 style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(1.9rem, 3.5vw, 2.7rem)",
                  color: C.dark, marginBottom: "1.75rem",
                }}>
                  {t.about.title}
                </h2>
              </FadeIn>
              <FadeIn delay={0.12}>
                <p style={{ color: C.stone, lineHeight: 1.8, marginBottom: "1.1rem", fontSize: "1.05rem" }}>
                  {t.about.description}
                </p>
                <p style={{ color: C.stone, lineHeight: 1.8, fontSize: "1.05rem" }}>
                  {t.about.p2}
                </p>
              </FadeIn>
            </div>
            <div>
              {/* Photo + stats */}
              <FadeIn delay={0.05}>
                <div style={{
                  borderRadius: "10px", overflow: "hidden",
                  marginBottom: "2rem", aspectRatio: "4/3",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHOTOS.about} alt="Interior del Nou Bar"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </FadeIn>
              {([[t.about.stat1Val, t.about.stat1Label], [t.about.stat2Val, t.about.stat2Label], [t.about.stat3Val, t.about.stat3Label]] as [string,string][]).map(([val, label], i) => (
                <FadeIn key={i} delay={0.1 + i * 0.09}>
                  <div style={{
                    padding: "1.75rem 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      fontSize: "clamp(2rem, 4.5vw, 2.75rem)",
                      fontWeight: 600, color: C.amber, display: "block", marginBottom: "0.3rem",
                    }}>{val}</span>
                    <span style={{
                      fontSize: "0.75rem", fontWeight: 700, color: C.muted,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                    }}>{label}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MENU ═══════════════════════════════════════════════════ */}
      <section id="menu" style={{ padding: "8rem 3rem", background: C.dark, position: "relative", overflow: "hidden" }}>
        {/* subtle food photo bg */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTOS.menuBg} alt="" aria-hidden style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top",
          opacity: 0.07, pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <p style={{
              color: C.gold, fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1rem",
            }}>{t.menu.eyebrow}</p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h2 style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.9rem, 3.5vw, 2.7rem)",
              color: C.warmWhite, marginBottom: "3rem",
            }}>{t.menu.title}</h2>
          </FadeIn>

          {/* Tabs */}
          <FadeIn delay={0.1}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              {t.menu.tabs.map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{
                  padding: "0.55rem 1.5rem",
                  background: activeTab === i ? C.amber : "rgba(245,237,224,0.06)",
                  color: activeTab === i ? "#fff" : "rgba(251,246,239,0.5)",
                  border: `1px solid ${activeTab === i ? C.amber : "rgba(245,237,224,0.12)"}`,
                  borderRadius: "100px", fontSize: "0.85rem", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  letterSpacing: "0.03em", fontFamily: "inherit",
                }}>
                  {tab}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Items grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
            border: `1px solid rgba(245,237,224,0.07)`,
          }}>
            {menuData[activeTab]?.map((item, i) => (
              <div key={i} style={{
                padding: "1.5rem 1.75rem",
                borderRight: `1px solid rgba(245,237,224,0.07)`,
                borderBottom: `1px solid rgba(245,237,224,0.07)`,
                transition: "background 0.2s",
                cursor: "default",
              }}
                onMouseOver={e => (e.currentTarget.style.background = "rgba(184,92,30,0.1)")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}
              >
                <p style={{ fontWeight: 600, color: C.warmWhite, marginBottom: "0.3rem", fontSize: "0.975rem" }}>
                  {item.name}
                </p>
                <p style={{ fontSize: "0.83rem", color: "rgba(251,246,239,0.42)", lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ POMADA ═════════════════════════════════════════════════ */}
      <section style={{
        padding: "8rem 3rem", background: C.amber, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(ellipse 75% 65% at 90% 50%, rgba(255,255,255,0.07) 0%, transparent 55%)`,
        }} />
        <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <p style={{
              color: "rgba(255,255,255,0.65)", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1.25rem",
            }}>{t.pomada.eyebrow}</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(3.5rem, 9vw, 6rem)",
              fontWeight: 600, fontStyle: "italic",
              color: "#fff", marginBottom: "1.5rem", letterSpacing: "-0.03em",
            }}>{t.pomada.title}</h2>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p style={{
              fontSize: "clamp(1rem, 2vw, 1.125rem)", color: "rgba(255,255,255,0.82)",
              lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 2.5rem",
            }}>{t.pomada.description}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.22)", paddingTop: "2rem" }}>
              <p style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "1.3rem", fontStyle: "italic",
                color: "rgba(255,255,255,0.88)", marginBottom: "0.5rem",
              }}>"{t.pomada.quote}"</p>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
                {t.pomada.quoteAttr}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ AGENDA ═════════════════════════════════════════════════ */}
      <section id="agenda" style={{ padding: "8rem 3rem", background: C.section }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <p style={{
              color: C.amber, fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1rem",
            }}>{t.agenda.eyebrow}</p>
          </FadeIn>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
            gap: "3rem", alignItems: "end", marginBottom: "4rem",
          }}>
            <FadeIn delay={0.06}>
              <h2 style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.9rem, 3.5vw, 2.7rem)", color: C.dark,
              }}>{t.agenda.title}</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p style={{ color: C.stone, lineHeight: 1.75, fontSize: "1.05rem" }}>
                {t.agenda.subtitle}
              </p>
            </FadeIn>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
            gap: "1.25rem", marginBottom: "3rem",
          }}>
            {t.agenda.events.map((ev, i) => (
              <FadeIn key={i} delay={0.06 + i * 0.09}>
                <div style={{
                  background: C.warmWhite, borderRadius: "10px",
                  padding: "1.75rem", height: "100%",
                  border: `1px solid ${C.border}`,
                  transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseOver={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = C.amber;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = `0 8px 28px rgba(184,92,30,0.14)`;
                  }}
                  onMouseOut={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = C.border;
                    el.style.transform = "none";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: C.amber, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {ev.day}
                    </span>
                    <span style={{
                      fontSize: "0.68rem", background: C.section, color: C.muted,
                      padding: "3px 10px", borderRadius: "100px", fontWeight: 600,
                    }}>{ev.tag}</span>
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "1.3rem", color: C.dark, marginBottom: "0.7rem",
                  }}>{ev.title}</h3>
                  <p style={{ color: C.stone, lineHeight: 1.65, fontSize: "0.92rem" }}>{ev.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div style={{ textAlign: "center" }}>
              <a href={igUrl} target="_blank" rel="noopener noreferrer" style={{
                color: C.amber, fontWeight: 700, fontSize: "0.9rem",
                textDecoration: "none", letterSpacing: "0.04em",
                borderBottom: "1px solid transparent", transition: "border-color 0.2s",
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
              }}
                onMouseOver={e => (e.currentTarget.style.borderColor = C.amber)}
                onMouseOut={e => (e.currentTarget.style.borderColor = "transparent")}
              >
                ↗ {t.agenda.igCta}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ GALLERY ════════════════════════════════════════════════ */}
      <section id="gallery" style={{ padding: "8rem 3rem", background: C.warmWhite }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <p style={{
              color: C.amber, fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1rem",
            }}>{t.gallery.eyebrow}</p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h2 style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.9rem, 3.5vw, 2.7rem)", color: C.dark, marginBottom: "3rem",
            }}>{t.gallery.title}</h2>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}>
            {t.gallery.labels.map((label, i) => {
              const tall = i === 0 || i === 5;
              return (
                <FadeIn key={i} delay={i * 0.06}>
                  <div style={{
                    borderRadius: "8px",
                    aspectRatio: tall ? "2/3" : "4/3",
                    minHeight: tall ? "320px" : "160px",
                    display: "flex", flexDirection: "column",
                    justifyContent: "flex-end", padding: "1.25rem",
                    position: "relative", overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
                    background: C.dark,
                  }}
                    onMouseOver={e => { e.currentTarget.style.transform = "scale(1.025)"; e.currentTarget.style.boxShadow = `0 10px 40px rgba(28,16,7,0.3)`; }}
                    onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {/* Real photo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PHOTOS.gallery[i]} alt={label} style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%",
                      objectFit: "cover", objectPosition: "center",
                    }} />
                    {/* Gradient overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(20,10,3,0.75) 0%, rgba(20,10,3,0.1) 55%)",
                    }} />
                    <span style={{
                      position: "relative", zIndex: 1,
                      fontSize: "0.75rem", fontWeight: 600,
                      color: "rgba(251,246,239,0.85)", letterSpacing: "0.04em",
                      textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                    }}>{label}</span>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.4}>
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <a href={igUrl} target="_blank" rel="noopener noreferrer" style={{
                color: C.amber, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
                borderBottom: "1px solid transparent", transition: "border-color 0.2s",
              }}
                onMouseOver={e => (e.currentTarget.style.borderColor = C.amber)}
                onMouseOut={e => (e.currentTarget.style.borderColor = "transparent")}
              >
                ↗ @noubarmao
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ CONTACT ════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: "8rem 3rem", background: C.dark }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <p style={{
              color: C.gold, fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1rem",
            }}>{t.contact.eyebrow}</p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h2 style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.9rem, 3.5vw, 2.7rem)",
              color: C.warmWhite, marginBottom: "4rem",
            }}>{t.contact.title}</h2>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "4rem",
          }}>
            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {[
                { label: "Adreça", content: t.contact.address, link: mapsUrl, linkLabel: `↗ ${t.contact.mapCta}` },
                { label: "Telèfon", content: t.contact.phone, link: `tel:${t.contact.phone}`, linkLabel: null },
                { label: "Instagram", content: null, link: igUrl, linkLabel: t.contact.igCta, amber: true },
              ].map(({ label, content, link, linkLabel, amber }, i) => (
                <FadeIn key={i} delay={0.1 + i * 0.07}>
                  <div>
                    <p style={{
                      fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em",
                      textTransform: "uppercase", color: "rgba(251,246,239,0.35)", marginBottom: "0.7rem",
                    }}>{label}</p>
                    {content && (
                      <p style={{ fontSize: "1rem", color: "rgba(251,246,239,0.8)", lineHeight: 1.65, whiteSpace: "pre-line", marginBottom: "0.5rem" }}>
                        {content}
                      </p>
                    )}
                    {linkLabel && (
                      <a href={link} target={link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{
                        color: amber ? C.gold : C.amber, fontWeight: 700, fontSize: "0.875rem",
                        textDecoration: "none", letterSpacing: "0.02em",
                      }}>
                        {linkLabel}
                      </a>
                    )}
                  </div>
                </FadeIn>
              ))}

              <FadeIn delay={0.32}>
                <div style={{
                  background: "rgba(184,92,30,0.1)", borderRadius: "8px",
                  padding: "1rem 1.25rem", border: `1px solid rgba(184,92,30,0.2)`,
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(251,246,239,0.55)", lineHeight: 1.65, fontStyle: "italic" }}>
                    {t.contact.note}
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Hours + Map */}
            <FadeIn delay={0.12}>
              <div>
                <p style={{
                  fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(251,246,239,0.35)", marginBottom: "1.25rem",
                }}>Horari</p>
                <div style={{ marginBottom: "2.5rem" }}>
                  {t.contact.hours.map((h, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "0.9rem 0",
                      borderBottom: i < t.contact.hours.length - 1 ? `1px solid rgba(251,246,239,0.07)` : "none",
                    }}>
                      <span style={{ fontSize: "0.925rem", color: "rgba(251,246,239,0.55)" }}>{h.day}</span>
                      <span style={{ fontSize: "0.925rem", fontWeight: 600, color: C.warmWhite }}>{h.time}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid rgba(251,246,239,0.08)` }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d816.0!2d4.264531!3d39.888971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1295879a7330a267%3A0x23f3dd53a8c0416d!2sBar%20Nou!5e0!3m2!1sen!2ses!4v1"
                    width="100%" height="210"
                    style={{ border: 0, display: "block", filter: "invert(0.88) hue-rotate(180deg) saturate(0.85)" }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Nou Bar Maó"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════════ */}
      <footer style={{
        padding: "2.5rem 3rem", background: "#0F0A04",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "0.6rem", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "1.05rem", color: "rgba(251,246,239,0.5)", letterSpacing: "0.02em",
        }}>{t.footer.tagline}</p>
        <p style={{ fontSize: "0.72rem", color: "rgba(251,246,239,0.25)", letterSpacing: "0.06em" }}>
          {t.footer.copy}
        </p>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
          {[["Instagram", igUrl], ["Google Maps", mapsUrl]].map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{
              fontSize: "0.75rem", color: "rgba(251,246,239,0.28)", textDecoration: "none",
              letterSpacing: "0.07em", transition: "color 0.2s",
            }}
              onMouseOver={e => (e.currentTarget.style.color = C.gold)}
              onMouseOut={e => (e.currentTarget.style.color = "rgba(251,246,239,0.28)")}
            >{label}</a>
          ))}
        </div>
      </footer>

      {/* ══ Responsive CSS ═════════════════════════════════════════ */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-btn  { display: flex !important; }
          section { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          nav { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          footer { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          div[style*="gridTemplateColumns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
