import React from "react";
import { useTranslation } from "react-i18next";
import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  const { t } = useTranslation();

  return (
    <div className="why">
      <h2>{t('whyChooseUs.title')}</h2>

      <div className="why-grid">
        <div>{t('whyChooseUs.trusted')}</div>
        <div>{t('whyChooseUs.affordable')}</div>
        <div>{t('whyChooseUs.easy')}</div>
        <div>{t('whyChooseUs.best')}</div>
      </div>
    </div>
  );
};

export default WhyChooseUs;