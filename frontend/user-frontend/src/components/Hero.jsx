import React from "react";
import { useTranslation } from "react-i18next";
import "./Hero.css";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="hero">
      <div className="hero-overlay">
        <h1>{t('home.heroTitle')}</h1>
        <p>{t('home.heroSubtitle')}</p>

        <input
          type="text"
          placeholder={t('home.searchPlaceholder')}
          className="search-box"
        />
      </div>
    </div>
  );
};

export default Hero;