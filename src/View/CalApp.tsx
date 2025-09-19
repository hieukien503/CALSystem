import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RenderTool from "../components/RenderTool";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}
interface CalAppProps {       // for input parameters
    selectedTool: string;
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const CalApp: React.FC<CalAppProps> = ({ selectedTool, setSelectedTool, user, setUser }) => {
    return (
        <main className="outer-main">
            <div className="inner-main text-center text-gray-600 text-xl">
                <RenderTool selectedTool={selectedTool} setSelectedTool={setSelectedTool}
                    user={user} setUser={setUser}
                />
            </div>
        </main>
    );
};

export default CalApp;