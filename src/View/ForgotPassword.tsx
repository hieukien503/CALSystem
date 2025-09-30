import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1 className="upper-main"
                style={{
                    backgroundColor: "#9992B9"
                }}
                >
                Forgot Password
            </h1>
            <div className="inner-main text-gray-600 align-items-center text-xl"
                style={{
                    height: "100%",
                    margin: "50px"
                }}
            >
                <div className="card shadow">
                    <div className="d-flex flex-column card-body"
                        style={{
                            width: "600px"
                        }}
                    >
                        <div className="d-flex flex-column text-center">
                            <div className="fw-bold fs-3"
                            >Forgot Password</div>
                            <div>Enter your email to reset your password</div>                   
                        </div>

                        <form action="php/login.php" method="POST" id="form">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="email" className="form-control" name="email" id="email"
                                    placeholder="your.email@example.com" required />
                            </div>

                            <button type="submit" className="btn btn-dark w-100">Send Reset Link</button>
                        </form>
                        <div className="d-flex flex-row align-self-center text-center gap-2">
                            <div>Don't have an account?</div>
                            <a href="#" className="accent-blue">Sign up</a>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Home;
                   