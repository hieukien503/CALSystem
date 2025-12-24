import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

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
    idRef: React.RefObject<{ "2d-graph": string, "3d-graph": string }>,
    updateId: (newId: { "2d-graph": string; "3d-graph": string; }) => void;
    selectedTool: string;
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
}

const RenderTool: React.FC<RenderToolProps> = ({
    idRef,
    selectedTool,
    setSelectedTool,
    updateId
}) => {
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    const navigatedToolRef = React.useRef<"2d-graph" | "3d-graph" | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (idRef.current[selectedTool as "2d-graph" | "3d-graph"].length === 0) {
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
                        ? { "2d-graph": newProject._id, "3d-graph": idRef.current["3d-graph"] }
                        : { "2d-graph": idRef.current["2d-graph"], "3d-graph": newProject._id };

                setProject(newProject);
                updateId(newId);
                setLoading(false);
            }

            createNewProject();
            return;
        }
        
        fetch(`${process.env.REACT_APP_API_URL}/api/projects/${idRef.current[selectedTool as "2d-graph" | "3d-graph"]}/${user?._id || "null"}`, {
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
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

        return;
        // eslint-disable-next-line
    }, [selectedTool, navigate, updateId, token, idRef, user]);

    useEffect(() => {
        if (!project || loading) return;
        if (navigatedToolRef.current === selectedTool) return;
        navigatedToolRef.current = selectedTool as "2d-graph" | "3d-graph" | null;
        navigate(`/view/project/${idRef.current[selectedTool as "2d-graph" | "3d-graph"]}`);
        // eslint-disable-next-line
    }, [project, loading, selectedTool, navigate]);

    if (loading) return <div className="p-5 text-center">{t("loadingProject")}</div>;
    if (!project) return <div className="p-5 text-center">{t("projectNotFound")}</div>;

    if (selectedTool === '2d-graph') {
        return (
            <Suspense fallback={<div className="p-5 text-center">{t("loadingProject")}</div>}>
                <Project2D
                    id={idRef.current['2d-graph']}
                    navigate={navigate}
                    {...project}
                >

                </Project2D>
            </Suspense>
        )
    }

    else {
        return (
            <Suspense fallback={<div className="p-5 text-center">{t("loadingProject")}</div>}>
                <Project3D
                    id={idRef.current['3d-graph']}
                    navigate={navigate}
                    {...project}
                >

                </Project3D>
            </Suspense>
        )
    }
};

export default RenderTool;
