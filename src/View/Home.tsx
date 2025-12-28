import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div>
            <h1 className="upper-main" color="#46443f">
                {t("home")}
            </h1>
            <main className="outer-main" style={{height: `${window.innerHeight * 0.67}px`}}>
                <div className="inner-main text-center d-flex flex-row justify-content-center align-items-center text-xl"
                    style={{
                        height: "100%",
                    }}
                >
                    <div className="d-flex flex-column justify-content-center align-content-center text-center text-gray-600 text-xl gap-3"
                        style={{
                            margin: "20px"
                        }}
                    >
                        <div className="fw-bold fs-2"
                        >{t("homeTitle")}</div>
                        <div>{t("homeSubtitle")}</div>
                        <div className="d-flex flex-row justify-content-center align-content-center text-center text-gray-600 text-xl gap-3"
                            style={{
                                height: "100%",
                                marginBottom: "20px",
                            }}
                        >
                            <button
                                style={{
                                    width: "200px",
                                    borderWidth: "5px"
                                }}
                                onClick={() => navigate("/view/project")}
                            >
                                {t("createNow")}
                            </button>
                            <button
                                style={{
                                    width: "200px",
                                    borderWidth: "5px"
                                }}
                                onClick={() => navigate("/view/signup")}
                            >
                                {t("signUp")}
                            </button>
                        </div>
                    </div>
                    <img src="image/homeProject.png" alt="Project"
                        style={{
                            height: "250px",
                            margin: "25px"
                        }}
                    />
                    
                </div>
            </main>
        </div>
    );
};

export default Home;
                   