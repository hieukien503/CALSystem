// SearchResults.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Project {
    _id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    ownerName?: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const SearchResults: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q") || "";

    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!query) return;
        setLoading(true);

        Promise.all([
            fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
            fetch(`http://localhost:3001/api/search/users?q=${encodeURIComponent(query)}`).then(r => r.json()),
        ])
            .then(([projectData, userData]) => {
                setProjects(projectData.results || []);
                setUsers(userData.results || []);
            })
            .catch(err => console.error("Search error:", err))
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div>
            <h1 className="upper-main" color="#46443f">
                Search results for "{query}"
            </h1>
            <main className="outer-main">
                <div className="inner-main text-gray-600 text-xl" style={{ height: "100%", overflow: "auto" }}>
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <>
                            <h2 className="font-bold text-lg mb-3">Projects</h2>
                            <div className="d-flex flex-wrap gap-3">
                                {projects.length === 0 ? (
                                    <div>No matching projects</div>
                                ) : (
                                    projects.map(p => (
                                        <div
                                            key={p._id}
                                            className="d-flex flex-column align-items-left justify-content-start"
                                            style={{
                                                width: "200px",
                                                height: "300px",
                                                backgroundColor: "#F6F6F6",
                                                borderRadius: "5px",
                                                padding: "5px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => navigate(`/view/project/${p._id}`)}
                                        >
                                            <div
                                                className="d-flex flex-column align-items-center justify-content-start"
                                                style={{
                                                    width: "190px",
                                                    height: "190px",
                                                    backgroundColor: "#D9D9D9",
                                                    borderRadius: "5px",
                                                    backgroundImage: p.thumbnail ? `url(${p.thumbnail})` : "none",
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                            />
                                            <div className="d-flex flex-column text-left justify-content-start gap-2 mt-2">
                                                <div className="fw-bold">{p.title}</div>
                                                <div>{p.ownerName || "Unknown user"}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <h2 className="font-bold text-lg mt-5 mb-3">Users</h2>
                            <div className="d-flex flex-wrap gap-3">
                                {users.length === 0 ? (
                                    <div>No matching users</div>
                                ) : (
                                    users.map(u => (
                                        <div
                                            key={u._id}
                                            className="d-flex flex-column align-items-left justify-content-start"
                                            style={{
                                                width: "200px",
                                                height: "120px",
                                                backgroundColor: "#F6F6F6",
                                                borderRadius: "5px",
                                                padding: "10px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => navigate(`/view/profile/${u._id}`)}
                                        >
                                            <div className="fw-bold">{u.name}</div>
                                            <div className="text-sm">{u.email}</div>
                                            <div className="text-xs text-gray-500">{u.role}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SearchResults;
