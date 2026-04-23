import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";
import kn from "./locales/kn.json";
import ml from "./locales/ml.json";
import ta from "./locales/ta.json";
import bn from "./locales/bn.json";
import or from "./locales/or.json";
import pa from "./locales/pa.json";
import gu from "./locales/gu.json";
import bho from "./locales/bho.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
  kn: { translation: kn },
  ml: { translation: ml },
  ta: { translation: ta },
  bn: { translation: bn },
  or: { translation: or },
  pa: { translation: pa },
  gu: { translation: gu },
  bho: { translation: bho },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "te", "kn", "ml", "ta", "bn", "or", "pa", "gu", "bho"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
