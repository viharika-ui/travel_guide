import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./DestinationDetail.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/destinations/detail/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(t("destinationDetail.notFound"));
        return r.json();
      })
      .then((data) => {
        setDest(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id, t]);

  if (loading)
    return (
      <div className="dd-loading">
        <div className="dd-spinner" />
        <p>{t("destinationDetail.loading")}</p>
      </div>
    );

  if (error || !dest)
    return (
      <div className="dd-error">
        <p>{error || t("destinationDetail.notFound")}</p>
        <button onClick={() => navigate("/destination")}>
          ← {t("common.back")}
        </button>
      </div>
    );

  return (
    <div className="dd-page">
      {/* Hero */}
      <div className="dd-hero">
        <div className={`dd-hero__img-wrap ${imgLoaded ? "loaded" : ""}`}>
          <img
            src={dest.image}
            alt={dest.name}
            className="dd-hero__img"
            onLoad={() => setImgLoaded(true)}
          />
          <div className="dd-hero__gradient" />
        </div>

        <button className="dd-back-btn" onClick={() => navigate(-1)}>
          ← {t("common.back")}
        </button>

        <div className="dd-hero__content">
          <div className="dd-hero__badge">
            {dest.state || t("destinationDetail.india")}
          </div>

          <h1 className="dd-hero__title">{dest.name}</h1>

          {dest.bestTimeToVisit && (
            <div className="dd-hero__time">
              {t("destinationPage.bestTime")}{" "}
              <strong>{dest.bestTimeToVisit}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="dd-body">
        <div className="dd-body__left">
          <section className="dd-section">
            <h2 className="dd-section__title">
              {t("destinationDetail.about")}
            </h2>
            <p className="dd-section__text">{dest.description}</p>
          </section>

          {dest.highlights?.length > 0 && (
            <section className="dd-section">
              <h2 className="dd-section__title">
                {t("packages.highlights")}
              </h2>

              <ul className="dd-highlights">
                {dest.highlights.map((h, i) => (
                  <li key={i} className="dd-highlights__item">
                    <span className="dd-highlights__dot" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="dd-section dd-facts">
            <h2 className="dd-section__title">
              {t("destinationDetail.quickFacts")}
            </h2>

            <div className="dd-facts__grid">
              {dest.bestTimeToVisit && (
                <div className="dd-fact">
                  <span className="dd-fact__icon">🗓️</span>
                  <div>
                    <p className="dd-fact__label">
                      {t("destinationDetail.bestTime")}
                    </p>
                    <p className="dd-fact__value">{dest.bestTimeToVisit}</p>
                  </div>
                </div>
              )}

              {dest.state && (
                <div className="dd-fact">
                  <span className="dd-fact__icon">📍</span>
                  <div>
                    <p className="dd-fact__label">
                      {t("destinationDetail.state")}
                    </p>
                    <p className="dd-fact__value">{dest.state}</p>
                  </div>
                </div>
              )}

              {dest.region && (
                <div className="dd-fact">
                  <span className="dd-fact__icon">🗺️</span>
                  <div>
                    <p className="dd-fact__label">
                      {t("destinationDetail.region")}
                    </p>
                    <p className="dd-fact__value">{dest.region}</p>
                  </div>
                </div>
              )}

              <div className="dd-fact">
                <span className="dd-fact__icon">🌡️</span>
                <div>
                  <p className="dd-fact__label">
                    {t("destinationDetail.climate")}
                  </p>
                  <p className="dd-fact__value">
                    {t("destinationDetail.climateValue")}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="dd-body__right">
          <div className="dd-cta-card">
            <div className="dd-cta-card__top">
              <p className="dd-cta-card__label">
                {t("destinationDetail.ready")}
              </p>

              <h3 className="dd-cta-card__name">{dest.name}</h3>

              <p className="dd-cta-card__sub">
                {t("destinationDetail.planTrip")}
              </p>
            </div>

            <div className="dd-cta-card__perks">
              <div className="dd-perk">✈️ {t("destinationDetail.flightTrain")}</div>
              <div className="dd-perk">🚌 {t("destinationDetail.busFerry")}</div>
              <div className="dd-perk">🏨 {t("destinationDetail.hotelSelection")}</div>
              <div className="dd-perk">🧭 {t("packages.guideTitle")}</div>
              <div className="dd-perk">💳 {t("destinationDetail.razorpay")}</div>
            </div>

            <button
              className="dd-book-btn"
              onClick={() =>
                navigate(`/destination-booking/${dest._id}`, {
                  state: { destination: dest },
                })
              }
            >
              {t("destinationDetail.bookNow")}
            </button>

            <p className="dd-cta-card__secure">
              🔒 {t("destinationDetail.secureCheckout")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}