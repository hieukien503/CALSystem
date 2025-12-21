import React, { RefObject, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "../translation/i18n";

// interface User {
//     _id: string;
//     name: string;
//     email: string;
//     role: string;
//     project: string[];
// }

interface NewCalAppProps {
    idRef: RefObject<{ "2d-graph": string, "3d-graph": string }>,
    updateId: (newId: { "2d-graph": string; "3d-graph": string; }) => void;
    selectedTool: string;
}

const NewCalApp: React.FC<NewCalAppProps> = ({ idRef, updateId, selectedTool }) => {
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
                    title: t("untitledProject"),
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

            let newId: { "2d-graph": string, "3d-graph": string } = (selectedTool === "2d-graph" ?   
                { "2d-graph": project._id, "3d-graph": idRef.current['3d-graph'] } : 
                { "2d-graph": idRef.current['2d-graph'], "3d-graph": project._id }
            );

            updateId(newId);
            // use Mongo _id for routing
            navigate(`/view/project/${project._id}`);
        };

        createNewProject();
    }, [navigate, idRef, selectedTool, token, updateId, user]);


    return <div>{t("createNewProject")}</div>;
};

export default NewCalApp;
