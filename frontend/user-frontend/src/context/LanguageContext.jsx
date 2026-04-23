import { createContext, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "ta", label: "தமிழ்" },
  { code: "bn", label: "বাংলা" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "bho", label: "भोजपुरी" },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || "en";
  const setLanguage = useCallback(
    (code) => {
      i18n.changeLanguage(code);
      localStorage.setItem("i18nextLng", code);
      window.dispatchEvent(new Event("language-changed"));
    },
    [i18n]
  );
  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languageOptions: LANG_OPTIONS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export { LANG_OPTIONS };
