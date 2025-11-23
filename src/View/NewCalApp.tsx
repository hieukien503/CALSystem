import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}

const NewCalApp: React.FC = () => {
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
                    title: "Untitled Project"
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
            // use Mongo _id for routing
            navigate(`/view/project/${project._id}`);
        };

        createNewProject();
    }, [navigate]);


    return <div>Creating new project...</div>;
};

export default NewCalApp;
