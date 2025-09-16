import React, { useEffect, useState } from 'react';
import Project2D from './Project/Project2D';
import Project3D from './Project/Project3D';
import { v4 as uuidv4 } from 'uuid'

const Header = () => {
    const [selectedTool, setSelectedTool] = useState<string>('2d-graph');
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

    const renderTool = () => {
        const path = selectedTool
        if (path === "3d-graph") {
            return (
                <div className="flex flex-col">
                    <main className="outer-main">
                        <div className="inner-main text-center text-gray-600 text-xl flex-grow">
                            <Project3D
                                id={uuidv4()}
                                title={'2D Geometry'}
                                description={'Test Geometry'}
                                sharing={'public'}
                                projectVersion={{
                                    versionName: 'alpha',
                                    versionNumber: '1.0',
                                    createdAt: new Date().toString(),
                                    updatedAt: new Date().toString(),
                                    updatedBy: 'Kien'
                                }}
                                ownedBy='Kien'
                                collaborators={[]}
                            />
                        </div>
                    </main>
                </div>
            )
        }

        else {
            return (
                <div className="flex flex-col">
                    <main className="outer-main">
                        <div className="inner-main text-center text-gray-600 text-xl flex-grow">
                            <Project2D
                                id={uuidv4()}
                                title={'2D Geometry'}
                                description={'Test Geometry'}
                                sharing={'public'}
                                projectVersion={{
                                    versionName: 'alpha',
                                    versionNumber: '1.0',
                                    createdAt: new Date().toString(),
                                    updatedAt: new Date().toString(),
                                    updatedBy: 'Kien'
                                }}
                                ownedBy='Kien'
                                collaborators={[]}
                            />
                        </div>
                    </main>
                </div>
            )
        }
    }
    return (
        <div className="flex flex-col">
            <header className="flex flex-col justify-center h-20">
                <div className="logo">
                    <img src="image/Menu.svg" alt="Menu" className="menu-icon"/>
                    <span><a href="index.php">
                        <button className="btn">
                            <div className="font-bold text-lg">GRAPHIC CALCULATOR</div>
                        </button>
                    </a></span>
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