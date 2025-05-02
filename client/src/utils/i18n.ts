import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Static imports

// English translations
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enChats from "./locales/en/chats.json";
import enSettings from "./locales/en/settings.json";
import enInfoMessages from "./locales/en/infoMessages.json";
import enMenus from "./locales/en/menus.json";

// Spanish translations
import esCommon from "./locales/es/common.json";
import esAuth from "./locales/es/auth.json";
import esChats from "./locales/es/chats.json";
import esSettings from "./locales/es/settings.json";
import esInfoMessages from "./locales/es/infoMessages.json";
import esMenus from "./locales/es/menus.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        chats: enChats,
        settings: enSettings,
        infoMessages: enInfoMessages,
        menus: enMenus,
      },
      es: {
        common: esCommon,
        auth: esAuth,
        chats: esChats,
        settings: esSettings,
        infoMessages: esInfoMessages,
        menus: esMenus,
      },
    },
    fallbackLng: "en",
    ns: ["common", "auth", "chats", "settings", "infoMessages", "menus"], // declare all namespaces used
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
