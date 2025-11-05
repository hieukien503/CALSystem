import { MouseSharp } from '@mui/icons-material';
import React from 'react';
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer>
            <div className="left">
                COPYRIGHT &#169; All rights reserved.
            </div>
            <div className="right">
                <nav>
                    <ul className="navi-right gap-3">
                        <li onClick={() => navigate("/view/home")}>Top page</li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
