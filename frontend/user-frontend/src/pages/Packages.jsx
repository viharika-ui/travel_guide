import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchPackages, fetchPackageById } from "../api/packageApi";
import "./Packages.css";

const CATEGORIES = ["All", "Heritage", "Nature", "Beach", "Adventure", "Spiritual", "Cultural"];

export default function Packages() {
  const [packages,     setPackages]     = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPkg,  setSelectedPkg]  = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPackages();
        setPackages(data);
        setFiltered(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setFiltered(
      activeFilter === "All"
        ? packages
        : packages.filter((p) => p.category === activeFilter)
    );
  }, [activeFilter, packages]);

  const openDetail = async (pkg) => {
    try {
      const full = await fetchPackageById(pkg._id);
      setSelectedPkg(full);
    } catch {
      setSelectedPkg(pkg);
    }
  };

  return (
    <div className="pkg-page">
      <div className="pkg-hero">
        <p className="pkg-hero-label">{t('packages.curatedLabel')}</p>
        <h1 className="pkg-hero-title">{t('packages.heroTitle')}</h1>
        <p className="pkg-hero-sub">{t('packages.heroSub')}</p>
      </div>

      <div className="pkg-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`pkg-filter-btn${activeFilter === cat ? " active" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat === "All" ? t('packages.all') : cat}
          </button>
        ))}
      </div>

      {loading && <SkeletonGrid />}

      {!loading && error && (
        <div className="pkg-error">
          <p>{t('packages.error')}</p>
          <button onClick={() => window.location.reload()}>{t('packages.retry')}</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="pkg-empty">{t('packages.noPackages')}</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="pkg-grid">
          {filtered.map((pkg, i) => (
            <PackageCard key={pkg._id} pkg={pkg} index={i} onClick={() => openDetail(pkg)} />
          ))}
        </div>
      )}

      {selectedPkg && (
        <PackageDetail pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      )}
    </div>
  );
}

function PackageCard({ pkg, index, onClick }) {
  const { t } = useTranslation();
  return (
    <article
      className="pkg-card"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={onClick}
    >
      <div className="pkg-card__img-wrap">
        <img src={pkg.image} alt={pkg.title} className="pkg-card__img" loading="lazy" />
        <div className="pkg-card__overlay" />
        {pkg.category && <span className="pkg-card__tag">{pkg.category}</span>}
      </div>
      <div className="pkg-card__body">
        <div className="pkg-card__meta">
          <span className="pkg-card__location">
            <PinIcon /> {pkg.city}, {pkg.state}
          </span>
          <span className="pkg-card__rating">
            ★ {pkg.rating}
            <span className="pkg-card__reviews"> ({pkg.reviewCount})</span>
          </span>
        </div>
        <h2 className="pkg-card__title">{pkg.title}</h2>
        <p className="pkg-card__desc">{pkg.description}</p>
        <div className="pkg-card__footer">
          <div className="pkg-card__duration">
            <ClockIcon /> {pkg.days}D / {pkg.nights}N
          </div>
          <div className="pkg-card__price">
            <span className="pkg-card__from">{t('packages.from')}</span>
            <span className="pkg-card__amount">₹{pkg.price.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <button className="pkg-card__btn">{t('packages.viewDetails')}</button>
      </div>
    </article>
  );
}

function PackageDetail({ pkg, onClose }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeImg, setActiveImg] = useState(0);
  const images = pkg.images?.length ? pkg.images : [pkg.image];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBook = () => {
    onClose();
    navigate(`/booking/${pkg._id}`, { state: { package: pkg } });
  };

  return (
    <div className="pkg-modal-backdrop" onClick={onClose}>
      <div className="pkg-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pkg-modal__close" onClick={onClose}>✕</button>

        <div className="pkg-modal__gallery">
          <img src={images[activeImg]} alt={pkg.title} className="pkg-modal__main-img" />
          {images.length > 1 && (
            <div className="pkg-modal__thumbs">
              {images.map((img, i) => (
                <img key={i} src={img} alt=""
                  className={`pkg-modal__thumb${activeImg === i ? " active" : ""}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="pkg-modal__content">
          <div className="pkg-modal__header">
            <div>
              {pkg.category && <span className="pkg-modal__tag">{pkg.category}</span>}
              <h2 className="pkg-modal__title">{pkg.title}</h2>
              <p className="pkg-modal__location"><PinIcon /> {pkg.city}, {pkg.state}</p>
            </div>
            <div className="pkg-modal__price-block">
              <span className="pkg-modal__price">₹{pkg.price.toLocaleString("en-IN")}</span>
              <span className="pkg-modal__per">{t('packages.perPerson')}</span>
              <span className="pkg-modal__duration">{pkg.days}D / {pkg.nights}N</span>
            </div>
          </div>

          <p className="pkg-modal__desc">{pkg.description}</p>

          {pkg.highlights?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">{t('packages.highlights')}</h3>
              <ul className="pkg-modal__highlights">
                {pkg.highlights.map((h, i) => (
                  <li key={i}><span className="pkg-modal__check">✓</span>{h}</li>
                ))}
              </ul>
            </section>
          )}

          {pkg.itinerary?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">{t('packages.itinerary')}</h3>
              <ol className="pkg-modal__itinerary">
                {pkg.itinerary.map((day, i) => (
                  <li key={i}><span className="pkg-modal__day-dot" />{day}</li>
                ))}
              </ol>
            </section>
          )}

          {pkg.included?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">{t('packages.included')}</h3>
              <ul className="pkg-modal__included">
                {pkg.included.map((item, i) => (
                  <li key={i}><span>✔</span>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {pkg.hotels?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">{t('packages.hotels')}</h3>
              <div className="pkg-modal__cards-row">
                {pkg.hotels.map((h, i) => (
                  <div key={i} className="pkg-modal__info-card">
                    <span className="pkg-modal__info-icon">🏨</span>
                    <div>
                      <p className="pkg-modal__info-name">{h.name}</p>
                      <p className="pkg-modal__info-sub">
                        {h.type} · ₹{h.pricePerNight?.toLocaleString("en-IN")}/{t('packages.nightRate')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {pkg.transport?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">{t('packages.transport')}</h3>
              <div className="pkg-modal__cards-row">
                {pkg.transport.map((tr, i) => (
                  <div key={i} className="pkg-modal__info-card">
                    <span className="pkg-modal__info-icon">
                      {tr.type === "Flight" ? "✈️" : tr.type === "Train" ? "🚆" : tr.type === "Ferry" ? "⛴️" : "🚌"}
                    </span>
                    <div>
                      <p className="pkg-modal__info-name">{tr.type} — {tr.provider}</p>
                      <p className="pkg-modal__info-sub">₹{tr.price?.toLocaleString("en-IN")} {t('packages.perPerson')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {pkg.guideAvailable && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">{t('packages.guideTitle')}</h3>
              <div className="pkg-modal__guide-badge">
                <span>🧭</span>
                <div>
                  <p className="pkg-modal__info-name">{t('packages.guideAvailable')}</p>
                  {pkg.guideLanguages?.length > 0 && (
                    <p className="pkg-modal__info-sub">
                      {t('packages.guideLanguages')}: {pkg.guideLanguages.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          <button className="pkg-modal__book-btn" onClick={handleBook}>
            {t('packages.bookThis')}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="pkg-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="pkg-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}