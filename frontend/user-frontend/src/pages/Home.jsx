// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Home.css";

// import Hero from "../components/Hero";
// import FeaturedDestinations from "../components/FeaturedDestinations";
// import Packages from "../components/Packages";
// import Categories from "../components/Categories";
// import MapPreview from "../components/MapPreview";
// import WhyChooseUs from "../components/WhyChooseUs";
// import CTA from "../components/CTA";
// import Footer from "../components/Footer";

// const Home = () => {
//   const [packages, setPackages] = useState([]);

//   // VITE_API_URL = "http://localhost:5000/api"
//   const backendURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//   useEffect(() => {
//     axios
//       .get(`${backendURL}/packages`)
//       .then((res) => setPackages(res.data))
//       .catch((err) => console.log("Packages fetch error:", err));
//   }, []);

//   return (
//     <div className="home">
//       <Hero />
//       {/* destinations={[]} since there's no get-all destinations endpoint.
//           Your Destination page handles destinations via region→state drill-down */}
//       <FeaturedDestinations destinations={[]} />
//       <Packages packages={packages} />
//       <Categories />
//       <MapPreview />
//       <WhyChooseUs />
//       <CTA />
//       <Footer />
//     </div>
//   );
// };

// export default Home;
// frontend/src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  fetchRegions,
  fetchAllDestinations,
  fetchFeaturedDestinations,
  fetchAllStates
} from "../api/destinationApi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Data fetchers ─────────────────────────────────────────────────────────────







// ── Stat counter animation ────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || !target) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

// ── Season badge helper ───────────────────────────────────────────────────────
function getSeasonTag(bestTime) {
  if (!bestTime) return null;
  const t = bestTime.toLowerCase();
  if (t.includes("oct") || t.includes("nov") || t.includes("dec") || t.includes("jan") || t.includes("feb"))
    return { label: "Winter", cls: "tag-winter" };
  if (t.includes("mar") || t.includes("apr") || t.includes("may"))
    return { label: "Spring", cls: "tag-spring" };
  if (t.includes("jun") || t.includes("jul") || t.includes("aug") || t.includes("sep"))
    return { label: "Monsoon", cls: "tag-monsoon" };
  return null;
}

// ── Search bar ────────────────────────────────────────────────────────────────
function SearchBar({ destinations, states, onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

 const handleChange = (e) => {
  const val = e.target.value;
  setQuery(val);
  if (val.length < 2) { setSuggestions([]); setOpen(false); return; }
  const q = val.toLowerCase();
  const dests = (destinations || [])
    .filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.state?.toLowerCase?.()?.includes(q) ||
      d.stateName?.toLowerCase?.()?.includes(q)   // ← add stateName check
    )
    .slice(0, 4)
    .map(d => ({ type: "destination", label: d.name, sub: d.stateName || d.state || "India", id: d._id }));

  const sts = (states || [])
    .filter(s => s.name?.toLowerCase().includes(q))
    .slice(0, 2)
    .map(s => ({ type: "state", label: s.name, sub: "State", id: s._id }));

  setSuggestions([...dests, ...sts]);
  setOpen(true);
};

 const handleSelect = (s) => {
  setQuery(s.label);
  setOpen(false);
  if (s.type === "destination") navigate(`/destination-detail/${s.id}`);
  else navigate("/destination");   // Destination.jsx handles state browsing
};

  return (
    <div className="search-wrap" ref={ref}>
      <div className="search-box">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className="search-input"
          placeholder="Search destinations…"
          value={query}
          onChange={handleChange}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
        />
        
      </div>
      {open && suggestions.length > 0 && (
        <div className="search-dropdown">
          {suggestions.map((s, i) => (
            <button key={i} className="search-suggestion" onClick={() => handleSelect(s)}>
              <span className={`suggest-icon ${s.type === "destination" ? "icon-dest" : "icon-state"}`}>
                {s.type === "destination" ? "📍" : "🗺️"}
              </span>
              <span className="suggest-label">{s.label}</span>
              <span className="suggest-sub">{s.sub}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Destination card ──────────────────────────────────────────────────────────
function DestCard({ dest, index }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const season = getSeasonTag(dest.bestTimeToVisit);

  return (
    <article
      className="dest-card"
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={() => navigate(`/destination-detail/${dest._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/destination-detail/${dest._id}`)}
    >
      <div className="dest-card__img-wrap">
        <img
          src={dest.image}
          alt={dest.name}
          className={`dest-card__img ${loaded ? "loaded" : ""}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
        <div className="dest-card__overlay" />
        {season && <span className={`dest-card__season ${season.cls}`}>{season.label}</span>}
      </div>
      <div className="dest-card__body">
        <div className="dest-card__meta">
          <span className="dest-card__state">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {dest.state || "India"}
          </span>
          {dest.bestTimeToVisit && (
            <span className="dest-card__time">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {dest.bestTimeToVisit}
            </span>
          )}
        </div>
        <h3 className="dest-card__name">{dest.name}</h3>
        <p className="dest-card__desc">{dest.description}</p>
        <span className="dest-card__cta">
          View details
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    </article>
  );
}

// ── Region pill card ──────────────────────────────────────────────────────────
function RegionCard({ region, onClick }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button className="region-card" onClick={onClick}>
      <div className="region-card__img-wrap">
        <img
          src={region.image}
          alt={region.name}
          className={`region-card__img ${loaded ? "loaded" : ""}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
        <div className="region-card__overlay" />
      </div>
      <span className="region-card__name">{region.name}</span>
    </button>
  );
}

// ── Stats section ─────────────────────────────────────────────────────────────
function StatsSection({ destCount, stateCount, regionCount }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const dCount = useCountUp(destCount || 200, 1800, visible);
  const sCount = useCountUp(stateCount || 28, 1500, visible);
  const rCount = useCountUp(regionCount || 6, 1200, visible);

  return (
    <div className="stats-row" ref={ref}>
      <div className="stat-item">
        <span className="stat-num">{dCount}+</span>
        <span className="stat-label">Destinations</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-num">{sCount}</span>
        <span className="stat-label">States</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-num">{rCount}</span>
        <span className="stat-label">Regions</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-num">∞</span>
        <span className="stat-label">Memories</span>
      </div>
    </div>
  );
}

// ── Marquee strip ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "Taj Mahal", "Kerala Backwaters", "Rajasthan Forts",
  "Himalayan Peaks", "Goa Beaches", "Varanasi Ghats",
  "Andaman Islands", "Mysore Palace", "Ladakh", "Sundarbans",
];

function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-outer" aria-hidden="true">
      <div className="marquee-inner">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot">✦</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Why India section ─────────────────────────────────────────────────────────
const WHY_CARDS = [
  { icon: "🏛️", title: "Ancient Wonders", desc: "8 UNESCO World Heritage Sites and thousands of years of living civilisation." },
  { icon: "🍛", title: "Culinary Diversity", desc: "Every state has its own cuisine — from fiery Chettinad to delicate Kashmiri wazwan." },
  { icon: "🎭", title: "Festivals & Culture", desc: "A festival almost every day of the year. Color, music, and devotion like nowhere else." },
  { icon: "🏔️", title: "Every Landscape", desc: "Glaciers to beaches, deserts to rainforests — India has it all within its borders." },
];

// ── Main Home component ───────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [allDests, setAllDests] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    Promise.allSettled([
      fetchRegions(),
      fetchFeaturedDestinations(),
      fetchAllDestinations(),
      fetchAllStates(),
    ]).then(([r, f, a, s]) => {
      if (r.status === "fulfilled") setRegions(Array.isArray(r.value) ? r.value : []);
      if (f.status === "fulfilled") setFeatured(Array.isArray(f.value) ? f.value : []);
      if (a.status === "fulfilled") setAllDests(Array.isArray(a.value) ? a.value : []);
      if (s.status === "fulfilled") setStates(Array.isArray(s.value) ? s.value : []);
      setLoading(false);
    });
  }, []);

  // Parallax on hero
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const y = window.scrollY;
      heroRef.current.style.setProperty("--scroll-y", `${y * 0.4}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

 const handleSearch = (q) => {
  navigate("/destination");   // just go to explore page — search within it
};

  return (
    <main className="home">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg-wrap">
          <div className="hero__bg" />
          <div className="hero__grain" />
          <div className="hero__vignette" />
        </div>

        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="hero__dot" />
            Discover India
          </div>
          <h1 className="hero__title">
            Where Every Road<br />
            <em>Tells a Story</em>
          </h1>
          <p className="hero__sub">
            From the snow-capped Himalayas to the sun-kissed shores of Kerala —
            your extraordinary Indian adventure starts here.
          </p>

          <SearchBar
            destinations={allDests}
            states={states}
            onSearch={handleSearch}
          />

          // Replace hero__quick-links section in Home.jsx:
<div className="hero__quick-links">
  {["Beaches", "Mountains", "Heritage", "Wildlife"].map((tag) => (
    <button
      key={tag}
      className="hero__tag"
      onClick={() => navigate("/explore")}   // ← just go to explore
    >
      {tag}
    </button>
  ))}
</div>
        </div>

        <div className="hero__scroll-hint">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="stats-section">
        <div className="container">
          <StatsSection
            destCount={allDests.length || 200}
            stateCount={states.length || 28}
            regionCount={regions.length || 6}
          />
        </div>
      </section>

      {/* ── REGIONS ───────────────────────────────────────────────────────── */}
      {regions.length > 0 && (
        <section className="section regions-section">
          <div className="container">
            <div className="section-head">
              <div className="section-label">Explore by region</div>
              <h2 className="section-title">India's Six Worlds</h2>
              <p className="section-sub">Each region — a different planet</p>
            </div>
            <div className="regions-grid">
              {regions.map((r) => (
                <RegionCard
                key={r._id}
                region={r}
                onClick={() => navigate(`/destination/${r._id}`)}       // ← CORRECT
                />
              ))}
            </div>
            <div className="section-cta">
              <button className="btn-outline" onClick={() => navigate("/destination/${r._id}")}>
                View all regions
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED DESTINATIONS ─────────────────────────────────────────── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-head">
            <div className="section-label">Must-visit places</div>
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-sub">
              Handpicked wonders waiting to be explored
            </p>
          </div>

          {loading ? (
            <div className="dest-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="dest-skeleton" style={{ animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="dest-grid">
              {featured.map((d, i) => <DestCard key={d._id} dest={d} index={i} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>No destinations found.</p>
              <button className="btn-outline" onClick={() => navigate("/destination")}>
                Browse all destinations
              </button>
            </div>
          )}

          <div className="section-cta">
            <button className="btn-primary" onClick={() => navigate("/explore")}>
              Explore all destinations and famous tour packages
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY INDIA ─────────────────────────────────────────────────────── */}
      <section className="section why-section">
        <div className="container">
          <div className="why-inner">
            <div className="why-left">
              <div className="section-label">Why India?</div>
              <h2 className="section-title">One Country,<br />Infinite Stories</h2>
              <p className="why-body">
                India is not just a destination — it's a feeling. Ancient temples
                and modern cities, sacred rivers and neon markets, silence and
                celebration. Wherever you look, there's a story.
              </p>
              <button className="btn-primary" onClick={() => navigate("/explore")}>
                Start Exploring
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
            <div className="why-right">
              {WHY_CARDS.map((c, i) => (
                <div key={i} className="why-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="why-card__icon">{c.icon}</span>
                  <div>
                    <h4 className="why-card__title">{c.title}</h4>
                    <p className="why-card__desc">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP CTA ───────────────────────────────────────────────────────── */}
      <section className="map-cta-section">
        <div className="container">
          <div className="map-cta">
            <div className="map-cta__bg" />
            <div className="map-cta__content">
              <span className="map-cta__eyebrow">Interactive Map</span>
              <h2 className="map-cta__title">Find Destinations<br />Near You</h2>
              <p className="map-cta__sub">
                Use our interactive map to discover what's around you — or plan a trip to the other end of the subcontinent.
              </p>
              <button className="btn-white" onClick={() => navigate("/map")}>
                Open the Map
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}