import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    // Load user info (either from sessionStorage or fetch by id)
    useEffect(() => {
        const userId = id || loggedInUser?._id;
        if (!userId) return;

        fetch(`${process.env.REACT_APP_API_URL}/api/auth/profile/${userId}`, {
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
            fetch(`${process.env.REACT_APP_API_URL}/api/projects/bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ ids: viewedUser.project }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setProjects(data);
                })
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
        return <div className="p-5 text-center">{t("loading")}</div>;
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
        if (!window.confirm(t("confirmDelete") as string | undefined)) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/projects/${projId}`, {
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
            alert(t("deleteFail"));
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
                {t("title")}
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
                                <button style={{ backgroundColor: "inherit", border: 0 }}>{t("editProfile")}</button>
                                <button style={{ backgroundColor: "inherit", border: 0 }}>{t("setting")}</button>
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
                                <div>{t("role")}: {viewedUser.role === "teacher" ? t("teacher") : t("student")}</div>
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
                            {t("project")}
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
                            {t("favorite")}
                        </button>
                    </div>

                    {/* Project section */}
                    <div className="d-flex flex-column align-items-center justify-content-start p-3 gap-3" style={{ backgroundColor: "white" }}>
                        {(!id || id === loggedInUser?._id) && (
                            <button style={{ width: "200px", borderWidth: "5px" }} onClick={() => navigate("/view/project")}>
                                {t("newProject")}
                            </button>
                        )}

                        <div className="d-flex flex-wrap gap-3 w-100">
                            {viewedUser.project.length === 0 ? (
                                <div className="text-center">{t("emptyProject")}</div>
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
                                                title={t("moreActions") as string | undefined}
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
                                                        ✏️ {t("editProject")}
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
                                                        🗑️ {t("removeProject")}
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
                                            <div>{t("shared")}: {proj.sharing === "public" ? t("public") : t("private")}</div>
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
