import React from "react";
import { useTranslation } from "react-i18next";
import "./Packages.css";

const Packages = ({ packages }) => {
  const { t } = useTranslation();

  return (
    <div className="packages">
      <h2>{t('packages.heroTitle')}</h2>

      <div className="package-grid">
        {packages.slice(0, 3).map((pkg) => (
          <div className="card" key={pkg._id}>
            <img src={pkg.image} alt="" />
            <h3>{pkg.title}</h3>
            <p>{pkg.duration}</p>
            <p className="price">₹{pkg.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;