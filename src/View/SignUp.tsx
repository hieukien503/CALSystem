import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

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
            setError(t("passwordsNotMatch"));
            return;
        }

        setLoading(true);
        

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
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
                throw new Error(data.message || t("signupFailed"));
            }

            alert(t("signupSuccess"));
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
                {t("login")}
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
                            <div className="fw-bold fs-3">{t("signup")}</div>
                            <div>{t("createAccount")}</div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="d-flex flex-row justify-content-between">
                                <div className="mb-3" style={{ width: "250px" }}>
                                    <label htmlFor="firstName" className="form-label">
                                        {t("firstName")}:
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
                                        {t("lastName")}:
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
                                    {t("email")}:
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
                                    {t("password")}:
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
                                    {t("confirmPassword")}:
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
                                {loading ? t("signingUp") : t("submit")}
                            </button>
                        </form>

                        <div className="d-flex flex-row align-self-center text-center gap-2 mt-3">
                            <div>{t("alreadyHaveAccount")}</div>
                            <div
                                className="accent-blue"
                                onClick={() => navigate("/view/login")}
                                style={{ cursor: "pointer" }}
                            >
                                {t("login")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
