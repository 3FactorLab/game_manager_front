/**
 * i18n.ts
 * Internationalization configuration using i18next.
 * Currently supports English (en) as default language.
 * Spanish translations exist but are not loaded yet.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";

// Initialize i18next with React integration
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en, // English translations
    },
    // TODO: Add Spanish translations
    // es: { translation: es }
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback if translation missing
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
});

// Exported to main.tsx for application-wide i18n support
export default i18n;
