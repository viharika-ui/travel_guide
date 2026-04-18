import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./explore.css";
import { regions, places } from "../data/exploreData";

export default function Explore() {
  const [activeRegion, setActiveRegion] = useState("All");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const filteredPlaces =
    activeRegion === "All"
      ? places
      : places.filter((p) => p.region === activeRegion);

  return (
    <div className="explore-page">

      {/* HERO */}
      <div className="explore-hero">
        <h1>{t('explore.heroTitle')}</h1>
        <p>{t('explore.heroSubtitle')}</p>
      </div>

      {/* DECISION BOXES */}
      <div className="decision-section">
        <div className="decision-card">
          <h2>{t('explore.decidedTitle')}</h2>
          <p>{t('explore.decidedDesc')}</p>
          <button onClick={() => navigate("/destination/1")}>
            {t('explore.browseDestinations')}
          </button>
        </div>

        <div className="decision-card">
          <h2>{t('explore.notSureTitle')}</h2>
          <p>{t('explore.notSureDesc')}</p>
          <button style={{marginTop:"55px"}} onClick={() => navigate("/packages")}>
            {t('explore.viewPackages')}
          </button>
        </div>
      </div>

    </div>
  );
}