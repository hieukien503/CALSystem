import React, { useState } from 'react';
import KonvaCanvas from './KonvaRender';
import ThreeDCanvas from './ThreeRender';

const Header = () => {
    const [selectedTool, setSelectedTool] = useState<string>('basic');

    // Handle dropdown change with explicit typing
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTool(e.target.value);
    };

    const renderTool = () => {
        const path = selectedTool
        if (path === "3d-graph") {
            return (
                <div className="flex flex-col min-h-screen">
                    <h1 className="upper-main" color="#46443f">
                        3D Geometry
                    </h1>
                    <main className="outer-main">
                        <div className="inner-main text-center text-gray-600 text-xl">
                            <ThreeDCanvas width={window.innerWidth} height={window.innerHeight} background_color='#ffffff' />
                        </div>
                    </main>
                </div>
            )
        }

        else {
            return (
                <div className="flex flex-col min-h-screen">
                    <h1 className="upper-main" color="#46443f">
                        2D Geometry
                    </h1>
                    <main className="outer-main">
                        <div className="inner-main text-center text-gray-600 text-xl">
                            <KonvaCanvas width={window.innerWidth} height={window.innerHeight} background_color='#ffffff' />
                        </div>
                    </main>
                </div>
            )
        }
    }
    return (
        // <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
        // <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
        // Replace Contact with option
        <div className="flex flex-col min-h-screen">
            <header className="flex items-center">
                <div className="logo">
                    <img src="image/Menu.svg" alt="Menu" className="menu-icon"/>
                    <span><a href="index.php">
                        <button className="btn">
                            <div className="font-bold text-lg">GRAPHIC CALCULATOR</div>
                        </button>
                    </a></span>
                </div>
                <div className="search-wrapper">
                    <input type="text" id="search" placeholder="Search project..."
                        className="border border-gray-300 px-3 py-1 rounded-full w-52 text-sm focus:outline-none"/>
                    <div id="results"></div>
                </div>
                <nav>
                    <ul className="flex items-center">
                        <li>
                            <select className="border border-gray-300 px-2 py-1 rounded text-sm" value={selectedTool} onChange={handleChange}>
                                <option value="2d-graph">2D Geometry</option>
                                <option value="3d-graph">3D Geometry</option>
                                <option value="3d-calc">3D Calculator</option>
                            </select>
                        </li>
                        <li><span><a href='index.php?page=login'>
                            <button className='btn'>Login/Signup</button>
                        </a></span></li>
                    </ul>
                </nav>
            </header>
            {renderTool()}
        </div>
        
    );
};

export default Header;
