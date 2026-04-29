import React from "react";
import { useTranslation } from "react-i18next";
import "./MapPreview.css";

const MapPreview = () => {
  const { t } = useTranslation();

  return (
    <div className="map">
      <h2>{t('map.title')}</h2>
      <button>{t('home2.openMap')}</button>
    </div>
  );
};

export default MapPreview;