import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { en } from "./lang/en";
import { ml } from "./lang/ml";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        resources: {
            en: en,
            ml: ml
        },
        fallbackLng: "en",
        lng: localStorage.getItem("i18nextLng") || "en",
    })

export default i18n;