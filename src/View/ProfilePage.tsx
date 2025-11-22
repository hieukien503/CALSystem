import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}
interface Project {
    _id: string;
    title: string;
    sharing: string;
}

const ProfilePage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const { id } = useParams(); // ✅ read from URL: /view/profile/:id
    const [viewedUser, setViewedUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(sessionStorage.getItem("user") || "null");

    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    const token = sessionStorage.getItem("token");

    // ✅ Load user info (either from sessionStorage or fetch by id)
    useEffect(() => {
        const userId = id || loggedInUser?._id;
        if (!userId) return;

        fetch(`https://bk-geometry.onrender.com/api/auth/profile/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then((res) => res.json())
            .then((data) => {
                setViewedUser(data);
                // If it's your own profile, update sessionStorage
                if (!id && loggedInUser && loggedInUser._id === userId) {
                    sessionStorage.setItem("user", JSON.stringify(data));
                }
            })
            .catch((err) => console.error("Error fetching profile:", err));
    }, [id, token, loggedInUser]);

    useEffect(() => { 
        if (viewedUser && viewedUser.project.length > 0) {
            fetch("https://bk-geometry.onrender.com/api/projects/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify({ ids: viewedUser.project }),
            })
                .then((res) => res.json())
                .then((data) => setProjects(data))
                .catch((err) => console.error("Error fetching projects:", err));
        }
    }, [viewedUser]);

    if (!viewedUser) {
        return <div className="p-5 text-center">Loading profile...</div>;
    }

    return (
        <div>
            <h1 className="upper-main"
                style={{
                    backgroundColor: "#5297b3"
                }}
            >
                Profile page
            </h1>
            <main className="outer-main">
                <div
                    className="inner-main text-center text-gray-600 text-xl"
                    style={{
                        height: "100%",
                        overflow: "auto",
                    }}
                >
                    <div
                        className="text-center text-gray-600 text-xl"
                        style={{ position: "relative" }}
                    >
                        {/* Banner */}
                        <div
                            style={{
                                width: "100%",
                                height: "150px",
                                backgroundColor: "#EDEDED",
                            }}
                        />
                        {/* Top buttons */}
                        <div
                            className="d-flex flex-row align-items-center justify-content-end gap-6"
                            style={{
                                width: "100%",
                                height: "50px",
                                backgroundColor: "#D9D9D9",
                                paddingRight: "30px",
                            }}
                        >
                            <button style={{ backgroundColor: "inherit", border: 0 }}>
                                Edit profile
                            </button>
                            <button style={{ backgroundColor: "inherit", border: 0 }}>
                                Setting
                            </button>
                        </div>

                        {/* Avatar + Name */}
                        <div
                            className="d-flex flex-row align-items-center justify-content-end gap-6"
                            style={{
                                position: "absolute",
                                left: 50,
                                bottom: 25,
                            }}
                        >
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    backgroundColor: "black",
                                    borderRadius: "50%",
                                }}
                            />
                            <div className="text-left">
                                <div className="fw-bold fs-4">
                                    {viewedUser.name}
                                </div>
                                <div>
                                    Role: {viewedUser.role}
                                </div>
                            </div>
                        </div>
                    </div>
                     
                    {/* Tabs */}
                    <div
                        className="d-flex flex-row align-items-center justify-content-start"
                        style={{
                            width: "100%",
                            height: "50px",
                            backgroundColor: "#EDEDED",
                        }}
                    >
                        <button
                            className="d-flex flex-column align-items-center justify-content-center"
                            style={{
                                width: "300px",
                                height: "50px",
                                backgroundColor: "#C8B0F8",
                                color: "#5000F1",
                            }}
                        >
                            PROJECT
                        </button>
                        <button
                            className="d-flex flex-column align-items-center justify-content-center"
                            style={{
                                width: "300px",
                                height: "50px",
                                backgroundColor: "white",
                                color: "black",
                            }}
                        >
                            FAVORITE
                        </button>
                    </div>

                    {/* Project section */}
                    <div
                        className="d-flex flex-column align-items-center justify-content-start p-3 gap-3"
                        style={{ backgroundColor: "white" }}
                    >
                        <div className="d-flex flex-wrap gap-3 w-100">
                            {
                                viewedUser.project.length === 0 ? (
                                //<div>No projects yet.</div>
                                <div></div>
                            ) : (
                                projects.map((proj) => (
                                    <div
                                        key={proj._id}
                                        className="d-flex flex-column align-items-left justify-content-start"
                                        style={{
                                            width: "200px",
                                            height: "300px",
                                            backgroundColor: "#F6F6F6",
                                            borderRadius: "5px",
                                            padding: "5px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => navigate(`/view/project/${proj._id}`)}
                                    >
                                        <div
                                            className="d-flex flex-column align-items-center justify-content-start"
                                            style={{
                                                width: "190px",
                                                height: "190px",
                                                backgroundColor: "#D9D9D9",
                                                borderRadius: "5px",
                                            }}
                                        />
                                        <div className="d-flex flex-column text-left justify-content-start gap-2">
                                            <div className="fw-bold">{proj.title}</div>
                                            <div>Shared: {proj.sharing}</div>
                                        </div>
                                    </div>
                                ))
                            ) }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
