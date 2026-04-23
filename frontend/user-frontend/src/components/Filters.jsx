import { useTranslation } from "react-i18next";

export default function Filters({ regions, selectedRegionId, onRegionChange }) {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-600 mb-2">
        {t("explore.filterByRegion")}
      </label>
      <select
        value={selectedRegionId || ""}
        onChange={(e) => onRegionChange(e.target.value || null)}
        className="w-full max-w-xs rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-saffron focus:border-saffron"
      >
        <option value="">{t("explore.allRegions")}</option>
        {regions?.map((r) => (
          <option key={r._id} value={r._id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}
