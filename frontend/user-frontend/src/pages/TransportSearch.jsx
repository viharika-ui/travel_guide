import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./TransportSearch.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TABS = [
  { key: "flight", label: "Flights", icon: "✈️" },
  { key: "train",  label: "Trains",  icon: "🚆" },
  { key: "bus",    label: "Buses",   icon: "🚌" },
  { key: "ferry",  label: "Ferry",   icon: "⛴️" },
];

export default function TransportSearch() {
  const navigate     = useNavigate();
  const [params]     = useSearchParams();
  const { t }        = useTranslation();

  const packageId    = params.get("packageId");
  const packageTitle = params.get("packageTitle");
  const destBookingId = params.get("destBookingId");
  const destName     = params.get("destName");
  const destination  = params.get("destination") || destName || "";

  const [origin,      setOrigin]      = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg,    setShowSugg]    = useState(false);
  const [date,        setDate]        = useState(new Date().toISOString().split("T")[0]);
  const [results,     setResults]     = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [activeTab,   setActiveTab]   = useState("flight");
  const inputRef = useRef(null);

  useEffect(() => {
    if (origin.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/flights/airports?q=${encodeURIComponent(origin)}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSugg(true);
      } catch { setSuggestions([]); }
    }, 250);
    return () => clearTimeout(timer);
  }, [origin]);

  async function handleSearch() {
    if (!origin.trim()) { alert(t('bookingPage.selectDate')); return; }
    setLoading(true); setError(null); setResults(null);
    try {
      const res = await fetch(
        `${API_BASE}/flights/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}`
      );
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Search failed"); }
      const data = await res.json();
      setResults(data);
      if (data.flights?.length)      setActiveTab("flight");
      else if (data.trains?.length)  setActiveTab("train");
      else if (data.buses?.length)   setActiveTab("bus");
      else if (data.ferries?.length) setActiveTab("ferry");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(item) {
    const transport = {
      type:     item.type,
      price:    item.price,
      dep:      item.departure,
      arr:      item.arrival,
      dur:      item.duration,
      class:    item.class,
      provider: item.airline || item.trainName || item.busOperator || item.ferryOperator || "",
      number:   item.flightNumber || item.trainNumber || "",
    };
    if (destBookingId) {
      navigate(`/destination-booking/${destBookingId}`, { state: { selectedTransport: transport } });
    } else if (packageId) {
      navigate(`/booking/${packageId}`, { state: { selectedTransport: transport } });
    } else {
      navigate(-1);
    }
  }

  function getTabItems() {
    if (!results) return [];
    switch (activeTab) {
      case "flight": return results.flights  || [];
      case "train":  return results.trains   || [];
      case "bus":    return results.buses    || [];
      case "ferry":  return results.ferries  || [];
      default:       return [];
    }
  }

  function getTabCount(key) {
    if (!results) return 0;
    switch (key) {
      case "flight": return results.flights?.length  || 0;
      case "train":  return results.trains?.length   || 0;
      case "bus":    return results.buses?.length    || 0;
      case "ferry":  return results.ferries?.length  || 0;
      default:       return 0;
    }
  }

  const items = getTabItems();

  return (
    <div className="ts-page">
      <div className="ts-header">
        <button className="ts-back-btn" onClick={() => navigate(-1)}>{t('transport.back')}</button>
        <div className="ts-header__text">
          <p className="ts-header__label">{t('transport.label')}</p>
          <h1 className="ts-header__title">
            {t('transport.howReaching')} <span>{destination}</span>?
          </h1>
          {(packageTitle || destName) && (
            <p className="ts-header__sub">{t('transport.for')} {packageTitle || destName}</p>
          )}
        </div>
      </div>

      <div className="ts-search-bar">
        <div className="ts-search-row">
          <div className="ts-field ts-field--origin" ref={inputRef}>
            <label className="ts-label">{t('transport.from')}</label>
            <input
              className="ts-form__input"
              placeholder={t('transport.boardingCity')}
              value={origin}
              onChange={(e) => { setOrigin(e.target.value); setShowSugg(true); }}
              onBlur={() => setTimeout(() => setShowSugg(false), 180)}
            />
            {showSugg && suggestions.length > 0 && (
              <div className="ts-suggestions">
                {suggestions.map((s) => (
                  <div key={s.code} className="ts-suggestions__item"
                    onMouseDown={() => { setOrigin(s.city); setShowSugg(false); }}>
                    <span className="ts-suggestions__code">{s.code}</span>
                    <span className="ts-suggestions__city">{s.city}</span>
                    <span className="ts-suggestions__name">{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ts-field ts-field--dest">
            <label className="ts-label">{t('transport.to')}</label>
            <input className="ts-form__input ts-form__input--readonly" value={destination} readOnly />
          </div>

          <div className="ts-field ts-field--date">
            <label className="ts-label">{t('transport.date')}</label>
            <input type="date" className="ts-form__input" value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)} />
          </div>

          <button className="ts-form__btn" onClick={handleSearch} disabled={loading}>
            {loading ? <span className="ts-btn-spinner" /> : t('transport.search')}
          </button>
        </div>
      </div>

      {error && (
        <div className="ts-error">
          <p>⚠️ {error}</p>
          <p className="ts-error__hint">{t('transport.errorHint')}</p>
        </div>
      )}

      {results && (
        <div className="ts-results">
          <div className="ts-tabs">
            {TABS.map((tab) => {
              const count = getTabCount(tab.key);
              return (
                <button key={tab.key}
                  className={`ts-tab${activeTab === tab.key ? " active" : ""}${count === 0 ? " disabled" : ""}`}
                  onClick={() => count > 0 && setActiveTab(tab.key)}>
                  <span className="ts-tab__icon">{tab.icon}</span>
                  <span className="ts-tab__label">{tab.label}</span>
                  {count > 0 && <span className="ts-tab__count">{count}</span>}
                </button>
              );
            })}
          </div>

          <div className="ts-route-info">
            <span className="ts-route-info__from">{results.origin?.city || origin}</span>
            <span className="ts-route-info__arrow">→</span>
            <span className="ts-route-info__to">{results.destination?.city || destination}</span>
            <span className="ts-route-info__date">
              {new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="ts-empty">
              <p>{t('transport.noOptions')}</p>
              <p className="ts-empty__hint">{t('transport.noOptionsHint')}</p>
            </div>
          ) : (
            <div className="ts-cards">
              {items.map((item) => (
                <TransportCard key={item.id} item={item} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </div>
      )}

      {!results && !loading && !error && (
        <div className="ts-idle">
          <div className="ts-idle__icons">✈️ 🚆 🚌 ⛴️</div>
          <p>{t('transport.idleText')}</p>
        </div>
      )}
    </div>
  );
}

function TransportCard({ item, onSelect }) {
  const { t } = useTranslation();
  const icons = { flight: "✈️", train: "🚆", bus: "🚌", ferry: "⛴️" };
  const providerName = item.airline || item.trainName || item.busOperator || item.ferryOperator || "Transport";
  const providerSub  = item.flightNumber || item.trainNumber || item.busType || item.vesselName || "";

  return (
    <div className="ts-card">
      <div className="ts-card__left">
        <span className="ts-card__icon">{icons[item.type]}</span>
        <div className="ts-card__provider">
          <p className="ts-card__name">{providerName}</p>
          {providerSub && <p className="ts-card__sub">{providerSub}</p>}
        </div>
      </div>
      <div className="ts-card__timing">
        <span className="ts-card__time">{item.departure}</span>
        <div className="ts-card__line">
          <span className="ts-card__dur">{item.duration}</span>
          <div className="ts-card__dash" />
        </div>
        <span className="ts-card__time">{item.arrival}</span>
      </div>
      <div className="ts-card__class">
        <p className="ts-card__class-name">{item.class}</p>
        {item.seatsLeft <= 10 && (
          <p className="ts-card__seats">{item.seatsLeft} {t('transport.seatsLeft')}</p>
        )}
      </div>
      <div className="ts-card__right">
        <p className="ts-card__price">₹{item.price?.toLocaleString("en-IN")}</p>
        <p className="ts-card__per">{t('transport.perPerson')}</p>
        <button className="ts-card__btn" onClick={() => onSelect(item)}>{t('transport.select')}</button>
      </div>
    </div>
  );
}