import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from "react-router-dom";
import { lazy, Suspense } from 'react';

const Project3D = lazy(() => import('./Project/Project3D'));
const Project2D = lazy(() => import('./Project/Project2D'));

// interface User {
//     _id: string;
//     name: string;
//     email: string;
//     role: string;
//     project: string[];
// }

interface RenderToolProps {
    id?: { "2d-graph": string, "3d-graph": string };
    setId: React.Dispatch<React.SetStateAction<{ "2d-graph": string, "3d-graph": string }>>;
    selectedTool: string;
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
}

const RenderTool: React.FC<RenderToolProps> = ({
    id,
    selectedTool,
    setSelectedTool,
    setId
}) => {
    const navigate = useNavigate();
    const { id: projectId } = useParams();
    console.log(projectId);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    useEffect(() => {
        // -----------------------------------------------------------------
        // CASE 1: URL already has a project ID → load existing project
        // -----------------------------------------------------------------
        if (projectId) {
            setLoading(true);
            fetch(
                `${process.env.REACT_APP_API_URL}/api/projects/${projectId}/${user?._id || "null"}`,
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                }
            )
                .then(async (res) => {
                    if (res.status === 403) {
                        navigate("/view/403");
                        return;
                    }
                    if (!res.ok) {
                        throw new Error("Failed to load project");
                    }

                    const data = await res.json();
                    setProject(data);

                    // Update id map (2d or 3d)
                    const newId =
                        selectedTool === "2d-graph"
                            ? { "2d-graph": projectId, "3d-graph": id?.["3d-graph"] || "" }
                            : { "2d-graph": id?.["2d-graph"] || "", "3d-graph": projectId };

                    setId(newId);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));

            return;
        }

        // -----------------------------------------------------------------
        // CASE 2: No project ID in URL → create a new project
        // -----------------------------------------------------------------
        const createNewProject = async () => {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/projects`, {
                method: "POST",
                headers: token
                    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
                    : { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _id: user?._id,
                    title: "Untitled Project",
                    mode: selectedTool,
                }),
            });

            const newProject = await res.json();
            setProject(newProject);

            // Add project to user list
            if (user) {
                await fetch(`${process.env.REACT_APP_API_URL}/api/projects/add/`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        _id: user._id,
                        projectId: newProject._id,
                    }),
                });
            }

            // Update id map
            const newId =
                selectedTool === "2d-graph"
                    ? { "2d-graph": newProject._id, "3d-graph": id?.["3d-graph"] || "" }
                    : { "2d-graph": id?.["2d-graph"] || "", "3d-graph": newProject._id };

            setId(newId);

            // Navigate using new project ID
            navigate(`/view/project/${newProject._id}`);
            setLoading(false);
        };

        createNewProject();
        // eslint-disable-next-line
    }, [projectId, selectedTool, navigate, setId, token, user]);

    if (loading) return <div className="p-5 text-center">Loading Project...</div>;
    if (!project) return <div className="p-5 text-center">Project not found.</div>;
    if (selectedTool === '2d-graph') {
        return (
            <Suspense fallback={<div className="p-5 text-center">Loading Project...</div>}>
                <Project2D
                    id={id!['2d-graph']}
                    navigate={navigate}
                    {...project}
                >

                </Project2D>
            </Suspense>
        )
    }

    else {
        return (
            <Suspense fallback={<div className="p-5 text-center">Loading Project...</div>}>
                <Project3D
                    id={id!['2d-graph']}
                    navigate={navigate}
                    {...project}
                >

                </Project3D>
            </Suspense>
        )
    }
};

export default RenderTool;
