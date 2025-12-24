import enTranslation from "./en.json";
import viTranslation from "./vn.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
.use(initReactI18next)
.init({
    lng: sessionStorage.getItem("lang") || "vi",
    fallbackLng: "vi",
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: { translation: enTranslation },
        vi: { translation: viTranslation },
    },
});

export default i18n;