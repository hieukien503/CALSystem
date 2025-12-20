import en from "./en.json";
import vn from "./vn.json";

const translations = {
    en,
    vi: vn
};

export const t = (key) => {
    const lang = sessionStorage.getItem("lang") || "vi";
    return translations[lang]?.[key] || key;
};
