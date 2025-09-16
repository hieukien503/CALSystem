import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewCalApp: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const createNewProject = async () => {
            const res = await fetch("http://localhost:3000/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Untitled Project" })
            });
            const project = await res.json();

            // use Mongo _id for routing
            navigate(`/view/project/${project._id}`);
        };

        createNewProject();
    }, [navigate]);


    return <div>Creating new project...</div>;
};

export default NewCalApp;
