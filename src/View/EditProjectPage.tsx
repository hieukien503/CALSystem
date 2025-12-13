import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Collaborator {
    id: string;
    name: string;
    role: string;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    sharing: string;
    collaborators: Collaborator[];
    ownedBy: string;
}

const EditProjectPage: React.FC = () => {
    const { id } = useParams(); // project ID from URL
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [userSearch, setUserSearch] = useState(""); // current input for searching users
    const [userResults, setUserResults] = useState<any[]>([]); // search results
    const [searching, setSearching] = useState(false);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    // Fetch project data
    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/projects/${id}/${user?._id || "null"}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to load project");
                setProject(data);
            } catch (err: any) {
                console.error("Error fetching project:", err);
                setError("Failed to fetch project data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, token]);

    useEffect(() => {
        if (!userSearch.trim()) {
            setUserResults([]);
            return;
        }

        setSearching(true);
        fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(userSearch)}`)
            .then((r) => r.json())
            .then((data) => {
                setUserResults(data.users || []);
            })
            .catch((err) => console.error("User search failed:", err))
            .finally(() => setSearching(false));
    }, [userSearch]);

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!project) return;
        const { name, value } = e.target;
        setProject({ ...project, [name]: value });
    };

    // Add new collaborator
    const addCollaborator = () => {
        if (!project) return;
        setProject({
            ...project,
            collaborators: [...project.collaborators, { id: "", name: "", role: "viewer" }],
        });
    };

    // Update collaborator
    const updateCollaborator = (index: number, key: string, value: string) => {
        console.log("index: ", index);
        console.log("key: ", key);
        console.log("value: ", value);
        if (!project) return;
        const updated = [...project.collaborators];
        updated[index] = { ...updated[index], [key]: value };
        setProject({ ...project, collaborators: updated });
        console.log("updated: ", updated);
        console.log("project: ", project);
    };

    // Remove collaborator
    const removeCollaborator = (index: number) => {
        if (!project) return;
        const updated = project.collaborators.filter((_, i) => i !== index);
        setProject({ ...project, collaborators: updated });
    };

    // Submit changes
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;

        setSaving(true);
        try {
            const res = await fetch(`http://localhost:3001/api/projects/${project._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: project.title,
                    description: project.description,
                    sharing: project.sharing,
                    collaborators: project.collaborators,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to update project");
            }
            console.log("collaborators: ", project.collaborators);
            alert("Project updated successfully!");
        } catch (err: any) {
            console.error("Error updating project:", err);
            alert("Failed to update project.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading project...</div>;
    if (error) return <div className="p-5 text-danger text-center">{error}</div>;
    if (!project) return <div className="p-5 text-center">Project not found.</div>;

    return (
        <div>
            <h1 className="upper-main"
                style={{
                    backgroundColor: "#9346DC"
                }}
            >
                Edit Project
            </h1>
            <main className="outer-main">
                <div
                    className="inner-main text-left text-gray-600 text-xl"
                    style={{
                        height: "100%",
                        overflow: "auto",
                    }}
                >
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                        {/* Title */}
                        <div className="mb-3">
                            <label className="form-label">Project Name</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={project.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                rows={3}
                                value={project.description || ""}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* Visibility */}
                        <div className="mb-3">
                            <label className="form-label">Visibility</label>
                            <select
                                name="sharing"
                                className="form-select"
                                value={project.sharing}
                                onChange={handleChange}
                            >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </div>

                        {/* Collaborators */}
                        <div className="mb-4">
                            <label className="form-label d-flex justify-content-between align-items-center">
                                <span>Collaborators</span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addCollaborator}
                                >
                                    + Add Collaborator
                                </button>
                            </label>

                            {project.collaborators.length === 0 && (
                                <p className="text-muted">No collaborators added yet.</p>
                            )}

                            {project.collaborators.map((col, index) => (
                                <div key={index} className="mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        {/* Searchable input for collaborator name */}
                                        <div style={{ position: "relative", flex: 1 }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search user by name..."
                                                value={col.name}
                                                onChange={(e) => {
                                                    updateCollaborator(index, "name", e.target.value);
                                                    setUserSearch(e.target.value);
                                                }}
                                                autoComplete="off"
                                            />
                                            {/* Suggestion dropdown */}
                                            {userSearch && userResults.length > 0 && (
                                                <ul
                                                    className="list-group position-absolute w-100 shadow-sm"
                                                    style={{ zIndex: 1000 }}
                                                >
                                                    {userResults.map((u) => (
                                                        <li
                                                            key={u._id}
                                                            className="list-group-item list-group-item-action"
                                                            onClick={() => {
                                                                updateCollaborator(index, "name", u.name);  
                                                                updateCollaborator(index, "id", u._id);   
                                                                setUserResults([]);
                                                                setUserSearch("");
                                                            }}
                                                        >
                                                            {u.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <select
                                            className="form-select"
                                            style={{ width: "150px" }}
                                            value={col.role}
                                            onChange={(e) => updateCollaborator(index, "role", e.target.value)}
                                        >
                                            <option value="viewer">Viewer</option>
                                            <option value="editor">Editor</option>
                                        </select>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeCollaborator(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit */}
                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(-1)}
                            >
                                Return
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditProjectPage;
