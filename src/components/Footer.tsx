import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [lang, setLang] = useState(
        sessionStorage.getItem("lang") || "vi"
    );

    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // const selectedLang = e.target.value;
        // sessionStorage.setItem("lang", selectedLang);
        // setLang(selectedLang);

        // // Reload so translations apply everywhere
        // window.location.reload();
        const selectedLang = e.target.value;
        sessionStorage.setItem("lang", selectedLang);
        setLang(selectedLang);
        i18n.changeLanguage(selectedLang);
    };

    return (
        <footer>
            <div className="left">
                {t("footerCopyright")}
            </div>

            <form>
                <select
                    value={lang}
                    onChange={handleLangChange}
                    className="form-select w-auto d-inline"

                >
                    <option value="vi">{t("languageVietnamese")}</option>
                    <option value="en">{t("languageEnglish")}</option>
                </select>
            </form>

            <div className="right">
                <nav>
                    <ul className="navi-right gap-3">
                        <li onClick={() => navigate("/view/home")}>
                            {t("topPage")}
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
