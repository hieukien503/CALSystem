import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { t } from "../translation/i18n";

interface Collaborator {
    _id?: string;
    email: string;
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
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    // Fetch project data
    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/projects/${id}/${user?._id || "null"}`, {
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
            collaborators: [...project.collaborators, { email: "", role: "viewer" }],
        });
    };

    // Update collaborator
    const updateCollaborator = (index: number, key: string, value: string) => {
        if (!project) return;
        const updated = [...project.collaborators];
        updated[index] = { ...updated[index], [key]: value };
        setProject({ ...project, collaborators: updated });
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/projects/${project._id}`, {
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

            alert(t("projectUpdated"));
        } catch (err: any) {
            console.error("Error updating project:", err);
            alert(t("projectUpdateFailed"));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>{t("loadingProject")}</div>;
    if (error) return <div>{t("projectFetchFailed")}</div>;
    if (!project) return <div>{t("projectNotFound")}</div>;

    return (
        <div>
            <h1 className="upper-main"
                style={{
                    backgroundColor: "#9346DC"
                }}
            >
                {t("editProject")}
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
                            <label className="form-label">{t("projectName")}</label>
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
                            <label className="form-label">{t("description")}</label>
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
                            <label className="form-label">{t("visibility")}</label>
                            <select
                                name="sharing"
                                className="form-select"
                                value={project.sharing}
                                onChange={handleChange}
                            >
                                <option value="private">{t("private")}</option>
                                <option value="public">{t("public")}</option>
                            </select>
                        </div>

                        {/* Collaborators */}
                        <div className="mb-4">
                            <label className="form-label d-flex justify-content-between align-items-center">
                                <span>{t("collaborators")}</span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addCollaborator}
                                >
                                    + {t("addCollaborator")}
                                </button>
                            </label>

                            {project.collaborators.length === 0 && (
                                <p className="text-muted">{t("noCollaborators")}</p>
                            )}

                            {project.collaborators.map((col, index) => (
                                <div key={index} className="d-flex align-items-center gap-2 mb-2">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder={t("email")}
                                        value={col.email}
                                        onChange={(e) => updateCollaborator(index, "email", e.target.value)}
                                        required
                                    />
                                    <select
                                        className="form-select"
                                        style={{ width: "150px" }}
                                        value={col.role}
                                        onChange={(e) => updateCollaborator(index, "role", e.target.value)}
                                    >
                                        <option value="viewer">{t("viewer")}</option>
                                        <option value="editor">{t("editor")}</option>
                                    </select>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeCollaborator(index)}
                                    >
                                        ✕
                                    </button>
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
                                {t("return")}
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? t("saving") : t("saveChanges")}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditProjectPage;
