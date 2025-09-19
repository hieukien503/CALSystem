import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}
interface NewCalAppProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const NewCalApp: React.FC<NewCalAppProps> = ({ user, setUser }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const createNewProject = async () => {
            let res = await fetch("http://localhost:3000/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Untitled Project" })
            });
            const project = await res.json();

            console.log("body: ", JSON.stringify({
                userId: user?._id,
                projectId: project._id,
            }))

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
