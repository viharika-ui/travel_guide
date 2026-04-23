import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../api/axios";

export default function Profile() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const { currentLanguage, setLanguage, languageOptions } = useLanguage();
  const [name, setName] = useState(user?.name || "");
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || currentLanguage);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.patch("/users/profile", { name, preferredLanguage });
      setLanguage(preferredLanguage);
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (_) {}
  };

  return (
    <div className="max-w-md">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600">{t("auth.name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">{t("auth.email")}</label>
          <input type="email" value={user?.email || ""} disabled className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">{t("dashboard.preferredLanguage")}</label>
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 mt-1"
          >
            {languageOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full py-3 rounded-lg bg-saffron text-white font-medium">
          {t("dashboard.save")}
        </button>
        {saved && <p className="text-green-600 text-sm">Saved.</p>}
      </form>
    </div>
  );
}
