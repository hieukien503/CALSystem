import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { t } from "../translation/i18n";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    project: string[];
}

const Login = () => {
    const navigate = useNavigate();

    // local form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || t("loginError"));
                return;
            }

            // store in sessionStorage
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));

            navigate("../"); // redirect after login
        } catch (err) {
            console.log((err as Error).message);
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
                {t("login")}
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
                            <div className="fw-bold fs-3">{t("loginTitle")}</div>
                            <div>{t("loginSubtitle")}</div>
                        </div>

                        <form onSubmit={handleSubmit} id="form">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    {t("email")}:
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
                                    {t("password")}:
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
                                <div className="accent-blue"
                                onClick={() => navigate("/view/signup")}
                                style={{
                                    cursor: "pointer"
                                }}
                                >
                                    {t("forgetPassword")}
                                </div>
                            </div>

                            {error && <div className="text-danger mb-3">{error}</div>}

                            <button type="submit" className="btn btn-dark w-100">
                                {t("submit")}
                            </button>
                        </form>
                        <div className="d-flex flex-row align-self-center text-center gap-2">
                            <div>{t("noAccount")}</div>
                            <div
                                className="accent-blue"
                                onClick={() => navigate("/view/signup")}
                                style={{
                                    cursor: "pointer",
                                }}
                            >
                                {t("signUp")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
