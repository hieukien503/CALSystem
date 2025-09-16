import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="upper-main" color="#46443f">
                Home
            </h1>
            <div className="inner-main text-center text-gray-600 align-items-center text-xl"
                style={{
                    height: "100%",
                    margin: "50px"
                }}
            >
                <div className="d-flex flex-column justify-content-center align-content-center text-center text-gray-600 text-xl gap-3"
                    style={{
                        height: "100%",
                        marginBottom: "200px"
                    }}
                >
                    <div className="fw-bold fs-2"

                    >Computer Aided Learning for Geometry</div>
                    <div>Interactive tools to visualize and understand geometric concepts for 9th and 12th grade students</div>
                </div>
                <div className="d-flex flex-column justify-content-center align-content-center text-center text-gray-600 text-xl gap-3"
                    style={{
                        height: "100%"
                    }}
                >
                    <button
                        style={{
                            width: "200px",
                            borderWidth: "5px"
                        }}
                        onClick={() => navigate("/view/project")}
                    >
                        CREATE NOW
                    </button>
                    <button
                        style={{
                            width: "200px",
                            borderWidth: "5px"
                        }}
                        onClick={() => navigate("/view/signup")}
                    >
                        SIGN UP
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Home;
                   