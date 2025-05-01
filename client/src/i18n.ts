import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Static imports
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import esCommon from "./locales/es/common.json";
import esAuth from "./locales/es/auth.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
      },
      es: {
        common: esCommon,
        auth: esAuth,
      },
    },
    fallbackLng: "en",
    ns: ["common", "auth"], // declare all namespaces used
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
