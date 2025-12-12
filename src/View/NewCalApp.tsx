import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}

interface NewCalAppProps {
    id: { "2d-graph": string, "3d-graph": string },
    setId: React.Dispatch<React.SetStateAction<{ "2d-graph": string, "3d-graph": string }>>;
    selectedTool: string;
}

const NewCalApp: React.FC<NewCalAppProps> = ({ id, setId, selectedTool }) => {
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const createNewProject = async () => {
            let res = await fetch(`${process.env.REACT_APP_API_URL}/api/projects`, {
                method: "POST",
                headers: 
                    token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } :
                        { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _id: user?._id,
                    title: "Untitled Project",
                    mode: selectedTool
                })
            });
            const project = await res.json();

            if (user) { // add new project to user's project list if new user
                await fetch(`${process.env.REACT_APP_API_URL}/api/projects/add/`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        _id: user._id,
                        projectId: project._id,
                    })
                });
            }

            let newId: { "2d-graph": string, "3d-graph": string };
            if (!id) {
                newId = selectedTool === "2d-graph" ?   { "2d-graph": project._id, "3d-graph": "" } : 
                                                        { "2d-graph": "", "3d-graph": project._id }
            }

            else {
                newId = selectedTool === "2d-graph" ?   { "2d-graph": project._id, "3d-graph": id['3d-graph'] } : 
                                                        { "2d-graph": id['2d-graph'], "3d-graph": project._id }
            }

            setId(newId);
            // use Mongo _id for routing
            navigate(`/view/project/${project._id}`);
        };

        createNewProject();
    }, [navigate]);


    return <div>Creating new project...</div>;
};

export default NewCalApp;
