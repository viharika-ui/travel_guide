import React from "react";
import { useTranslation } from "react-i18next";
import "./FeaturedDestinations.css";

const FeaturedDestinations = ({ destinations }) => {
  const { t } = useTranslation();

  return (
    <div className="destinations">
      <h2>{t('featuredDestinations.title')}</h2>

      <div className="dest-grid">
        {destinations.slice(0, 4).map((item) => (
          <div className="card" key={item._id}>
            <img src={item.image} alt="" />
            <h3>{item.name}</h3>
            <p>{item.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedDestinations;