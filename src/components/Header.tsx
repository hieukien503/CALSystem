import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}
interface HeaderProps {
    selectedTool: string;
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Header: React.FC<HeaderProps> = ({
    selectedTool,
    setSelectedTool,
    user,
    setUser,
}) => {
    const [searchWidth, setSearchWidth] = useState<number>(
        window.innerWidth * 0.35
    );

    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("resize", handleSearchWidthChange);
        return () => {
            window.removeEventListener("resize", handleSearchWidthChange);
        };
    }, []);

    const handleSearchWidthChange = () => {
        setSearchWidth(window.innerWidth * 0.35);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTool(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // clear auth token
        setUser(null); // reset user state
        navigate("/view/login"); // redirect
    };

    return (
        <div className="flex flex-col">
            <header className="flex flex-col justify-center h-20">
                <div className="logo">
                    <img src="../image/Menu.svg" alt="Menu" className="menu-icon" />
                    <span>
                        <button className="btn" onClick={() => navigate("/view/home")}>
                            <div className="font-bold text-lg">GRAPHIC CALCULATOR</div>
                        </button>
                    </span>
                </div>
                <div className="search-wrapper" style={{ width: searchWidth }}>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search project..."
                        className="border border-gray-300 px-3 py-1 rounded-full w-52 text-sm focus:outline-none"
                    />
                    <div id="results"></div>
                </div>
                <nav>
                    <ul className="flex items-center gap-3">
                        <li>
                            <select
                                className="border border-gray-300 px-2 py-1 rounded text-sm"
                                value={selectedTool}
                                onChange={handleChange}
                            >
                                <option value="2d-graph">2D Geometry</option>
                                <option value="3d-graph">3D Geometry</option>
                                <option value="3d-calc">3D Calculator</option>
                            </select>
                        </li>

                        {!user ? (
                            <li>
                                <button className="btn" onClick={() => navigate("/view/login")}>
                                    Login/Signup
                                </button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <button
                                        className="btn"
                                        onClick={() => navigate("/view/profile")}
                                    >
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button className="btn" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
        </div>
    );
};

export default Header;
