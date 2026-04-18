import React from "react";
import { useTranslation } from "react-i18next";
import "./Categories.css";

const Categories = () => {
  const { t } = useTranslation();

  const items = [
    t('categories.adventure'),
    t('categories.beaches'),
    t('categories.heritage'),
    t('categories.nature'),
  ];

  return (
    <div className="categories">
      <h2>{t('categories.title')}</h2>

      <div className="cat-list">
        {items.map((c, i) => (
          <div key={i} className="cat-item">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;