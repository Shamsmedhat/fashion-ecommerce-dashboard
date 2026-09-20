import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ar from "./locales/ar.json";
import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

// Keeps the document direction and lang in sync with the active language.
export function applyDirection(lng: string): void {
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
  document.documentElement.dir = dir;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "app-language",
    },
  });

applyDirection(i18n.resolvedLanguage ?? "en");
i18n.on("languageChanged", applyDirection);

export default i18n;
