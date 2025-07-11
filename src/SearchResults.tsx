import React from 'react';
import './index.css'; // Use Tailwind's CSS instead of App.css
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfilePage = () => {
    return (
        <div>
            <h1 className="upper-main" color="#46443f">
                Search results
            </h1>
            <main className="outer-main">
                <div className="inner-main text-center text-gray-600 text-xl"
                    style={{
                        height: "100%",
                        overflow: "auto",
                    }}
                >
                    <div className="d-flex flex-row align-items-right justify-content-end p-2"
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "white",
                        }}
                    >
                        <nav>
                            <ul className="flex items-center">
                                <li>
                                    <select className="border border-gray-300 px-2 py-1 rounded text-sm">
                                        <option>Last modified</option>
                                        <option>Title</option>
                                    </select>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="d-flex flex-column align-items-center justify-content-between p-3 gap-3"
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "white",
                        }}
                    >
                        <div className="d-flex flex-row align-items-center justify-content-start gap-3"
                            style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "white",
                            }}
                        >
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-row align-items-center justify-content-start gap-3"
                            style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "white",
                            }}
                        >
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-left justify-content-start"
                                style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-start"
                                    style={{
                                        width: "190px",
                                        height: "190px",
                                        backgroundColor: "#D9D9D9",
                                        borderRadius: "5px"
                                    }}
                                />
                                <div className="d-flex flex-column text-left justify-content-start gap-2">
                                    <div className="fw-bold"
                                    >
                                        Project name
                                    </div>
                                    <div>
                                        Profile name
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
                   