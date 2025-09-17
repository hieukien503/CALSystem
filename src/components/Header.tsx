import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
interface HeaderProps {       // for input parameters
    selectedTool: string,
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>
}

const Header: React.FC<HeaderProps> = ({ selectedTool, setSelectedTool }) => {
    const [searchWidth, setSearchWidth] = useState<number>(window.innerWidth * 0.35);

    useEffect(() => {
        window.addEventListener('resize', handleSearchWidthChange);
        return () => {
            window.removeEventListener('resize', handleSearchWidthChange);
        }
    }, [searchWidth]);

    const handleSearchWidthChange = () => {
        setSearchWidth(window.innerWidth * 0.35)
    }

    // Handle dropdown change with explicit typing
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTool(e.target.value);
    };

    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <header className="flex flex-col justify-center h-20">
                <div className="logo">
                    <img src="image/Menu.svg" alt="Menu" className="menu-icon"/>
                    <span>
                        <button className="btn"
                            onClick={() => navigate("/view/home")}
                        >
                            <div className="font-bold text-lg">GRAPHIC CALCULATOR</div>
                        </button>
                    </span>
                </div>
                <div className="search-wrapper" style={{width: searchWidth}}>
                    <input type="text" id="search" placeholder="Search project..."
                        className="border border-gray-300 px-3 py-1 rounded-full w-52 text-sm focus:outline-none"/>
                    <div id="results"></div>
                </div>
                <nav>
                    <ul className="flex items-center gap-3">
                        <li>
                            <select className="border border-gray-300 px-2 py-1 rounded text-sm" value={selectedTool} onChange={handleChange}>
                                <option value="2d-graph">2D Geometry</option>
                                <option value="3d-graph">3D Geometry</option>
                                <option value="3d-calc">3D Calculator</option>
                            </select>
                        </li>
                        <li><span>
                            <button className='btn'
                                onClick={() => navigate("/view/login")}
                            >
                                Login/Signup
                            </button>
                        </span></li>
                    </ul>
                </nav>
            </header>
        </div>
    );
};

export default Header;