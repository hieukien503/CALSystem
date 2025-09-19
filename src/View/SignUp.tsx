import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        console.log("formData: ", formData);

        try {
            const res = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            alert("Signup successful! Please login.");
            navigate("/view/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1
                className="upper-main"
                style={{ backgroundColor: "#9992B9" }}
            >
                Login
            </h1>
            <div
                className="inner-main text-gray-600 align-items-center text-xl"
                style={{ height: "100%", margin: "50px" }}
            >
                <div className="card shadow">
                    <div
                        className="d-flex flex-column card-body"
                        style={{ width: "600px" }}
                    >
                        <div className="d-flex flex-column text-center">
                            <div className="fw-bold fs-3">Sign up</div>
                            <div>Create your Geometry Learning account</div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="d-flex flex-row justify-content-between">
                                <div className="mb-3" style={{ width: "250px" }}>
                                    <label htmlFor="firstName" className="form-label">
                                        First name:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3" style={{ width: "250px" }}>
                                    <label htmlFor="lastName" className="form-label">
                                        Last name:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password:
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                                disabled={loading}
                            >
                                {loading ? "Signing up..." : "Submit"}
                            </button>
                        </form>

                        <div className="d-flex flex-row align-self-center text-center gap-2 mt-3">
                            <div>Already have an account?</div>
                            <div
                                className="accent-blue"
                                onClick={() => navigate("/view/login")}
                                style={{ cursor: "pointer" }}
                            >
                                Login
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
