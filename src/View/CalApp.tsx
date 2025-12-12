import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RenderTool from "../components/RenderTool";
// interface User {
//     _id: string;
//     name: string;
//     email: string;
//     role: string;
//     project: string[];
// }

interface CalAppProps {       // for input parameters
    idRef: React.RefObject<{ "2d-graph": string, "3d-graph": string }>,
    updateId: (newId: { "2d-graph": string; "3d-graph": string; }) => void;
    selectedTool: string;
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
}

const CalApp: React.FC<CalAppProps> = ({ idRef, updateId, selectedTool, setSelectedTool }) => {
    return (
        <main className="outer-main">
            <div className="inner-main text-center text-gray-600 text-xl">
                <RenderTool idRef={idRef} updateId={updateId} selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            </div>
        </main>
    );
};

export default CalApp;