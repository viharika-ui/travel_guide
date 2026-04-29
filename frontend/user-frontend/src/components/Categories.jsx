import React from "react";
import { useTranslation } from "react-i18next";
import "./Categories.css";

const Categories = () => {
  const { t } = useTranslation();

  const items = [
    "adventure",
    "beaches",
    "heritage",
    "nature",
  ];

  return (
    <div className="categories">
      <h2>{t("categories.title")}</h2>

      <div className="cat-list">
        {items.map((key, i) => (
          <div key={i} className="cat-item">
            {t(`categories.${key}`)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;