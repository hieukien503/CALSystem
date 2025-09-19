import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}
interface LoginProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login: React.FC<LoginProps> = ({ user, setUser }) => {
    const navigate = useNavigate();

    // local form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            // example: backend returns { userId, name, token }
            localStorage.setItem("token", data.token);
            setUser(data.user); // update global state

            navigate("../view/home"); // redirect after login
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div>
            <h1
                className="upper-main"
                style={{
                    backgroundColor: "#9992B9",
                }}
            >
                Login
            </h1>
            <div
                className="inner-main text-gray-600 align-items-center text-xl"
                style={{
                    height: "100%",
                    margin: "50px",
                }}
            >
                <div className="card shadow">
                    <div
                        className="d-flex flex-column card-body"
                        style={{
                            width: "600px",
                        }}
                    >
                        <div className="d-flex flex-column text-center">
                            <div className="fw-bold fs-3">Login</div>
                            <div>Sign in to your Geometry Learning account</div>
                        </div>

                        <form onSubmit={handleSubmit} id="form">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    id="email"
                                    placeholder="your.email@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <a href="#" className="accent-blue">
                                    Forget password?
                                </a>
                            </div>

                            {error && <div className="text-danger mb-3">{error}</div>}

                            <button type="submit" className="btn btn-dark w-100">
                                Submit
                            </button>
                        </form>
                        <div className="d-flex flex-row align-self-center text-center gap-2">
                            <div>Don't have an account?</div>
                            <div
                                className="accent-blue"
                                onClick={() => navigate("/view/signup")}
                                style={{
                                    cursor: "pointer",
                                }}
                            >
                                Sign up
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
