import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RenderTool from "../components/RenderTool";
import { useNavigate, useParams } from "react-router-dom";

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
}

const CalApp: React.FC<CalAppProps> = ({ selectedTool, setSelectedTool }) => {
    const { id } = useParams();
    return (
        <main className="outer-main">
            <div className="inner-main text-center text-gray-600 text-xl">
                <RenderTool id={id} selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            </div>
        </main>
    );
};

export default CalApp;