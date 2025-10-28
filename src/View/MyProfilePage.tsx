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
    const { id } = useParams(); // read from URL: /view/profile/:id
    const [viewedUser, setViewedUser] = useState<User | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null); // which project's menu is open
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(sessionStorage.getItem("user") || "null");
    const token = sessionStorage.getItem("token");

    // Load user info (either from sessionStorage or fetch by id)
    useEffect(() => {
        const userId = id || loggedInUser?._id;
        if (!userId) return;

        fetch(`http://localhost:3001/api/auth/profile/${userId}`, {
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

    // Load projects of the viewed user
    useEffect(() => {
        if (viewedUser && viewedUser.project && viewedUser.project.length > 0) {
            fetch("http://localhost:3001/api/projects/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ ids: viewedUser.project }),
            })
                .then((res) => res.json())
                .then((data) => setProjects(data))
                .catch((err) => console.error("Error fetching projects:", err));
        } else {
            setProjects([]);
        }
    }, [viewedUser, token]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleDocClick = () => setOpenMenuId(null);
        window.addEventListener("click", handleDocClick);
        return () => window.removeEventListener("click", handleDocClick);
    }, []);

    if (!viewedUser) {
        return <div className="p-5 text-center">Loading profile...</div>;
    }

    // handlers
    const toggleMenu = (projId: string) => {
        setOpenMenuId((prev) => (prev === projId ? null : projId));
    };

    const handleEditProject = (projId: string) => {
        setOpenMenuId(null);
        // navigate to your edit route (adjust route if different)
        navigate(`/view/edit/project/${projId}`);
    };

    const handleRemoveProject = async (projId: string) => {
        setOpenMenuId(null);
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`http://localhost:3001/api/projects/${projId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to delete");
            }
            // remove project from local state
            setProjects((prev) => prev.filter((p) => p._id !== projId));
            // also update viewedUser.project if present
            setViewedUser((prev) => (prev ? { ...prev, project: prev.project.filter((id) => id !== projId) } : prev));
        } catch (err) {
            console.error("Error deleting project:", err);
            alert("Failed to delete project. See console for details.");
        }
    };

    return (
        <div>
            <h1
                className="upper-main"
                style={{
                    backgroundColor: "#5297b3",
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
                    <div className="text-center text-gray-600 text-xl" style={{ position: "relative" }}>
                        {/* Banner */}
                        <div style={{ width: "100%", height: "150px", backgroundColor: "#EDEDED" }} />
                        {/* Top buttons (only for own profile) */}
                        {(!id || id === loggedInUser?._id) && (
                            <div
                                className="d-flex flex-row align-items-center justify-content-end gap-6"
                                style={{
                                    width: "100%",
                                    height: "50px",
                                    backgroundColor: "#D9D9D9",
                                    paddingRight: "30px",
                                }}
                            >
                                <button style={{ backgroundColor: "inherit", border: 0 }}>Edit profile</button>
                                <button style={{ backgroundColor: "inherit", border: 0 }}>Setting</button>
                            </div>
                        )}

                        {/* Avatar + Name */}
                        <div
                            className="d-flex flex-row align-items-center justify-content-end gap-6"
                            style={{
                                position: "absolute",
                                left: 50,
                                bottom: 25,
                            }}
                        >
                            <div style={{ width: "100px", height: "100px", backgroundColor: "black", borderRadius: "50%" }} />
                            <div className="text-left">
                                <div className="fw-bold fs-4">{viewedUser.name}</div>
                                <div>Role: {viewedUser.role}</div>
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
                    <div className="d-flex flex-column align-items-center justify-content-start p-3 gap-3" style={{ backgroundColor: "white" }}>
                        {(!id || id === loggedInUser?._id) && (
                            <button style={{ width: "200px", borderWidth: "5px" }} onClick={() => navigate("/view/project")}>
                                + New Project
                            </button>
                        )}

                        <div className="d-flex flex-wrap gap-3 w-100">
                            {viewedUser.project.length === 0 ? (
                                <div className="text-center">Click + Add project to create a new project!</div>
                            ) : (
                                projects.map((proj) => (
                                    <div
                                        key={proj._id}
                                        className="d-flex flex-column align-items-left justify-content-start position-relative"
                                        style={{
                                            width: "200px",
                                            height: "300px",
                                            backgroundColor: "#F6F6F6",
                                            borderRadius: "5px",
                                            padding: "5px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => navigate(`/view/project/${proj._id}`)} // card click navigates
                                    >
                                        {/* 3-dots menu button (React-controlled) */}
                                        <div
                                            style={{ position: "absolute", top: 8, right: 8, zIndex: 999 }}
                                            onClick={(e) => e.stopPropagation()} // prevent card navigation
                                        >
                                            <button
                                                aria-haspopup="true"
                                                aria-expanded={openMenuId === proj._id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(proj._id);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Escape") setOpenMenuId(null);
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleMenu(proj._id);
                                                    }
                                                }}
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    fontSize: 18,
                                                    cursor: "pointer",
                                                    padding: "2px 6px",
                                                }}
                                                title="More actions"
                                            >
                                                ⋮
                                            </button>

                                            {/* Menu */}
                                            {openMenuId === proj._id && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: 28,
                                                        right: 0,
                                                        minWidth: 140,
                                                        background: "white",
                                                        border: "1px solid rgba(0,0,0,0.1)",
                                                        borderRadius: 6,
                                                        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                                                        zIndex: 1000,
                                                    }}
                                                    onClick={(e) => e.stopPropagation()} // clicking inside menu shouldn't close
                                                >
                                                    <button
                                                        className="d-block w-100 text-start"
                                                        style={{ padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer" }}
                                                        onClick={() => handleEditProject(proj._id)}
                                                    >
                                                        ✏️ Edit Project
                                                    </button>
                                                    <button
                                                        className="d-block w-100 text-start"
                                                        style={{
                                                            padding: "8px 12px",
                                                            background: "transparent",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            color: "crimson",
                                                        }}
                                                        onClick={() => handleRemoveProject(proj._id)}
                                                    >
                                                        🗑️ Remove Project
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Thumbnail (click navigates) */}
                                        <div
                                            className="d-flex flex-column align-items-center justify-content-start"
                                            style={{
                                                width: "190px",
                                                height: "190px",
                                                backgroundColor: "#D9D9D9",
                                                borderRadius: "5px",
                                            }}
                                        />

                                        <div className="d-flex flex-column text-left justify-content-start gap-2 mt-2 px-2">
                                            <div className="fw-bold">{proj.title}</div>
                                            <div>Shared: {proj.sharing}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
