// Header.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeaderProps {
    selectedTool: string;
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ selectedTool, setSelectedTool }) => {
    const [searchWidth, setSearchWidth] = useState<number>(window.innerWidth * 0.35);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    useEffect(() => {
        const handleSearchWidthChange = () => setSearchWidth(window.innerWidth * 0.35);
        window.addEventListener("resize", handleSearchWidthChange);
        return () => window.removeEventListener("resize", handleSearchWidthChange);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTool(e.target.value);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.setItem("user", "");
        navigate("/view/login");
    };

    const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            navigate(`/view/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <div className="flex flex-col">
            <header className="flex flex-col justify-center h-20">
                <div className="logo flex items-center gap-2">
                    <img src="/image/Menu.svg" alt="Menu" className="menu-icon" />
                    <button className="btn" onClick={() => navigate("/")}>
                        <div className="font-bold text-lg">{t("appTitle")}</div>
                    </button>
                </div>

                <div className="search-wrapper flex items-center gap-2" style={{ width: searchWidth }}>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchKey}
                        placeholder={t("searchPlaceholder") as string | undefined}
                        className="border border-gray-300 px-3 py-1 rounded-full w-full text-sm focus:outline-none"
                    />
                    <button
                        onClick={() => {
                            if (searchTerm.trim()) {
                                navigate(`/view/search?q=${encodeURIComponent(searchTerm.trim())}`);
                            }
                        }}
                        className="text-sm bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
                    >
                        🔍
                    </button>
                </div>

                <nav>
                    <ul className="flex items-center gap-3">
                        <li>
                            <select
                                className="border border-gray-300 px-2 py-1 rounded text-sm"
                                value={selectedTool}
                                onChange={handleChange}
                            >
                                <option value="2d-graph">{t("geometry2D")}</option>
                                <option value="3d-graph">{t("geometry3D")}</option>
                                {//<option value="3d-calc">3D Calculator</option>
                                }
                            </select>
                        </li>

                        {!user ? (
                            <li>
                                <button className="btn" onClick={() => navigate("/view/login")}>
                                    {t("loginSignup")}
                                </button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <button className="btn" onClick={() => navigate("/view/myprofile")}>
                                        {t("profile")}
                                    </button>
                                </li>
                                <li>
                                    <button className="btn" onClick={handleLogout}>
                                        {t("logout")}
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </div>
    );
};

export default Header;
