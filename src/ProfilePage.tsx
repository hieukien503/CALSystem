import React from 'react';
import './index.css'; // Use Tailwind's CSS instead of App.css
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfilePage = () => {
    return (
        <div>
            <h1 className="upper-main" color="#46443f">
                Profile page
            </h1>
            <main className="outer-main">
                <div className="inner-main text-center text-gray-600 text-xl"
                    style={{
                        height: "100%",
                        overflow: "auto",
                    }}
                >
                    <div className="text-center text-gray-600 text-xl"
                        style={{
                            position: "relative"
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "150px",
                                backgroundColor: "#EDEDED",
                            }}
                        >
                        </div>
                        <div className="d-flex flex-row align-items-center justify-content-end gap-6"
                            style={{
                                width: "100%",
                                height: "50px",
                                backgroundColor: "#D9D9D9",
                                paddingRight: "30px"
                            }}
                        >
                            <button
                                style={{
                                    backgroundColor: "inherit", // match with parent color
                                    display: "flex",
                                    alignItems: "inherit",
                                    justifyContent: "inherit",
                                    border: "0px",
                                    borderTopLeftRadius: "10px",
                                    borderBottomLeftRadius: "10px"
                                }}
                            >
                                Edit profile
                            </button>
                            <button
                                style={{
                                    backgroundColor: "inherit", // match with parent color
                                    display: "flex",
                                    alignItems: "inherit",
                                    justifyContent: "inherit",
                                    border: "0px",
                                    borderTopLeftRadius: "10px",
                                    borderBottomLeftRadius: "10px"
                                }}
                            >
                                Setting
                            </button>
                        </div>
                        <div className="d-flex flex-row align-items-center justify-content-end gap-6"
                            style={{
                                position: "absolute",
                                left: 50,
                                bottom: 25,
                            }}
                        >
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    backgroundColor: "black",
                                    borderRadius: "50%",
                                }}
                            />
                            <div>Profile name</div>
                        </div>
                    </div>


                    <div className="d-flex flex-row align-items-center justify-content-start"
                        style={{
                            width: "100%",
                            height: "50px",
                            backgroundColor: "#EDEDED",
                        }}
                    >
                        <button className="d-flex flex-column align-items-center justify-content-center"
                            style={{
                                width: "300px",
                                height: "50px",
                                backgroundColor: "#C8B0F8",
                                color: "#5000F1"
                            }}
                        >
                            PROJECT
                        </button>
                        <button className="d-flex flex-column align-items-center justify-content-center"
                            style={{
                                width: "300px",
                                height: "50px",
                                backgroundColor: "white",
                                color: "black"
                            }}
                        >
                            FAVORITE
                        </button>
                    </div>
                    <div className="d-flex flex-row align-items-right justify-content-end p-2"
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "inherit",
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
                    <div className="d-flex flex-row align-items-center justify-content-start p-3 gap-3"
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "white",
                        }}
                    >
                        <div className="d-flex flex-column align-items-center justify-content-start p-3 gap-3"
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
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
                   