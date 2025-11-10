import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Project2D from './Project/Project2D';
import Project3D from './Project/Project3D';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from "react-router-dom";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}

interface RenderToolProps {
    id?: string;
    selectedTool: string;
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
}

const RenderTool: React.FC<RenderToolProps> = ({
    id,
    selectedTool,
    setSelectedTool
}) => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // only load if there’s a project id in URL
        if (!id) {
            setLoading(false);
            return;
        }

        const token = sessionStorage.getItem("token");

        fetch(`http://localhost:3001/api/projects/${id}/${user?._id || "null"}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then(async (res) => {
                if (res.status === 403) {
                    navigate("/view/403");
                    return;
                }
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || "Failed to load project");
                }
                const data = await res.json();
                setProject(data);
            })
            .catch((err) => console.error("Error loading project:", err))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) return <div className="p-5 text-center">Loading project...</div>;

    // if you want to display default empty project when no id
    if (!project && !id) {
        return (
            selectedTool === "3d-graph" ? (
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
                    //ownedBy='Kien'
                    collaborators={[]}
                />
            ) : (
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
                    //ownedBy='Kien'
                    collaborators={[]}
                />
            )
        );
    }

    if (!project) return <div className="p-5 text-center">Project not found.</div>;

    // ✅ Render real project if loaded successfully
    return selectedTool === "3d-graph" ? (
        <Project3D {...project} />
    ) : (
        <Project2D {...project} />
    );
};

export default RenderTool;
