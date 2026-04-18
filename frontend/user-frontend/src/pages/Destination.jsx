import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchRegions,
  fetchStatesByRegion,
  fetchDestinationsByState,
} from "../api/destinationApi";
import "./Destination.css";

export default function Destination() {
  const { t } = useTranslation();

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const goHome = () => {
    setSelectedRegion(null);
    setSelectedState(null);
  };

  const goRegion = () => setSelectedState(null);

  if (selectedState) {
    return (
      <DestinationsLevel
        title={
          <>
            {t("destinationPage.explore")} <span>{selectedState.name}</span>
          </>
        }
        subtitle={t("destinationPage.famousDestinations")}
        breadcrumbs={[
          { label: t("destinationPage.regions"), onClick: goHome },
          { label: selectedRegion.name, onClick: goRegion },
          { label: selectedState.name, onClick: null },
        ]}
        fetcher={() => fetchDestinationsByState(selectedState._id)}
        renderCard={(dest) => <DestinationCard key={dest._id} dest={dest} />}
      />
    );
  }

  if (selectedRegion) {
    return (
      <DestinationsLevel
        title={
          <>
            {t("destinationPage.statesOf")} <span>{selectedRegion.name}</span>
          </>
        }
        subtitle={t("destinationPage.chooseState")}
        breadcrumbs={[
          { label: t("destinationPage.regions"), onClick: goHome },
          { label: selectedRegion.name, onClick: null },
        ]}
        fetcher={() => fetchStatesByRegion(selectedRegion._id)}
        renderCard={(state) => (
          <RegionCard
            key={state._id}
            name={state.name}
            image={state.image}
            onClick={() => setSelectedState(state)}
          />
        )}
      />
    );
  }

  return (
    <DestinationsLevel
      hero
      fetcher={fetchRegions}
      renderCard={(region) => (
        <RegionCard
          key={region._id}
          name={region.name}
          image={region.image}
          onClick={() => setSelectedRegion(region)}
          large
        />
      )}
    />
  );
}

function DestinationsLevel({
  hero,
  title,
  subtitle,
  breadcrumbs,
  fetcher,
  renderCard,
}) {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="dst-section">
      {breadcrumbs && <Breadcrumb crumbs={breadcrumbs} />}

      {hero ? (
        <div className="dst-hero">
          <p className="dst-hero-label">{t("destinationPage.discoverIndia")}</p>
          <h1 className="dst-hero-title">
            {t("destinationPage.whereToWander")}
          </h1>
          <p className="dst-hero-sub">
            {t("destinationPage.heroSubtitle")}
          </p>
        </div>
      ) : (
        <>
          <h1 className="dst-heading">{title}</h1>
          <p className="dst-subheading">{subtitle}</p>
        </>
      )}

      {loading && <LoadingGrid />}

      {!loading && error && (
        <div className="dst-error">
          <p className="dst-error__msg">{error}</p>
          <button className="dst-retry-btn" onClick={load}>
            {t("common.retry")}
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="dst-empty">{t("destinationPage.noResults")}</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className={`dst-grid${hero ? " dst-grid--regions" : ""}`}>
          {items.map(renderCard)}
        </div>
      )}
    </section>
  );
}

function RegionCard({ name, image, onClick, large }) {
  const { t } = useTranslation();

  return (
    <article
      className={`dst-card dst-card--region${large ? " dst-card--large" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="dst-card__img-wrap">
        <img src={image} alt={name} className="dst-card__img" loading="lazy" />
        <div className="dst-card__overlay" />
      </div>

      <div className="dst-card__body">
        <h2 className="dst-card__name">{name}</h2>
        <span className="dst-card__cta">{t("explore.viewDetails")}</span>
      </div>
    </article>
  );
}

function DestinationCard({ dest }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <article
      className="dst-card dst-card--dest dst-card--clickable"
      onClick={() => navigate(`/destination-detail/${dest._id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="dst-card__img-wrap">
        <img src={dest.image} alt={dest.name} className="dst-card__img" />
        <div className="dst-card__overlay" />
      </div>

      <div className="dst-card__body dst-card__body--dest">
        <h2 className="dst-card__name">{dest.name}</h2>
        <p className="dst-card__desc">{dest.description}</p>

        {dest.bestTimeToVisit && (
          <div className="dst-card__badge">
            <span>
              {t("destinationPage.bestTime")}{" "}
              <strong>{dest.bestTimeToVisit}</strong>
            </span>
          </div>
        )}

        <span className="dst-card__cta dst-card__cta--dest">
          {t("explore.viewDetails")}
        </span>
      </div>
    </article>
  );
}

function Breadcrumb({ crumbs }) {
  return (
    <nav className="dst-breadcrumb">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span>›</span>}
          {c.onClick ? (
            <button onClick={c.onClick}>{c.label}</button>
          ) : (
            <span>{c.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

function LoadingGrid() {
  return <div className="dst-grid">Loading...</div>;
}