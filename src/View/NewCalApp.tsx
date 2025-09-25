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

    useEffect(() => {
        const createNewProject = async () => {
            let res = await fetch("http://localhost:3000/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Untitled Project" })
            });
            const project = await res.json();

            if (user) { // add new project to user's project list if new user
                await fetch(`http://localhost:3000/api/projects/add/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user._id,
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
