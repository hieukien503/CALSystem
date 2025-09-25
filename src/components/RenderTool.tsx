import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Project2D from './Project/Project2D';
import Project3D from './Project/Project3D';
import { v4 as uuidv4 } from 'uuid'

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}
interface RenderToolProps {
    selectedTool: string;
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
}


const RenderTool: React.FC<RenderToolProps> = ({
    selectedTool,
    setSelectedTool
}) => {
    const path = selectedTool;
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    if (path === "3d-graph") {
        return (
            <Project3D
                id={uuidv4()}
                title={'3D Geometry'}
                description={'Test Geometry'}
                sharing={'public'}
                projectVersion={{
                    versionName: 'alpha',
                    versionNumber: '1.0',
                    createdAt: new Date().toString(),
                    updatedAt: new Date().toString(),
                    updatedBy: user?.name || ""
                }}
                ownedBy='Kien'
                collaborators={[]}
            />
        )
    }
    else {
        return (
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
                    updatedBy: user?.name || ""
                }}
                ownedBy='Kien'
                collaborators={[]}
            />
        )
    }
};

export default RenderTool;
