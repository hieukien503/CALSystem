import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./View/Home";
import CalApp from "./View/CalApp";
import Login from "./View/Login";
import ForgotPassword from "./View/ForgotPassword";
import SignUp from "./View/SignUp";
import MyProfilePage from "./View/MyProfilePage";
import ProfilePage from "./View/ProfilePage";
import SearchResults from "./View/SearchResults";
import NewCalApp from "./View/NewCalApp";
import EditProjectPage from "./View/EditProjectPage";
import E403 from "./View/E403";
import E404 from "./View/E404";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "bootstrap/dist/css/bootstrap.min.css";
import "./translation/i18n";

// interface User {
//     _id: string;
//     name: string;
//     email: string;
//     role: string;
//     project: string[];
// }
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function App() {
    const [selectedTool, setSelectedTool] = useState<string>('2d-graph');
    const idRef = React.useRef({
        "2d-graph": "",
        "3d-graph": ""
    });

    const updateId = (newId: {"2d-graph": string, "3d-graph": string}) => {
        idRef.current = newId; // store persistent ID
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Header selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/view/project/:id" element={<CalApp idRef={idRef} updateId={updateId} selectedTool={selectedTool} setSelectedTool={setSelectedTool} />} />
                            <Route path="/view/project" element={<NewCalApp idRef={idRef} updateId={updateId} selectedTool={selectedTool} />} />
                            <Route path="/view/login" element={<Login />} />
                            <Route path="/view/forgot-password" element={<ForgotPassword />} />
                            <Route path="/view/signup" element={<SignUp />} />
                            <Route path="/view/profile/:id" element={<ProfilePage />} />
                            <Route path="/view/myprofile/" element={<MyProfilePage />} />
                            <Route path="/view/search" element={<SearchResults />} />
                            <Route path="/view/edit/project/:id" element={<EditProjectPage />} />
                            <Route path="/view/403" element={<E403 />} />
                            <Route path="*" element={<E404 />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
